/**
 * Briefing Intelligence Engine
 *
 * Server-side analysis that transforms raw lead data into
 * opinionated daily direction. This is the core of what makes
 * Mission Control a decision engine, not a dashboard.
 *
 * Runs on every briefing page load. No AI calls — pure logic.
 */

/* ─── Types ─── */

export interface LeadSnapshot {
  id: number;
  fit_score: number;
  stage: string;
  next_action: string | null;
  next_action_at: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
  company_name: string | null;
  company_industry: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_title: string | null;
  contact_linkedin_url?: string | null;
  outreach_angle?: string | null;
  fit_reason?: string | null;
}

export interface StageCount {
  stage: string;
  count: number;
}

export interface ActivityRecord {
  type: string;
  body_preview: string | null;
  created_at: string;
  contact_name: string | null;
  company_name: string | null;
  lead_id?: number;
}

export interface MeetingRecord {
  id: number;
  booking_type: string;
  start_time: string;
  end_time: string;
  client_name: string;
  client_email: string;
  google_meet_url: string | null;
  status: string;
  notes: string | null;
}

export interface YesterdaySnapshot {
  total_active: number;
  hot_leads: number;
  overdue_count: number;
  stale_outreach: number;
  cooling_replies: number;
  neglected_count: number;
  avg_fit_score: number;
  stage_counts: Record<string, number>;
  insight_ids: string[];
}

export interface BriefingInput {
  pipelineStats: StageCount[];
  allLeads: LeadSnapshot[];
  overdueFollowUps: LeadSnapshot[];
  upcomingMeetings: MeetingRecord[];
  recentActivities: ActivityRecord[];
  /** Leads that changed stage in the last 24h */
  recentStageChanges: { lead_id: number; old_stage: string; new_stage: string; changed_at: string; contact_name: string | null; company_name: string | null }[];
  /** Leads imported in the last 24h */
  newLeadsToday: number;
  /** Total leads 24h ago (for delta) */
  totalLeadsYesterday: number;
  /** Yesterday's snapshot for day-over-day drift detection */
  yesterdaySnapshot?: YesterdaySnapshot | null;
}

/* ─── Computed Briefing Output ─── */

export interface Insight {
  id: string;
  severity: "critical" | "warning" | "info" | "positive";
  headline: string;
  detail: string;
  action: string;
  link: string;
  /** Sort priority (lower = more important) */
  weight: number;
}

export interface DailyTarget {
  lead: LeadSnapshot;
  rank: number;
  reason: string;
  action: string;
  urgencyScore: number;
  signals: string[];
}

export interface MomentumIndicator {
  label: string;
  value: number;
  change: number; // positive = good
  trend: "up" | "down" | "flat";
}

export interface DriftAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  metric: string;
  yesterday: number;
  today: number;
  delta: number;
  message: string;
}

export interface BriefingOutput {
  /** The single most important thing right now */
  topInsight: Insight | null;
  /** All insights, sorted by severity */
  insights: Insight[];
  /** 5 key daily targets with reasoning */
  targets: DailyTarget[];
  /** Momentum indicators for the health bar */
  momentum: MomentumIndicator[];
  /** Day-over-day drift alerts (requires yesterday snapshot) */
  driftAlerts: DriftAlert[];
  /** Natural language summary paragraph */
  narrativeSummary: string;
  /** Quick stats for the header */
  quickStats: {
    totalActive: number;
    overdueCount: number;
    hotLeads: number;
    meetingsThisWeek: number;
    newToday: number;
    stageChangesToday: number;
  };
  /** Snapshot data for persistence (caller saves to DB) */
  snapshotData: {
    total_active: number;
    hot_leads: number;
    overdue_count: number;
    stale_outreach: number;
    cooling_replies: number;
    neglected_count: number;
    meetings_booked: number;
    avg_fit_score: number;
    stage_counts: Record<string, number>;
    insight_ids: string[];
  };
}

/* ─── Engine ─── */

