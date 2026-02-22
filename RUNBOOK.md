# Cosmic Reach Creative - Runbook

## Prerequisites

- Node.js 18.17+ (recommended: 20+)
- npm 9+

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:3000`.

## Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run start
```

## Deployment (Vercel behind Cloudflare)

### Vercel Setup

1. Connect the repository to Vercel.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `npm run build`
4. Output directory: `.next` (default)
5. Node.js version: 20.x

### Cloudflare DNS Setup

1. Add the domain `cosmicreachcreative.com` in Cloudflare.
2. Point DNS to Vercel:
   - CNAME `@` to `cname.vercel-dns.com`
   - CNAME `www` to `cname.vercel-dns.com`
3. In Vercel, add the custom domain and verify DNS.
4. SSL: Full (strict) mode in Cloudflare.
5. Enable "Always Use HTTPS" in Cloudflare.

### Environment Variables

No environment variables are required for the base site. The lead capture form writes to local JSON/CSV files in the `data/` directory. For production, you may want to replace the file-based lead storage with a database or API integration.

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    page.tsx              # Homepage (/)
    approach/page.tsx     # /approach
    work/page.tsx         # /work
    work/milestone/       # /work/milestone (case study)
    work/clear-enough/    # /work/clear-enough (case study)
    labs/page.tsx          # /labs
    about/page.tsx         # /about
    signal-session/        # /signal-session
    contact/page.tsx       # /contact
    sitemap.ts            # Generated sitemap
    robots.ts             # Generated robots.txt
    globals.css           # Design tokens + global styles
    layout.tsx            # Root layout (fonts, header, footer)
    favicon.ico           # Brand icon favicon
    icon.svg              # SVG favicon
    apple-icon.png        # Apple touch icon
  components/
    layout/               # Header, Footer, FloatingCTA
    sections/             # PageHero, CaseStudyHeader, CTASection
    ui/                   # Button, Card, Container, Section, etc.
  lib/
    constants.ts          # Site config, nav links, URLs
    metadata.ts           # SEO metadata helper
    leads.ts              # Lead storage (server action)
public/
  images/hero/            # Per-page hero images
  logos/                  # Brand logos (SVG)
```

## Design Token System

Colors, spacing, radii, and motion values are defined in:
- `src/app/globals.css` (CSS custom properties via Tailwind v4 `@theme`)
- Source of truth: `design-tokens.json` from the brand payload

## Font Loading

Fonts are loaded via `next/font/google`:
- **Space Grotesk** (headings): weights 500, 600, 700
- **Inter** (body/UI): weights 400, 500, 600

## Hero Image System

Hero images are stored in `/public/images/hero/` with predictable filenames:
- `home.jpg`, `approach.jpg`, `work.jpg`, `about.jpg`, `signal-session.jpg`, `labs.jpg`, `contact.jpg`

To swap a hero image, replace the corresponding file. No code changes needed.
