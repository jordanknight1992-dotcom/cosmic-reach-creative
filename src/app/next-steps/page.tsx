import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Clarity Audit Confirmed",
  description:
    "Your Business Clarity Audit is confirmed. Here is what happens next.",
  alternates: { canonical: `${siteConfig.domain}/next-steps` },
};

const content = `# Your Business Clarity Audit Is Confirmed

Thank you for purchasing a Business Clarity Audit from Cosmic Reach Creative.

The next step is providing a few details about your business so the analysis can begin.

This process helps us identify where momentum is breaking down and what changes will create the greatest impact.

---

## Step 1: Complete the Intake Form

To begin the audit, please provide a few details about your business.

This information allows us to analyze your messaging, offers, and customer journey before preparing your clarity report.

The intake form will ask for:

• your website or product link
• a short description of your business
• what currently feels stuck or frustrating
• your primary growth goal over the next 6–12 months
• any supporting materials you want us to review

[CTA: Complete Intake Form]

---

## Step 2: Analysis and Review

Once the intake form is submitted, we begin the Business Clarity Audit.

During this process we analyze four core areas using the Cosmic Reach Clarity Framework:

**Signal** - Messaging clarity and positioning
ICON: compass

**Gravity** - Offer strength and value perception
ICON: orbit

**Orbit** - Customer journey and conversion flow
ICON: gears

**Thrust** - Growth opportunities and system improvements
ICON: signal

---

## Step 3: Clarity Report Delivery

You will receive a structured report outlining:

• messaging clarity insights
• offer positioning improvements
• customer journey friction points
• growth opportunities within the business system
• prioritized recommendations for improvement

Typical delivery time is **3–5 business days** after the intake form is submitted.

---

## What Happens Next

After reviewing the Clarity Report, we will discuss the recommended improvements and determine whether a focused implementation sprint would accelerate progress.

Many clients choose to move forward with a:

• 30 Day Direction Sprint
• 60 Day Alignment Sprint
• 90 Day Systems Sprint

These sprints focus on implementing the highest-impact improvements identified during the audit.

---

## Questions

If you have questions before submitting the intake form, feel free to reach out at hello@cosmicreachcreative.com.

We look forward to helping you restore momentum and build a system that supports real progress.`;

export default function NextStepsPage() {
  return <MarkdownPage content={content} />;
}