export function generateBriefing(input: BriefingInput): BriefingOutput {
  const now = Date.now();
  const insights: Insight[] = [];

  const activeLeads = input.allLeads.filter(
    (l) => !["suppressed", "lost"].includes(l.stage)
  );
  const totalActive = activeLeads.length;

  // ──────────────────────────────────────
  // INSIGHT DETECTION
  // ──────────────────────────────────────

  // 1. Empty state
  if (totalActive === 0) {
    insights.push({
      id: "no-leads",
      severity: "critical",
      headline: "No active leads",
      detail: "Mission Control needs lead data to generate direction. Import a CSV from any source to get started.",
      action: "Import your first leads",
      link: "crm",
      weight: 0,
    });
  }

  // 2. Overdue follow-ups — the #1 revenue leak
  if (input.overdueFollowUps.length > 0) {
    const highValueOverdue = input.overdueFollowUps.filter((l) => l.fit_score >= 70);
    const overdueNames = input.overdueFollowUps
      .slice(0, 3)
      .map((l) => l.contact_name || l.company_name || "Unknown")
      .join(", ");

    insights.push({
      id: "overdue-followups",
      severity: highValueOverdue.length > 0 ? "critical" : "warning",
      headline: `${input.overdueFollowUps.length} overdue follow-up${input.overdueFollowUps.length > 1 ? "s" : ""}`,
      detail: highValueOverdue.length > 0
        ? `${highValueOverdue.length} high-fit lead${highValueOverdue.length > 1 ? "s" : ""} waiting too long. Every day without contact drops your close probability. Start with ${overdueNames}.`
        : `${overdueNames} ${input.overdueFollowUps.length > 1 ? "are" : "is"} past the follow-up window. Momentum fades fast.`,
      action: `Work ${Math.min(input.overdueFollowUps.length, 3)} overdue leads`,
      link: "targets",
      weight: 1,
    });
  }

  // 3. Positive replies not actioned — warmest leads cooling
  const positiveReplies = activeLeads.filter((l) => l.stage === "replied_positive");
  const coolingReplies = positiveReplies.filter((l) => {
    if (!l.last_contacted_at) return true;
    const daysSince = (now - new Date(l.last_contacted_at).getTime()) / 86400000;
    return daysSince > 2;
  });
  if (coolingReplies.length > 0) {
    const names = coolingReplies.slice(0, 2).map((l) => l.contact_name || l.company_name).join(" and ");
    insights.push({
      id: "cooling-replies",
      severity: "critical",
      headline: `${coolingReplies.length} warm repl${coolingReplies.length > 1 ? "ies" : "y"} cooling off`,
      detail: `${names} responded positively but haven't heard back in 2+ days. This is your highest-probability revenue right now.`,
      action: "Book meetings with warm leads",
      link: "targets",
      weight: 2,
    });
  }

  // 4. High-fit leads stuck in early stages — potential being wasted
  const stuckHighFit = activeLeads.filter((l) => {
    if (l.fit_score < 70) return false;
    if (!["candidate", "qualified"].includes(l.stage)) return false;
    const age = (now - new Date(l.created_at).getTime()) / 86400000;
    return age > 3; // In early stage for 3+ days
  });
  if (stuckHighFit.length > 0) {
    insights.push({
      id: "stuck-high-fit",
      severity: "warning",
      headline: `${stuckHighFit.length} high-fit lead${stuckHighFit.length > 1 ? "s" : ""} stuck early`,
      detail: `Lead${stuckHighFit.length > 1 ? "s" : ""} scoring 70+ but still in candidate/qualified after 3+ days. These are your best-fit prospects. They should be further along.`,
      action: "Review and advance top leads",
      link: "crm",
      weight: 3,
    });
  }

  // 5. Neglected leads — high value but not contacted
  const neglected = activeLeads.filter((l) => {
    if (l.fit_score < 50) return false;
    if (!l.last_contacted_at) {
      const age = (now - new Date(l.created_at).getTime()) / 86400000;
      return age > 7;
    }
    const daysSince = (now - new Date(l.last_contacted_at).getTime()) / 86400000;
    return daysSince > 14;
  });
  if (neglected.length > 0) {
    insights.push({
      id: "neglected-leads",
      severity: "warning",
      headline: `${neglected.length} lead${neglected.length > 1 ? "s" : ""} going cold`,
      detail: `${neglected.length} leads with 50+ fit score haven't been contacted in 14+ days. Engagement decays exponentially after two weeks.`,
      action: "Re-engage or disqualify",
      link: "crm",
      weight: 4,
    });
  }

  // 6. Email sent but no response — follow-up needed
  const emailed = activeLeads.filter((l) => l.stage === "emailed");
  const staleEmailed = emailed.filter((l) => {
    if (!l.last_contacted_at) return false;
    const daysSince = (now - new Date(l.last_contacted_at).getTime()) / 86400000;
    return daysSince > 5;
  });
  if (staleEmailed.length >= 3) {
    insights.push({
      id: "stale-outreach",
      severity: "warning",
      headline: `${staleEmailed.length} emails without response`,
      detail: `Outreach sent 5+ days ago with no reply. Consider a different angle, channel, or follow-up cadence.`,
      action: "Review outreach strategy",
      link: "crm",
      weight: 5,
    });
  }

  // 7. Meeting gap — no meetings on calendar
  if (input.upcomingMeetings.length === 0 && totalActive > 0) {
    insights.push({
      id: "no-meetings",
      severity: "warning",
      headline: "Empty calendar this week",
      detail: "No meetings booked in the next 7 days. Deals close in conversations, not inboxes. Target your replied-positive leads.",
      action: "Book meetings with warm leads",
      link: "meetings",
      weight: 6,
    });
  }

  // 8. Pipeline concentration risk — too many leads in one stage
  const stageDistribution = input.pipelineStats.filter((s) => !["suppressed", "lost", "won"].includes(s.stage));
  const totalInPipeline = stageDistribution.reduce((sum, s) => sum + s.count, 0);
  if (totalInPipeline >= 10) {
    const topStage = stageDistribution.reduce((a, b) => (a.count > b.count ? a : b), stageDistribution[0]);
    if (topStage && topStage.count / totalInPipeline > 0.6) {
      const stageLabel = STAGE_DISPLAY[topStage.stage] || topStage.stage;
      insights.push({
        id: "concentration-risk",
        severity: "info",
        headline: `${Math.round((topStage.count / totalInPipeline) * 100)}% of leads stuck in "${stageLabel}"`,
        detail: `A healthy pipeline has movement across stages. ${topStage.count} of ${totalInPipeline} leads are in ${stageLabel}. This bottleneck will choke future conversions.`,
        action: `Advance ${stageLabel} leads`,
        link: "crm",
        weight: 7,
      });
    }
  }

  // 9. Positive momentum — things going right
  if (input.recentStageChanges.length > 0) {
    const advances = input.recentStageChanges.filter((c) => isStageAdvance(c.old_stage, c.new_stage));
    if (advances.length > 0) {
      const names = advances.slice(0, 2).map((c) => c.contact_name || c.company_name || "a lead").join(" and ");
      insights.push({
        id: "momentum-positive",
        severity: "positive",
        headline: `${advances.length} lead${advances.length > 1 ? "s" : ""} advanced today`,
        detail: `${names} moved forward in the last 24 hours. Keep the momentum going.`,
        action: "Continue working warm leads",
        link: "targets",
        weight: 10,
      });
    }
  }

  // 10. New leads imported today
  if (input.newLeadsToday > 0) {
    insights.push({
      id: "new-imports",
      severity: "info",
      headline: `${input.newLeadsToday} new lead${input.newLeadsToday > 1 ? "s" : ""} imported today`,
      detail: `Fresh leads added. Review their fit scores and move the best ones to qualified.`,
      action: "Review new leads",
      link: "crm",
      weight: 9,
    });
  }

  // Sort by weight (most important first)
  insights.sort((a, b) => a.weight - b.weight);

  // ──────────────────────────────────────
  // DAILY TARGETS (Opinionated Ranking)
  // ──────────────────────────────────────
  const targets = computeDailyTargets(activeLeads, input.overdueFollowUps, now);

  // ──────────────────────────────────────
  // MOMENTUM INDICATORS
  // ──────────────────────────────────────
  const momentum = computeMomentum(input, activeLeads, now);

  // ──────────────────────────────────────
  // NARRATIVE SUMMARY
  // ──────────────────────────────────────
  const narrativeSummary = generateNarrative(input, insights, targets, now);

  // ──────────────────────────────────────
  // QUICK STATS
  // ──────────────────────────────────────
  const hotLeads = activeLeads.filter(
    (l) => ["replied_positive", "meeting_requested", "meeting_booked"].includes(l.stage)
  ).length;

  const overdueCount = input.overdueFollowUps.length;
  const staleCount = staleEmailed.length;
  const coolingCount = coolingReplies.length;
  const neglectedCount = neglected.length;
  const avgFitScore = activeLeads.length > 0
    ? Math.round(activeLeads.reduce((sum, l) => sum + l.fit_score, 0) / activeLeads.length)
    : 0;
  const stageCounts: Record<string, number> = {};
  for (const s of input.pipelineStats) {
    stageCounts[s.stage] = s.count;
  }

  // ──────────────────────────────────────
  // DRIFT DETECTION (day-over-day)
  // ──────────────────────────────────────
  const driftAlerts = computeDriftAlerts(input.yesterdaySnapshot || null, {
    total_active: totalActive,
    hot_leads: hotLeads,
    overdue_count: overdueCount,
    stale_outreach: staleCount,
    cooling_replies: coolingCount,
    neglected_count: neglectedCount,
    avg_fit_score: avgFitScore,
  });

  // Add drift-based insights to the main insights list
  for (const alert of driftAlerts) {
    if (alert.severity === "critical" || alert.severity === "warning") {
      insights.push({
        id: `drift-${alert.id}`,
        severity: alert.severity,
        headline: alert.message,
        detail: `Yesterday: ${alert.yesterday}. Today: ${alert.today}. ${alert.delta > 0 ? "+" : ""}${alert.delta} change.`,
        action: alert.id.includes("overdue") ? "Clear overdue follow-ups" :
                alert.id.includes("neglect") ? "Re-engage or disqualify stale leads" :
                alert.id.includes("cooling") ? "Book meetings with warm leads" :
                "Review pipeline health",
        link: alert.id.includes("overdue") || alert.id.includes("neglect") ? "crm" : "targets",
        weight: alert.severity === "critical" ? 1.5 : 4.5,
      });
    }
  }

  // Re-sort insights with drift alerts included
  insights.sort((a, b) => a.weight - b.weight);

  return {
    topInsight: insights[0] || null,
    insights,
    targets,
    momentum,
    driftAlerts,
    narrativeSummary,
    quickStats: {
      totalActive,
      overdueCount,
      hotLeads,
      meetingsThisWeek: input.upcomingMeetings.length,
      newToday: input.newLeadsToday,
      stageChangesToday: input.recentStageChanges.length,
    },
    snapshotData: {
      total_active: totalActive,
      hot_leads: hotLeads,
      overdue_count: overdueCount,
      stale_outreach: staleCount,
      cooling_replies: coolingCount,
      neglected_count: neglectedCount,
      meetings_booked: input.upcomingMeetings.filter((m) => m.status === "confirmed").length,
      avg_fit_score: avgFitScore,
      stage_counts: stageCounts,
      insight_ids: insights.map((i) => i.id),
    },
  };
}

