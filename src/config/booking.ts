export type BookingType = {
  slug: string;
  title: string;
  durationMinutes: number;
  description: string;
  /** Price in cents, or null for free */
  priceCents: number | null;
  /** Stripe payment link URL (for paid sessions) */
  stripePaymentLink?: string;
};

export const bookingTypes: Record<string, BookingType> = {
  "signal-check": {
    slug: "signal-check",
    title: "Signal Check",
    durationMinutes: 30,
    description:
      "A focused 30-minute call to assess where your brand stands and identify the clearest next move.",
    priceCents: null,
  },
  "clarity-session": {
    slug: "clarity-session",
    title: "Business Clarity Audit",
    durationMinutes: 90,
    description:
      "A deep 90-minute working session to map your positioning, messaging, and launch strategy.",
    priceCents: 15000, // $150
    stripePaymentLink: "https://buy.stripe.com/28EbITdzT6je8go6i4fbq07",
  },
  "connect-30": {
    slug: "connect-30",
    title: "Connect with Jordan",
    durationMinutes: 30,
    description: "A 30-minute open conversation — introductions, questions, or whatever's on your mind.",
    priceCents: null,
  },
  "connect-60": {
    slug: "connect-60",
    title: "Connect with Jordan",
    durationMinutes: 60,
    description: "A 60-minute conversation — enough time to dig into a topic and explore next steps.",
    priceCents: null,
  },
  "connect-90": {
    slug: "connect-90",
    title: "Connect with Jordan",
    durationMinutes: 90,
    description: "A 90-minute deep dive — ideal for complex discussions or working through a challenge together.",
    priceCents: null,
  },
};

/** Booking types shown on the /connect page */
export const connectTypes = ["connect-30", "connect-60", "connect-90"] as const;

/**
 * Weekly availability windows (in the owner's timezone).
 * Each entry is a day (0=Sun, 6=Sat) with start/end hours (24h).
 */
export const availability = {
  timezone: "America/Chicago",
  /** Buffer minutes between consecutive bookings */
  bufferMinutes: 15,
  windows: [
    { day: 1, startHour: 9, endHour: 17 }, // Monday
    { day: 2, startHour: 9, endHour: 17 }, // Tuesday
    { day: 3, startHour: 9, endHour: 17 }, // Wednesday
    { day: 4, startHour: 9, endHour: 17 }, // Thursday
    { day: 5, startHour: 9, endHour: 17 }, // Friday
  ],
} as const;
