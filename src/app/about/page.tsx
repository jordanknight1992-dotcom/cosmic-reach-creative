import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cosmic Reach was built from years inside real delivery environments where visibility, structure, and execution determined whether projects succeeded.",
  alternates: { canonical: `${siteConfig.domain}/about` },
};

const content = `# Built From the Operator's Seat

Cosmic Reach wasn't built from theory.
It was built from years inside real delivery environments where visibility, structure, and execution determined whether projects succeeded.

IMAGE: 05-about-hero.jpg

---

## The Perspective Behind the Work

Jordan Knight has led infrastructure programs, marketing initiatives, and delivery systems where clarity wasn't optional.

That experience shaped a simple belief:

When the system works, teams don't need constant rescue.

Cosmic Reach exists to design those systems.

IMAGE: founder/jordan-knight-cosmic-reach-operator.jpg

---

## Systems Over Guesswork

**Clear Direction beats constant motion**
ICON: compass

**Aligned ownership prevents silent failure**
ICON: network

**Execution needs structure, not pressure**
ICON: gears

**Visibility turns activity into decisions**
ICON: eye`;

export default function AboutPage() {
  return <MarkdownPage content={content} />;
}
