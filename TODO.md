# Cosmic Reach Creative - TODO

## Production Readiness

- [ ] Replace file-based lead storage (`data/leads.json`) with a production database or CRM integration (e.g., Airtable, Supabase, or email forwarding via Resend/SendGrid)
- [ ] Add proper OG image assets (1200x630) for each page - currently using hero images as OG images
- [ ] Configure Vercel deployment and custom domain
- [ ] Set up Cloudflare DNS and SSL

## Content

- [ ] Review all hero images and replace with final production photography if needed (swap files in `/public/images/hero/`)
- [ ] Verify all external links are live (Milestone: milestone-alpha-liard.vercel.app, Clear Enough: clearenough.vercel.app)

## Legacy Routes

The following routes exist from the previous build and may need cleanup:
- `/clarity-session` - Old route, now replaced by `/signal-session`. Consider adding a redirect.
- `/parallax` - Exists but not in the current required routes. Keep or remove per business decision.
- `/privacy` - Privacy policy page. Keep as needed.

## Optional Enhancements

- [ ] Add analytics (Vercel Analytics, Plausible, or similar)
- [ ] Add a 301 redirect from `/clarity-session` to `/signal-session`
- [ ] Consider adding a loading/skeleton state for forms