/* ─── Target Ranking ─── */

function computeDailyTargets(
  activeLeads: LeadSnapshot[],
  overdue: LeadSnapshot[],
  now: number
): DailyTarget[] {
  const overdueIds = new Set(overdue.map((l) => l.id));
  const scored: { lead: LeadSnapshot; score: number; signals: string[] }[] = [];

  for (const lead of activeLeads) {
    if (["won", "suppressed", "lost"].includes(lead.stage)) continue;

    let score = 0;
    const signals: string[] = [];
    const isOverdue = overdueIds.has(lead.id);

    // Factor 1: Urgency (overdue follow-ups)
    if (isOverdue) {
      score += 200;
      signals.push("Overdue follow-up");
      // Extra urgency for how late it is
      if (lead.next_action_at) {
        const daysOverdue = (now - new Date(lead.next_action_at).getTime()) / 86400000;
        score += Math.min(daysOverdue * 10, 50);
        if (daysOverdue > 3) signals.push(`${Math.floor(daysOverdue)} days overdue`);
      }
    }

    // Factor 2: Stage warmth (warmer stages = higher priority)
    const stageScore = STAGE_PRIORITY[lead.stage] || 0;
    score += stageScore;
    if (lead.stage === "replied_positive") signals.push("Positive reply, warmest lead");
    if (lead.stage === "meeting_requested") signals.push("Meeting interest shown");
    if (lead.stage === "ready_to_email") signals.push("Ready for outreach");

    // Factor 3: Fit score (better fit = more worth pursuing)
    score += lead.fit_score * 1.5;
    if (lead.fit_score >= 80) signals.push(`Excellent fit (${lead.fit_score})`);
    else if (lead.fit_score >= 65) signals.push(`Strong fit (${lead.fit_score})`);

    // Factor 4: Recency of engagement (recently active = momentum)
    if (lead.last_contacted_at) {
      const daysSince = (now - new Date(lead.last_contacted_at).getTime()) / 86400000;
      if (daysSince < 3) {
        score += 30;
        signals.push("Recently engaged");
      } else if (daysSince > 14) {
        score -= 20;
        signals.push("Going cold, needs re-engagement");
      }
    } else if (lead.fit_score >= 60) {
      signals.push("Never contacted, fresh opportunity");
      score += 15; // Slight boost for untouched high-fit
    }

    // Factor 5: Lead freshness (new leads get a slight boost)
    const age = (now - new Date(lead.created_at).getTime()) / 86400000;
    if (age < 2) {
      score += 20;
      signals.push("New lead");
    }

    scored.push({ lead, score, signals });
  }

  // Sort by composite score, take top 5
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 5).map((s, i) => ({
    lead: s.lead,
    rank: i + 1,
    reason: generateTargetReason(s.lead, s.signals, overdueIds.has(s.lead.id)),
    action: getTargetAction(s.lead, overdueIds.has(s.lead.id)),
    urgencyScore: s.score,
    signals: s.signals,
  }));
}

