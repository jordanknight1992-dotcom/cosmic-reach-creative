import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName, resolveCredential } from "@/lib/mc-auth";
import { getTenantGoals, logAudit, type TenantGoals } from "@/lib/mc-db";

function buildSystemPrompt(goals: TenantGoals): string {
  const businessCtx = [
    goals.business_name && `Business: ${goals.business_name}`,
    goals.business_description && `About: ${goals.business_description}`,
    goals.sender_name && `Sender: ${goals.sender_name}`,
    goals.sender_title && `Title: ${goals.sender_title}`,
  ].filter(Boolean).join("\n");

  const audienceCtx = goals.target_audience
    ? `Target audience: ${goals.target_audience}`
    : "";

  const voiceCtx = goals.brand_voice
    ? `Brand voice: ${goals.brand_voice}`
    : "Brand voice: Professional, warm, and direct.";

  const offersCtx = goals.key_offers
    ? `Key offers/services: ${goals.key_offers}`
    : "";

  const goalsCtx = goals.goals?.length
    ? `Business goals:\n${goals.goals.map((g) => `- ${g.label}: ${g.description}`).join("\n")}`
    : "";

  const ctaCtx = goals.cta_url
    ? `CTA link: ${goals.cta_url} (label: ${goals.cta_label || "Book a call"})`
    : "";

  const avoidCtx = goals.avoid_phrases
    ? `AVOID these phrases:\n${goals.avoid_phrases}`
    : `AVOID: "just checking in", "would love to connect", "I came across your company", "hope this finds you well", fake compliments, generic filler`;

  const toneCtx = goals.example_tone
    ? `Example tone/style: ${goals.example_tone}`
    : "";

  return `You are writing a personalized outreach email on behalf of a business to one of their potential customers.

${businessCtx}
${audienceCtx}
${voiceCtx}
${offersCtx}
${goalsCtx}

Writing rules:
- Write in the brand voice described above
- 80-160 words in the body (not counting subject)
- Short subject line (under 60 chars, no emojis)
- Include one real observation about the recipient's business
- Include exactly one clean CTA${ctaCtx ? `: ${ctaCtx}` : ""}
- The CTA should feel like a natural next step, not a hard sell
- NEVER use em dashes. Use commas, periods, parentheses, or semicolons instead
- NEVER use "not just X, it's Y" or "it's not about X, it's about Y" framing
- NEVER list exactly three items in a row. Use two, four, or five instead
- NEVER end a paragraph by restating what was just said
- Vary sentence length. Short sometimes. Longer other times

${avoidCtx}
${toneCtx}

Return your response as JSON with exactly two fields:
{ "subject": "...", "body": "..." }

The body should be plain text with line breaks (not HTML).`;
}

function buildLeadPrompt(lead: Record<string, unknown>): string {
  const parts: string[] = [];
  if (lead.contact_name) parts.push(`Contact: ${lead.contact_name}${lead.contact_title ? ` (${lead.contact_title})` : ""}`);
  if (lead.company_name) parts.push(`Company: ${lead.company_name}`);
  if (lead.company_industry) parts.push(`Industry: ${lead.company_industry}`);
  if (lead.company_city && lead.company_state) parts.push(`Location: ${lead.company_city}, ${lead.company_state}`);
  if (lead.company_website) parts.push(`Website: ${lead.company_website}`);
  if (lead.fit_reason) parts.push(`Why they're a fit: ${lead.fit_reason}`);
  if (lead.outreach_angle) parts.push(`Outreach angle: ${lead.outreach_angle}`);
  if (lead.pain_point_summary) parts.push(`Pain points: ${lead.pain_point_summary}`);

  return `Write a personalized outreach email for this lead:\n\n${parts.join("\n")}`;
}

function buildFallback(goals: TenantGoals, lead: Record<string, unknown>): { subject: string; body: string } {
  const firstName = (lead.contact_name as string)?.split(" ")[0] || "there";
  const company = (lead.company_name as string) || "your company";
  const sender = goals.sender_name || goals.business_name || "our team";
  const biz = goals.business_name || "our company";

  return {
    subject: `Quick thought on ${company}`,
    body: `Hi ${firstName},\n\nI'm ${sender} from ${biz}. I took a look at ${company} and had a few observations I'd love to share.\n\n${goals.key_offers ? `We specialize in ${goals.key_offers.split("\n")[0].toLowerCase()}.` : ""}\n\nWould a quick conversation make sense to explore if there's a fit?\n\n${goals.cta_url || ""}\n\nBest,\n${goals.sender_name || sender}`,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const body = await request.json();
    const { lead } = body;

    if (!lead || !lead.contact_name) {
      return NextResponse.json({ error: "Lead data with contact_name is required" }, { status: 400 });
    }

    // Get tenant goals for prompt context
    const goals = await getTenantGoals(result.ctx.tenantId);
    if (!goals || !goals.business_name) {
      return NextResponse.json(
        { error: "Please set up your Strategy first (business name, voice, and goals)" },
        { status: 400 }
      );
    }

    // Resolve OpenAI key (tenant DB first, then env var)
    const openaiCred = await resolveCredential(result.ctx.tenantId, "openai");

    let subject: string;
    let emailBody: string;
    let model = "gpt-4o-mini";
    let usedFallback = false;

    if (!openaiCred) {
      const fb = buildFallback(goals, lead);
      subject = fb.subject;
      emailBody = fb.body;
      model = "fallback";
      usedFallback = true;
    } else {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiCred.value}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [
              { role: "system", content: buildSystemPrompt(goals) },
              { role: "user", content: buildLeadPrompt(lead) },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!openaiRes.ok) {
          const errData = await openaiRes.json().catch(() => ({}));
          throw new Error(`OpenAI error (${openaiRes.status}): ${JSON.stringify(errData)}`);
        }

        const completion = await openaiRes.json();
        const content = completion.choices?.[0]?.message?.content;
        if (!content) throw new Error("Empty response from OpenAI");

        const parsed = JSON.parse(content);
        subject = parsed.subject;
        emailBody = parsed.body;

        if (!subject || !emailBody) throw new Error("Missing subject or body");
      } catch (aiErr) {
        console.error("OpenAI generation failed, using fallback:", aiErr);
        const fb = buildFallback(goals, lead);
        subject = fb.subject;
        emailBody = fb.body;
        model = "fallback";
        usedFallback = true;
      }
    }

    await logAudit({
      user_id: result.ctx.user.id,
      tenant_id: result.ctx.tenantId,
      action: "draft_generated",
      resource: "email_drafts",
      metadata: { model, used_fallback: usedFallback, contact: lead.contact_name },
    });

    return NextResponse.json({
      draft: { subject, body: emailBody },
      model,
      used_fallback: usedFallback,
    });
  } catch (err) {
    console.error("Draft generation error:", err);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
