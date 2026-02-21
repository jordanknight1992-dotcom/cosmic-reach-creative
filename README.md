# Cosmic Reach Creative

Premium website for Cosmic Reach Creative. Strategy. Systems. Signal.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel (free tier compatible)
- **Fonts:** Space Grotesk (display), Inter (body) via Google Fonts

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Production Preview

```bash
npm run build && npm start
```

## Deploy to Vercel

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import the repository
4. Vercel auto-detects Next.js. No special configuration needed
5. Click "Deploy"

That's it. Vercel handles builds, CDN, and SSL automatically.

### Environment Variables

No environment variables are required for base deployment.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    api/leads/            # Lead capture API endpoint
    about/                # About page
    approach/             # Approach page
    clarity-session/      # Clarity Session form page
    contact/              # Contact form page
    labs/                 # Labs page
    privacy/              # Privacy policy
    work/                 # Work index
      milestone/          # Milestone case study
    globals.css           # Global styles + brand tokens
    layout.tsx            # Root layout
    page.tsx              # Homepage
    sitemap.ts            # Dynamic sitemap
    robots.ts             # Robots.txt config
  components/
    layout/               # Header, Footer
    sections/             # Homepage sections
    ui/                   # Reusable components
  lib/
    constants.ts          # Site config, nav links
    leads.ts              # Lead storage (JSON + CSV)
    metadata.ts           # SEO metadata helper
public/
  images/                 # Optimized images
  logos/                  # Brand logos (SVG)
data/                     # Lead submissions (auto-created)
  leads.json              # JSON lead store
  leads.csv               # CSV lead store
```

## Lead Capture

Form submissions are stored locally in `/data/leads.json` and `/data/leads.csv`.

### Connecting to Mailchimp

1. Create a Mailchimp account and audience
2. Get your API key from Account > Extras > API Keys
3. Update `src/lib/leads.ts` to add a Mailchimp API call after saving locally:

```typescript
// Add after the local save in saveLead()
await fetch(`https://<dc>.api.mailchimp.com/3.0/lists/<list_id>/members`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email_address: entry.email,
    status: "subscribed",
    tags: [entry.segment],
    merge_fields: { FNAME: entry.name },
  }),
});
```

### Connecting to ConvertKit

1. Create a ConvertKit account
2. Get your API key from Settings > Advanced
3. Add a similar API call in `src/lib/leads.ts`:

```typescript
await fetch("https://api.convertkit.com/v3/forms/<form_id>/subscribe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: process.env.CONVERTKIT_API_KEY,
    email: entry.email,
    first_name: entry.name,
    tags: [entry.segment],
  }),
});
```

## Content Editing

See [CONTENT_EDITING.md](./CONTENT_EDITING.md) for a guide to updating copy and content.

## Brand Tokens

See [BRAND_TOKENS.md](./BRAND_TOKENS.md) for the complete design token reference.
