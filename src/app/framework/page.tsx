import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Framework",
  description:
    "The Cosmic Reach Framework moves through four layers designed to restore signal, reduce friction, and make progress repeatable.",
  alternates: { canonical: `${siteConfig.domain}/framework` },
};

const content = `# The Cosmic Reach Framework

We do not begin with tactics.
We begin with the system underneath the work.

Cosmic Reach engagements move through four layers designed to restore signal, reduce friction, and make progress repeatable.

IMAGE: 02-framework-hero.jpg

---

## Direction: Set the Trajectory

We identify what is actually holding progress back and what to fix first.

We diagnose where marketing and operational friction are slowing the business down, where decisions stall, and where effort is not translating into outcomes so leaders can move forward with clarity.

**Clients get:**
- A clear current-state diagnosis across strategy, structure, and execution
- A priority map tied to real business outcomes
- Focused recommendations on what to address first

ICON: compass

---

## Alignment: Pull Into Orbit

We make sure strategy, teams, and tools are working toward the same outcome.

We bring clarity to positioning, ownership, and expectations so marketing and execution stop feeling fragmented and start operating as a coordinated system.

**Clients get:**
- Messaging clarity and positioning refinement
- Defined ownership and decision logic
- Alignment between strategy, workflows, and supporting tools

ICON: orbit

---

## Execution: Build the Flight System

We design the systems that make progress repeatable.

We build the workflows, operating rhythms, and practical structures that allow teams to execute intentionally instead of reactively. When needed, this can include designing or implementing tools that support the system.

**Clients get:**
- Workflow and process design
- Operating cadence and planning structure
- Practical systems or supporting tools teams can manage themselves

ICON: gears

---

## Visibility: Restore the Signal

We give leaders a clear view of what is working, what is not, and what to do next.

We translate marketing and operational activity into business insight so decisions are driven by impact, not assumptions. This can include reporting structures, dashboards, or tools that make visibility sustainable.

**Clients get:**
- Measurement logic tied to outcomes
- Executive-level reporting clarity
- Visibility systems leaders can rely on without constant interpretation

ICON: signal

---

## In Short: What This Framework Does

Cosmic Reach helps companies solve the operational problems behind marketing performance by designing the direction, alignment, execution, and visibility systems that allow teams to move forward with confidence.

CTA: Book Clarity Session`;

export default function FrameworkPage() {
  return <MarkdownPage content={content} />;
}