function generateTargetReason(lead: LeadSnapshot, signals: string[], isOverdue: boolean): string {
  if (isOverdue && lead.stage === "replied_positive") {
    return "Replied positively and overdue for follow-up. Your highest-probability conversion right now.";
  }
  if (isOverdue) {
    return `Overdue for follow-up. ${lead.fit_score >= 70 ? "High-fit lead. Don't let this one slip." : "Keep momentum alive."}`;
  }
  if (lead.stage === "replied_positive") {
    return "Responded positively. Book a meeting before interest cools.";
  }
  if (lead.stage === "meeting_requested") {
    return "Expressed meeting interest. Confirm timing before it goes stale.";
  }
  if (lead.stage === "ready_to_email") {
    return `Qualified and ready for outreach. Fit score ${lead.fit_score}${lead.fit_score >= 80 ? ". Top-tier prospect." : "."}`;
  }
  if (lead.stage === "qualified" && lead.fit_score >= 70) {
    return `Strong fit (${lead.fit_score}) but hasn't been advanced. Move to outreach or disqualify.`;
  }
  if (lead.stage === "emailed") {
    return "Outreach sent. Follow up with a different angle or channel.";
  }

  // Default: use signals
  const topSignal = signals.find((s) =>
    !s.startsWith("Recently") && !s.startsWith("New lead")
  );
  return topSignal || `Fit score ${lead.fit_score}. Worth advancing.`;
}

