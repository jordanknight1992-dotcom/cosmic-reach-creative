# Content Editing Guide

This guide explains how to update text, images, and content across the Cosmic Reach Creative website.

## General Principles

- All content lives in the component files under `src/`
- Copy is embedded directly in components for performance (no CMS dependency)
- Maintain the brand voice: confident, cosmic, structured. Use "we" voice
- No em dashes. Use commas, periods, or restructure sentences
- Red is used as signal only, never decoratively

## Page Content Locations

| Page | File Path |
|------|-----------|
| Homepage | `src/app/page.tsx` + `src/components/sections/*.tsx` |
| Work | `src/app/work/page.tsx` |
| Milestone | `src/app/work/milestone/page.tsx` |
| Approach | `src/app/approach/page.tsx` |
| About | `src/app/about/page.tsx` |
| Labs | `src/app/labs/page.tsx` |
| Clarity Session | `src/app/clarity-session/page.tsx` |
| Contact | `src/app/contact/page.tsx` |
| Privacy | `src/app/privacy/page.tsx` |

## Editing Homepage Sections

Each homepage section is a separate component in `src/components/sections/`:

- **Hero.tsx** - Main hero headline, subheading, CTAs
- **ClarityBlock.tsx** - Clarity positioning statement
- **Pillars.tsx** - Three pillars (Creative, Parallax, Labs)
- **HowWeWork.tsx** - Three step process
- **FeaturedProof.tsx** - Milestone case study preview
- **EmailCapture.tsx** - Email segmentation form
- **FinalCTA.tsx** - Bottom CTA section

## Adding a New Case Study

1. Create a new directory: `src/app/work/[slug]/page.tsx`
2. Follow the pattern in `src/app/work/milestone/page.tsx`
3. Add metadata using the `createMetadata` helper
4. Add a card for the new case study in `src/app/work/page.tsx`

## Updating Images

Images live in `public/images/`. To replace an image:

1. Add the new image to `public/images/`
2. Use `next/image` for automatic optimization
3. Always include descriptive `alt` text
4. Provide appropriate `sizes` attribute

## Updating SEO Metadata

Each page exports metadata using the `createMetadata` helper from `src/lib/metadata.ts`. Update the `title` and `description` parameters.

## Updating Navigation

Edit `src/lib/constants.ts`:

- `NAV_LINKS` controls the header navigation
- `FOOTER_LINKS` controls the footer links
- `SITE` contains global site configuration

## Form Fields

- Clarity Session form: `src/app/clarity-session/ClarityForm.tsx`
- Contact form: `src/app/contact/ContactForm.tsx`
- Email capture: `src/components/sections/EmailCapture.tsx`

## Brand Voice Reminders

- Use "we" voice, never "I"
- Confident, not aggressive
- Cosmic metaphors are welcome but disciplined
- No corporate cliches
- No em dashes
- Founder is Jordan Knight, Managing Partner, Cosmic Reach
- Do not name previous employers
