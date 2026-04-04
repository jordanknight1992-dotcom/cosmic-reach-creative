/**
 * Seed script: Insert the first Observatory article.
 * Run via: npx tsx scripts/seed-first-article.ts
 * Requires POSTGRES_URL env var.
 */

import { createPost, ensureBlogTables } from "../src/lib/blog-db";

const ARTICLE_BODY = `Read that again. Starting marketing from scratch is officially dead. AI killed it.

You don't sit down to create the way you used to. You prompt. You generate. You get homepage copy, ads, emails, landing pages, and sales funnel structure in seconds. And most of it's decent.

But when everyone has access to the same fast, polished starting point, the value shifts. It no longer lives in getting something on the page. It lives in what happens after.

It lives in taste and refinement.

[See the Clarity Audit](https://www.cosmicreachcreative.com/clarity)

## The shift in strategy

AI is momentum for modern marketing. It makes go-to-market fast. It removes friction from the execution cycle. The issue is that it delivers a first draft before people fully think through the strategy behind it.

That speed is important, but it doesn't guarantee performance. The real work starts after the draft exists.

## Why "good enough" is hurting performance

Most AI-assisted marketing is fine. It's usually even polished enough to pass online. And yet you have definitely read content that feels eerily familiar to three others you read while scrolling the last 20 minutes.

A well-formatted article doesn't move people. Consumers convert when something feels true, relevant, and specific to the tension they're already carrying. Unless you have taste and discernment, your content might earn a few likes on LinkedIn but it rarely earns trust.

## What actually drives conversions

### 1. Cut what weakens the signal

AI over-explains. It adds layers that sound polished, but strong marketing gets clearer as it shortens.

With La Chérie Weddings, the real life work already felt elevated. When building, the initial framework, even with extensive guidance, felt like 25 other generic luxury wedding companies in Memphis. Swap the logo and you would never know. We stripped that away and got to what made the experience distinct.

That La Chérie Weddings is personally guided, beautifully considered, calmly led, and deeply personal.

### 2. Inject what you can only understand after it's lived

AI is trained on patterns. But the strongest positioning usually comes from context a machine can't write without local pressure, buyer tension, and category truth.

Look at the Bluff City AC concept.

An original AI draft said, "We provide reliable HVAC services to keep your home comfortable year-round."

But you know what matters to a family in Memphis when it's 100° outside and their 15-year-old AC unit finally takes its last breath in the heat of the day? Knowing that they will have someone out before they are sleepless at 10:00pm worrying about if their kids are overheating.

"85° inside. Dispatch initiated."

### 3. Make the buyer feel understood

Most weak marketing explains the business instead of reflecting the buyer. Ask yourself, does my copy sound like someone who understands the exact emotional pressure sitting behind the click?

People making expensive decisions are rarely calm. They are comparing options, second-guessing themselves, and trying not to waste money. Your message has to meet them there.

## What Strategic Positioning Looks Like

Most websites do not fail because the business lacks value. They fail because the message never lands.

**HVAC**
AI Draft: "We provide reliable HVAC services to keep your home comfortable year-round."
Strategic Edit: "85° inside. Dispatch initiated."
[See it in action](https://www.cosmicreachcreative.com/work/bluff-city-ac)

**Luxury Weddings**
AI Draft: "Bespoke wedding planning for your special day and memories."
Strategic Edit: "Your wedding should feel like yours."
[See it in action](https://www.cosmicreachcreative.com/work/la-cherie)

The first speaks to logistics. The second speaks to urgency and identity.

If you feel like your positioning is similar to everyone else, it probably is.

That's the gap I help businesses find through the Clarity Audit. We look at your messaging, your website, and your conversion path to find where it's breaking down.

[See the Clarity Audit](https://www.cosmicreachcreative.com/clarity)

## Closing thought

The blank page is gone. Now the value shows up in what you cut, what you sharpen, and who has the discernment to resist when ChatGPT tells you it's brilliantly written.

AI can give you a solid first draft, but conversions still depend on judgment.`;

async function main() {
  console.log("Ensuring blog tables exist...");
  await ensureBlogTables();

  console.log("Creating first article...");
  const post = await createPost({
    title: "The blank page of marketing is dead. What actually drives conversions now.",
    slug: "the-blank-page-of-marketing-is-dead",
    body: ARTICLE_BODY,
    excerpt:
      "AI erased the blank page. The edge now lives in refinement, positioning, and the judgment to make buyers feel understood.",
    feature_image: "/images/observatory/02-framework-hero.jpg",
    category: "AI in Marketing",
    tags: ["AI in Marketing", "Positioning", "Conversion Systems", "Brand Strategy"],
    author: "Jordan Knight",
    status: "published",
    featured: true,
    published_at: new Date().toISOString(),
    seo_title: "The Blank Page of Marketing Is Dead | What Actually Drives Conversions Now",
    seo_description:
      "AI made first-draft marketing instant. Conversions still depend on judgment, positioning, refinement, and understanding what buyers actually feel.",
    og_title: "The Blank Page of Marketing Is Dead",
    og_description:
      "AI can generate the draft. Conversion still depends on taste, refinement, and strategic positioning.",
    reading_time_minutes: 5,
    noindex: false,
  });

  console.log(`Article created with id=${post.id}, slug=${post.slug}`);
  console.log("Done!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
