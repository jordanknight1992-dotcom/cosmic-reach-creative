# Plan: Build a Self-Hosted Calendly Alternative for Cosmic Reach

## Overview

Replace the external Calendly links with a built-in scheduling system directly on cosmicreachcreative.com. This keeps visitors on-site, removes the Calendly branding, and gives you full control over the booking experience.

---

## Architecture Decision

**Approach:** Next.js API routes + Google Calendar API + lightweight database (Vercel KV or JSON file for MVP)

- **No new framework** — everything stays in Next.js 15 App Router
- **Google Calendar** as the source of truth for availability
- **Vercel KV (Redis)** for storing bookings (free tier: 3,000 requests/day) — or a simple JSON/SQLite approach for MVP
- **Resend** (already partially integrated) for confirmation emails

---

## Phase 1: Database & Backend Setup

### Step 1.1 — Install dependencies
```bash
npm install googleapis @vercel/kv date-fns
```

### Step 1.2 — Create environment variables
Add to `.env.local`:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
GOOGLE_CALENDAR_ID=...
KV_REST_API_URL=...        # from Vercel KV dashboard
KV_REST_API_TOKEN=...
RESEND_API_KEY=...          # already exists
```

### Step 1.3 — Google Calendar integration lib
Create `src/lib/google-calendar.ts`:
- Initialize Google Calendar API client using service account or OAuth refresh token
- `getAvailableSlots(date: string, eventType: string)` — queries calendar for free/busy, returns open slots
- `createEvent(booking: BookingData)` — creates a calendar event with attendee info
- Respect business hours (e.g., Mon-Fri, 9am-5pm EST)

### Step 1.4 — Booking types config
Create `src/config/booking-types.ts`:
```ts
export const bookingTypes = {
  'signal-check': {
    name: 'Signal Check',
    duration: 30,       // minutes
    description: 'Free 30-minute intro call',
    price: 0,
    color: '#d4a574',
  },
  'clarity-session': {
    name: 'Clarity Session',
    duration: 90,
    description: '90-minute deep-dive working session',
    price: 497,         // or whatever the price is
    color: '#e04747',
  },
} as const;
```

---

## Phase 2: API Routes

### Step 2.1 — GET `/api/booking/slots`
Create `src/app/api/booking/slots/route.ts`:
- Query params: `date` (YYYY-MM-DD), `type` (signal-check | clarity-session)
- Calls Google Calendar free/busy API
- Returns available time slots for that day
- Filters by business hours and event duration

### Step 2.2 — POST `/api/booking/create`
Create `src/app/api/booking/create/route.ts`:
- Body: `{ type, date, time, name, email, notes? }`
- Validates input
- Double-checks slot is still available (prevents race conditions)
- Creates Google Calendar event
- Stores booking in Vercel KV
- Sends confirmation email via Resend to both parties
- Returns booking confirmation with ID

### Step 2.3 — GET `/api/booking/[id]`
Create `src/app/api/booking/[id]/route.ts`:
- Lookup booking by ID
- Returns booking details (for confirmation page)

---

## Phase 3: Booking UI Pages

### Step 3.1 — Booking page `/book/[type]`
Create `src/app/book/[type]/page.tsx`:
- **Step 1 — Date picker**: Calendar grid showing available dates (current + next month)
- **Step 2 — Time picker**: Once a date is selected, show available time slots
- **Step 3 — Details form**: Name, email, optional notes
- **Step 4 — Confirmation**: Booking confirmed, details shown

All in a single page with stepped UI (no page reloads between steps).

### Step 3.2 — Calendar component
Create `src/components/booking/Calendar.tsx`:
- Month view grid (Sun-Sat)
- Dates with availability highlighted
- Navigation between months
- Disabled past dates and fully-booked dates
- Styled to match Cosmic Reach dark theme

### Step 3.3 — Time slot picker
Create `src/components/booking/TimeSlots.tsx`:
- Grid of available times (e.g., "9:00 AM", "9:30 AM", "10:00 AM")
- Selected state styling
- Timezone display + detection (auto-detect user's timezone)

### Step 3.4 — Booking form
Create `src/components/booking/BookingForm.tsx`:
- Name (required)
- Email (required)
- Notes/agenda (optional textarea)
- Submit button with loading state
- Reuse validation patterns from existing ContactForm

### Step 3.5 — Confirmation page `/book/confirmed`
Create `src/app/book/confirmed/page.tsx`:
- Shows booking details (date, time, type, meeting link)
- "Add to Calendar" button (.ics download)
- Next steps text
- Replaces current `/clarity-confirmed` and `/signal-check-confirmed` pages

---

## Phase 4: Update Existing Site Integration

### Step 4.1 — Update CTA routing
Edit `src/components/CTAButton.tsx`:
- Change Calendly URLs → internal `/book/signal-check` and `/book/clarity-session`
- Remove all references to `calendly.com`

### Step 4.2 — Update site config
Edit `src/config/site.ts`:
- Replace `calendlySignalCheck` and `calendlyClarity` URLs with internal routes

### Step 4.3 — Update confirmation pages
- Redirect old `/clarity-confirmed` → `/book/confirmed`
- Redirect old `/signal-check-confirmed` → `/book/confirmed`

### Step 4.4 — Update sitemap & robots
Edit `src/app/sitemap.ts` to include new `/book/*` routes.

---

## Phase 5: Email Notifications

### Step 5.1 — Confirmation email to client
Create `src/lib/emails/booking-confirmation.ts`:
- HTML email template matching Cosmic Reach branding
- Booking details (date, time, duration, meeting link)
- .ics calendar attachment
- Reschedule/cancel link

### Step 5.2 — Notification email to Jordan
- New booking alert with all details
- Quick-view of the client's notes/agenda

---

## Phase 6: Polish & Extras (Optional)

### Step 6.1 — Timezone handling
- Auto-detect visitor timezone via `Intl.DateTimeFormat`
- Show times in visitor's local timezone
- Store everything in UTC internally

### Step 6.2 — Reschedule / Cancel
- `/book/manage/[id]` page
- Allows rescheduling or cancelling
- Updates Google Calendar event
- Sends update email

### Step 6.3 — Buffer time
- Add configurable buffer between meetings (e.g., 15 min)
- Prevent back-to-back bookings

### Step 6.4 — Booking limits
- Max bookings per day
- Blackout dates (holidays, vacation)

---

## File Summary (New Files)

```
src/
├── config/
│   └── booking-types.ts              # Booking type definitions
├── lib/
│   ├── google-calendar.ts            # Google Calendar API wrapper
│   └── emails/
│       └── booking-confirmation.ts   # Email templates
├── app/
│   ├── api/booking/
│   │   ├── slots/route.ts            # Available slots endpoint
│   │   ├── create/route.ts           # Create booking endpoint
│   │   └── [id]/route.ts             # Booking lookup endpoint
│   └── book/
│       ├── [type]/page.tsx           # Main booking page
│       └── confirmed/page.tsx        # Confirmation page
├── components/booking/
│   ├── Calendar.tsx                  # Date picker calendar
│   ├── TimeSlots.tsx                 # Time slot grid
│   └── BookingForm.tsx               # Booking details form
```

## Modified Files

```
src/config/site.ts                    # Remove Calendly URLs, add booking routes
src/components/CTAButton.tsx          # Route to internal booking pages
src/app/sitemap.ts                    # Add booking routes
.env.local                            # Add Google + KV credentials
package.json                          # New dependencies
```

---

## Implementation Order (Recommended)

1. **Phase 1** — Backend setup (Google Calendar + KV + config) — ~1 session
2. **Phase 2** — API routes (slots + create + lookup) — ~1 session
3. **Phase 3** — UI components (calendar + time picker + form + confirmation) — ~1-2 sessions
4. **Phase 4** — Wire into existing site (CTA updates, redirects) — ~30 min
5. **Phase 5** — Email notifications — ~30 min
6. **Phase 6** — Polish (timezone, reschedule, buffers) — optional, as needed

---

## Prerequisites Before Starting

1. **Google Cloud Console**: Create a project, enable Calendar API, create OAuth credentials, get a refresh token for Jordan's calendar
2. **Vercel KV**: Enable KV store in Vercel dashboard (free tier is fine)
3. **Resend**: Ensure API key is active and domain is verified for `cosmicreachcreative.com`

---

## Alternative: Simpler MVP (No Google Calendar)

If you want to start even simpler:
- Skip Google Calendar integration entirely
- Define available hours in a static config file
- Store bookings in Vercel KV only
- Manually check for conflicts against stored bookings
- Add Google Calendar sync later

This reduces Phase 1 setup significantly and removes the Google Cloud prerequisite.
