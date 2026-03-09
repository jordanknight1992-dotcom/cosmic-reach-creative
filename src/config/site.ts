export const siteConfig = {
  siteName: "Cosmic Reach Creative",
  domain: "https://cosmicreachcreative.com",
  contactEmail: "jordan@cosmicreachcreative.com",
  calendlySignalCheckUrl:
    "https://calendly.com/jordan-cosmicreachcreative/signal-check",
  calendlyClaritySessionUrl:
    "https://calendly.com/jordan-cosmicreachcreative/clarity-session",
  stripeAuditUrl:
    "https://buy.stripe.com/28EbITdzT6je8go6i4fbq07",
  ga4MeasurementId: "G-BHD0025QXR",
  nav: [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  howItWorksDropdown: [
    {
      label: "Framework",
      href: "/framework",
      detail: "The 4-layer clarity system",
    },
    {
      label: "Services",
      href: "/services",
      detail: "Sprints and advisory engagements",
    },
    {
      label: "Example Report",
      href: "/clarity-report-example",
      detail: "See a real Clarity Report",
    },
  ],
  hiddenRoutes: ["/clarity", "/clarity-session"],
} as const;
