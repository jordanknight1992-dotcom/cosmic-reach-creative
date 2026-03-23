import { NextRequest, NextResponse } from "next/server";
import {
  getLeadById,
  saveDraft,
  createActivity,
  updateLead,
} from "@/lib/crm-db";

function buildSystemPrompt(personaType: string): string {
  const founderAngle = `You are writing a cold outreach email on behalf of Jordan Knight, founder of Cosmic Reach Creative -a brand strategy and web design studio in Memphis, TN.

Target persona: FOUNDER / CEO
Messaging angle: Clarity at the business, offer, and system level. Signal vs noise. Reducing wasted activity. Positioning a brand refresh or web redesign as a growth lever, not a cosmetic exercise.`;

  const marketingLeaderAngle = `You are writing a cold outreach email on behalf of Jordan Knight, founder of Cosmic Reach Creative -a brand strategy and web design studio in Memphis, TN.

Target persona: MARKETING LEADER (VP/Director of Marketing)
Messaging angle: Clearer messaging architecture, stronger conversion paths, system alignment. Pitch fractional creative direction or overflow design support that gives their team leverage without a full-time hire.`;

  const base = personaType === "marketing_leader" ? marketingLeaderAngle : founderAngle;

  return `${base}

Voice rules:
- Sharp, calm, credible, observant
- NOT hypey, NOT robotic, NOT salesy
- Write like a peer, not a vendor
- 80-160 words in the body (not counting subject)
- Short subject line (under 60 chars, no emojis)
- Include one real observation about their business
- Include exactly one clean CTA linking to: https://www.cosmicreachcreative.com/book/signal-check
- The CTA should feel like a natural next step, not a hard sell

AVOID these phrases entirely:
- "just checking in"
- "would love to connect"
- "I came across your company"
- "hope this finds you well"
- fake compliments
- generic filler language

Return your response as JSON with exactly two fields:
{ "subject": "...", "body": "..." }

The body should be plain text with line breaks (not HTML).`;
}

function buildUserPrompt(lead: Record<string, unknown>): string {
  const parts: string[] = [];
  parts.push(`Contact: ${lead.contact_name} (${lead.contact_title || "unknown title"})`);
  parts.push(`Company: ${lead.company_name}`);
  if (lead.company_industry) parts.push(`Industry: ${lead.company_industry}`);
  if (lead.company_city && lead.company_state) {
    parts.push(`Location: ${lead.company_city}, ${lead.company_state}`);
  }
  if (lead.company_website) parts.push(`Website: ${lead.company_website}`);
  if (lead.company_fit_summary) parts.push(`Fit summary: ${lead.company_fit_summary}`);
  if (lead.fit_reason) parts.push(`Fit reason: ${lead.fit_reason}`);
  if (lead.pain_point_summary) parts.push(`Pain points: ${lead.pain_point_summary}`);
  if (lead.outreach_angle) parts.push(`Outreach angle: ${lead.outreach_angle}`);

  return `Write a personalized outreach email for this lead:\n\n${parts.join("\n")}`;
}

function fallbackDraft(lead: Record<string, unknown>): { subject: string; body: string } {
  const firstName = (lead.contact_first_name as string) || (lead.contact_name as string)?.split(" ")[0] || "there";
  const companyName = lead.company_name as string;
  return {
    subject: `Quick thought on ${companyName}`,
    body: `Hi ${firstName},

I run Cosmic Reach Creative here in Memphis -we help growing companies sharpen their brand and web presence so the work actually converts.

I took a look at ${companyName} and had a few observations I think would be worth sharing.

Would a 15-minute call make sense to see if there's a fit?

https://www.cosmicreachcreative.com/book/signal-check

Best,
Jordan`,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await getLeadById(leadId) as Record<string, unknown> | null;
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const personaType = body.persona_type || lead.contact_persona_type || "founder";

    let subject: string;
    let emailBody: string;
    let model = "gpt-4o-mini";
    let usedFallback = false;

    if (!process.env.OPENAI_API_KEY) {
      // No API key -use fallback
      const fb = fallbackDraft(lead);
      subject = fb.subject;
      emailBody = fb.body;
      model = "fallback";
      usedFallback = true;

      await updateLead(leadId, { manual_review_required: true });
    } else {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [
              { role: "system", content: buildSystemPrompt(personaType) },
              { role: "user", content: buildUserPrompt(lead) },
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

        if (!subject || !emailBody) {
          throw new Error("OpenAI response missing subject or body");
        }
      } catch (aiErr) {
        console.error("OpenAI generation failed, using fallback:", aiErr);
        const fb = fallbackDraft(lead);
        subject = fb.subject;
        emailBody = fb.body;
        model = "fallback";
        usedFallback = true;

        await updateLead(leadId, { manual_review_required: true });
      }
    }

    // Save draft
    const draft = await saveDraft({
      lead_id: leadId,
      subject,
      body_text: emailBody,
      model,
      persona_type: personaType,
      is_ai_generated: !usedFallback,
    });

    // Log activity
    await createActivity({
      lead_id: leadId,
      contact_id: lead.contact_id as number,
      company_id: lead.company_id as number,
      type: "draft_generated",
      body_preview: `Draft generated: ${subject}`,
      metadata: { model, persona_type: personaType, used_fallback: usedFallback },
    });

    return NextResponse.json({
      draft,
      used_fallback: usedFallback,
    }, { status: 201 });
  } catch (err) {
    console.error("Error generating draft:", err);
    return NextResponse.json(
      { error: "Failed to generate draft" },
      { status: 500 }
    );
  }
}
