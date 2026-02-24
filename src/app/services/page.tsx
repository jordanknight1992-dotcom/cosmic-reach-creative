import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cosmic Reach engagements follow a deliberate progression designed to diagnose problems before building solutions.",
  alternates: { canonical: `${siteConfig.domain}/services` },
};

const content = `# Structured Paths to Operational Clarity

Cosmic Reach engagements follow a deliberate progression designed to diagnose problems before building solutions.

IMAGE: 03-services-hero.jpg

---

## Step One: First Signal

A free 30-minute intro call to understand your environment and confirm whether there is a real operational issue worth solving.

No pitch. Just signal.

**Outcome:**
- Clear next step, or a clean no

ICON: signal
CTA: Book Intro Call

---

## Step Two: The Clarity Session

A 90-minute working session where we map what is breaking down and identify the highest-impact fixes.

You leave with usable direction immediately.

**Outcome:**
- A shared map of the real constraints
- A short list of priority shifts tied to outcomes
- A recommended next step you can act on

ICON: map
CTA: Book Clarity Session

---

## Step Three: The Sprints

If we decide to move forward, we implement the solution through structured Sprints.

Each Sprint is built on the Cosmic Reach Framework:
Direction, Alignment, Execution, Visibility.

### 30 Day Sprint: Direction Sprint

Designed to surface the real blockers and establish a priority map tied to outcomes.

**Clients get:**
- Current-state diagnosis across strategy, structure, and execution
- Priority map tied to business outcomes
- Focused recommendations on what to fix first

**Framework coverage:**
- Direction primary
- Visibility baseline

ICON: compass

### 60 Day Sprint: Alignment Sprint

Designed to turn clarity into coordinated execution by aligning ownership, messaging, and operating structure.

**Clients get:**
- Positioning and messaging refinement
- Clear ownership and decision logic
- Workflow alignment between teams and tools

**Framework coverage:**
- Direction locked
- Alignment primary
- Execution foundation

ICON: orbit

### 90 Day Sprint: System Sprint

Designed to build the full operating system so progress becomes repeatable and visible.

**Clients get:**
- Workflow and process design
- Operating cadence and planning structure
- Measurement logic tied to outcomes
- Executive-level reporting clarity leaders can trust

**Framework coverage:**
- Direction, Alignment, Execution, Visibility end-to-end

ICON: gears

CTA: Discuss Sprint Options

---

## Ongoing Operational Strategy

Monthly sessions designed to keep the system functioning and evolving as your environment changes.

**Clients get:**
- Continued prioritization as conditions shift
- System maintenance across workflow, roles, and tools
- Visibility checks so decisions stay anchored to impact

ICON: network`;

export default function ServicesPage() {
  return <MarkdownPage content={content} />;
}
