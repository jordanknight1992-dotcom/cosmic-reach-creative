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

## Step Two: Business Clarity Audit

A focused diagnostic of your business using the Cosmic Reach Clarity Framework.

The audit evaluates messaging clarity, offer strength, customer journey friction, and growth opportunities.

**Deliverables include:**
- messaging analysis
- offer positioning insights
- website conversion friction diagnosis
- prioritized improvement roadmap

ICON: map
CTA: Start With a Business Clarity Audit

---

## Step Three: The Sprints

If we decide to move forward, we implement the solution through structured Sprints.

Each Sprint is built on the Cosmic Reach Clarity Framework:
Signal, Gravity, Orbit, Thrust.

### 30 Day Direction Sprint

A focused 30-day engagement designed to address the highest-impact issues identified in the Business Clarity Audit.

**Typical work includes:**
- refining messaging and positioning
- improving website conversion flow
- restructuring offers
- clarifying priorities and decision paths

**Framework coverage:**
- Signal primary
- Thrust baseline

ICON: compass

### 60 Day Alignment Sprint

A structured engagement focused on aligning strategy, messaging, and execution so the business operates as a coordinated system.

**Typical work includes:**
- positioning and messaging refinement
- improving customer journey flow
- simplifying operational workflows
- aligning ownership and decision structures

**Framework coverage:**
- Signal locked
- Gravity primary
- Orbit foundation

ICON: orbit

### 90 Day Systems Sprint

A comprehensive engagement designed to build the operational systems required for sustainable growth.

**Typical work includes:**
- designing operational workflows
- establishing planning and execution rhythms
- building measurement and reporting structures
- implementing systems that support repeatable progress

**Framework coverage:**
- Signal, Gravity, Orbit, Thrust end-to-end

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