function getTargetAction(lead: LeadSnapshot, isOverdue: boolean): string {
  if (lead.stage === "replied_positive") return "Book meeting";
  if (lead.stage === "meeting_requested") return "Confirm meeting";
  if (lead.stage === "meeting_booked") return "Prepare for meeting";
  if (lead.stage === "ready_to_email") return "Send outreach";
  if (lead.stage === "emailed") return isOverdue ? "Follow up now" : "Follow up";
  if (lead.stage === "qualified") return "Send outreach";
  if (lead.stage === "candidate") return lead.fit_score >= 60 ? "Qualify lead" : "Review lead";
  return lead.next_action || "Take action";
}

/* ─── Momentum Indicators ─── */

function computeMomentum(
  input: BriefingInput,
  activeLeads: LeadSnapshot[],
  now: number,
): MomentumIndicator[] {
  const indicators: MomentumIndicator[] = [];

  // 1. Pipeline velocity — leads advancing stages in last 24h
  const advances = input.recentStageChanges.filter((c) => isStageAdvance(c.old_stage, c.new_stage));
  indicators.push({
    label: "Advances today",
    value: advances.length,
    change: advances.length, // positive is good
    trend: advances.length > 0 ? "up" : "flat",
  });

  // 2. Response rate — replied / emailed
  const emailedCount = activeLeads.filter((l) => l.stage === "emailed").length;
  const repliedCount = activeLeads.filter((l) =>
    ["replied_positive", "replied_negative"].includes(l.stage)
  ).length;
  const responseRate = emailedCount + repliedCount > 0
    ? Math.round((repliedCount / (emailedCount + repliedCount)) * 100)
    : 0;
  indicators.push({
    label: "Response rate",
    value: responseRate,
    change: 0, // would need historical data for delta
    trend: responseRate >= 20 ? "up" : responseRate > 0 ? "flat" : "down",
  });

  // 3. Hot leads — in warm stages
  const hotCount = activeLeads.filter((l) =>
    ["replied_positive", "meeting_requested", "meeting_booked"].includes(l.stage)
  ).length;
  indicators.push({
    label: "Hot leads",
    value: hotCount,
    change: 0,
    trend: hotCount > 0 ? "up" : "flat",
  });

  // 4. Overdue count — lower is better
  indicators.push({
    label: "Overdue",
    value: input.overdueFollowUps.length,
    change: -input.overdueFollowUps.length, // negative = bad
    trend: input.overdueFollowUps.length === 0 ? "up" : "down",
  });

  // 5. Average lead age in early stages — are we moving fast enough?
  const earlyLeads = activeLeads.filter((l) => ["candidate", "qualified"].includes(l.stage));
  const avgEarlyAge = earlyLeads.length > 0
    ? Math.round(earlyLeads.reduce((sum, l) => sum + (now - new Date(l.created_at).getTime()) / 86400000, 0) / earlyLeads.length)
    : 0;
  indicators.push({
    label: "Avg. early-stage age",
    value: avgEarlyAge,
    change: avgEarlyAge > 7 ? -1 : 0,
    trend: avgEarlyAge <= 3 ? "up" : avgEarlyAge <= 7 ? "flat" : "down",
  });

  // Update momentum with yesterday's snapshot deltas if available
  if (input.yesterdaySnapshot) {
    const ys = input.yesterdaySnapshot;
    // Response rate delta
    const responseIdx = indicators.findIndex((i) => i.label === "Response rate");
    if (responseIdx >= 0) {
      // We don't store response rate directly, but we can estimate from hot_leads change
    }
    // Hot leads delta
    const hotIdx = indicators.findIndex((i) => i.label === "Hot leads");
    if (hotIdx >= 0) {
      const hotNow = indicators[hotIdx].value;
      indicators[hotIdx].change = hotNow - ys.hot_leads;
      indicators[hotIdx].trend = hotNow > ys.hot_leads ? "up" : hotNow < ys.hot_leads ? "down" : "flat";
    }
    // Overdue delta
    const overdueIdx = indicators.findIndex((i) => i.label === "Overdue");
    if (overdueIdx >= 0) {
      const overdueNow = indicators[overdueIdx].value;
      indicators[overdueIdx].change = ys.overdue_count - overdueNow; // fewer overdue = positive
      indicators[overdueIdx].trend = overdueNow < ys.overdue_count ? "up" : overdueNow > ys.overdue_count ? "down" : "flat";
    }
  }

  return indicators;
}

/* ─── Drift Detection ─── */

interface TodayMetrics {
  total_active: number;
  hot_leads: number;
  overdue_count: number;
  stale_outreach: number;
  cooling_replies: number;
  neglected_count: number;
  avg_fit_score: number;
}

function computeDriftAlerts(
  yesterday: YesterdaySnapshot | null,
  today: TodayMetrics,
): DriftAlert[] {
  if (!yesterday) return [];

  const alerts: DriftAlert[] = [];

  // Overdue count spiking — revenue at risk
  if (today.overdue_count > yesterday.overdue_count && today.overdue_count >= 3) {
    const delta = today.overdue_count - yesterday.overdue_count;
    alerts.push({
      id: "overdue-spike",
      severity: delta >= 3 ? "critical" : "warning",
      metric: "Overdue follow-ups",
      yesterday: yesterday.overdue_count,
      today: today.overdue_count,
      delta,
      message: `Overdue follow-ups jumped from ${yesterday.overdue_count} to ${today.overdue_count}`,
    });
  }

  // Neglected leads growing — decay pattern
  if (today.neglected_count > yesterday.neglected_count && today.neglected_count >= 2) {
    const delta = today.neglected_count - yesterday.neglected_count;
    alerts.push({
      id: "neglect-growth",
      severity: delta >= 3 ? "critical" : "warning",
      metric: "Neglected leads",
      yesterday: yesterday.neglected_count,
      today: today.neglected_count,
      delta,
      message: `${delta} more lead${delta > 1 ? "s" : ""} went cold since yesterday`,
    });
  }

  // Hot leads dropping — losing momentum
  if (today.hot_leads < yesterday.hot_leads && yesterday.hot_leads >= 2) {
    const delta = today.hot_leads - yesterday.hot_leads;
    alerts.push({
      id: "hot-leads-drop",
      severity: Math.abs(delta) >= 2 ? "critical" : "warning",
      metric: "Hot leads",
      yesterday: yesterday.hot_leads,
      today: today.hot_leads,
      delta,
      message: `Hot leads dropped from ${yesterday.hot_leads} to ${today.hot_leads}`,
    });
  }

  // Cooling replies increasing — warm leads going cold
  if (today.cooling_replies > yesterday.cooling_replies) {
    const delta = today.cooling_replies - yesterday.cooling_replies;
    alerts.push({
      id: "cooling-increase",
      severity: delta >= 2 ? "critical" : "warning",
      metric: "Cooling replies",
      yesterday: yesterday.cooling_replies,
      today: today.cooling_replies,
      delta,
      message: `${today.cooling_replies} warm repl${today.cooling_replies > 1 ? "ies" : "y"} cooling off (was ${yesterday.cooling_replies} yesterday)`,
    });
  }

  // Stale outreach growing — outbound not working
  if (today.stale_outreach > yesterday.stale_outreach + 2) {
    alerts.push({
      id: "stale-growth",
      severity: "warning",
      metric: "Stale outreach",
      yesterday: yesterday.stale_outreach,
      today: today.stale_outreach,
      delta: today.stale_outreach - yesterday.stale_outreach,
      message: `Unreplied outreach grew from ${yesterday.stale_outreach} to ${today.stale_outreach}`,
    });
  }

  // Pipeline shrinking without wins — leads are draining
  if (today.total_active < yesterday.total_active - 2 && yesterday.total_active >= 5) {
    const delta = today.total_active - yesterday.total_active;
    alerts.push({
      id: "pipeline-shrink",
      severity: "warning",
      metric: "Active pipeline",
      yesterday: yesterday.total_active,
      today: today.total_active,
      delta,
      message: `Pipeline shrank by ${Math.abs(delta)} lead${Math.abs(delta) > 1 ? "s" : ""} since yesterday`,
    });
  }

  return alerts;
}

/* ─── Narrative Summary ─── */

function generateNarrative(
  input: BriefingInput,
  insights: Insight[],
  targets: DailyTarget[],
  _now: number, // eslint-disable-line @typescript-eslint/no-unused-vars
): string {
  const parts: string[] = [];

  const totalActive = input.pipelineStats
    .filter((s) => !["suppressed", "lost"].includes(s.stage))
    .reduce((sum, s) => sum + s.count, 0);

  if (totalActive === 0) {
    return "No active leads yet. Import your lead data and Mission Control will start generating daily direction within seconds.";
  }

  // Opening — what happened
  if (input.recentStageChanges.length > 0) {
    const advances = input.recentStageChanges.filter((c) => isStageAdvance(c.old_stage, c.new_stage));
    if (advances.length > 0) {
      parts.push(`${advances.length} lead${advances.length > 1 ? "s" : ""} moved forward in the last 24 hours.`);
    }
  }

  if (input.newLeadsToday > 0) {
    parts.push(`${input.newLeadsToday} new lead${input.newLeadsToday > 1 ? "s" : ""} imported.`);
  }

  // Current state
  parts.push(`You have ${totalActive} active lead${totalActive > 1 ? "s" : ""}.`);

  // What needs attention
  const criticals = insights.filter((i) => i.severity === "critical");
  if (criticals.length > 0) {
    const topCritical = criticals[0];
    parts.push(topCritical.headline + ".");
  }

  // Direction
  if (targets.length > 0) {
    const topTarget = targets[0];
    parts.push(`Start with ${topTarget.lead.contact_name || topTarget.lead.company_name || "your top target"}: ${topTarget.action.toLowerCase()}.`);
  }

  // Meetings context
  if (input.upcomingMeetings.length > 0) {
    parts.push(`${input.upcomingMeetings.length} meeting${input.upcomingMeetings.length > 1 ? "s" : ""} on your calendar this week.`);
  }

  return parts.join(" ");
}

/* ─── Helpers ─── */

const STAGE_ORDER = [
  "candidate", "qualified", "ready_to_email", "emailed",
  "replied_positive", "replied_negative",
  "meeting_requested", "meeting_booked", "won",
];

const STAGE_PRIORITY: Record<string, number> = {
  replied_positive: 120,
  meeting_requested: 100,
  meeting_booked: 80,
  ready_to_email: 60,
  qualified: 30,
  emailed: 40,
  candidate: 10,
  replied_negative: 5,
};

const STAGE_DISPLAY: Record<string, string> = {
  candidate: "Candidate",
  qualified: "Qualified",
  ready_to_email: "Ready to Email",
  emailed: "Emailed",
  replied_positive: "Replied (Positive)",
  replied_negative: "Replied (Negative)",
  meeting_requested: "Meeting Requested",
  meeting_booked: "Meeting Booked",
  won: "Won",
  lost: "Lost",
  suppressed: "Suppressed",
};

function isStageAdvance(oldStage: string, newStage: string): boolean {
  const oldIdx = STAGE_ORDER.indexOf(oldStage);
  const newIdx = STAGE_ORDER.indexOf(newStage);
  if (oldIdx === -1 || newIdx === -1) return false;
  return newIdx > oldIdx;
}
