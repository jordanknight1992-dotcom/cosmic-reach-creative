export const siteConfig = {
  siteName: "Cosmic Reach Creative",
  domain: "https://cosmicreachcreative.com",
  contactEmail: "jordan@cosmicreachcreative.com",
  founder: "Jordan Knight",
  location: "Memphis, TN",
  signalCheckUrl: "/book/signal-check",
  claritySessionUrl: "/book/clarity-session",
  stripeAuditUrl:
    "https://buy.stripe.com/28EbITdzT6je8go6i4fbq07",
  stripeOptimizationUrl: "", // TODO: Create Stripe Payment Link for $750/mo subscription
  stripeMissionControlUrl: "", // TODO: Create Stripe Payment Link for $150/mo subscription
  ga4MeasurementId: "G-HX48MQKM94",
  nav: [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Work", href: "/work" },
  ],
  ctaNav: { label: "Book a Call", href: "/connect" },
  howItWorksDropdown: [
    {
      label: "Services",
      href: "/services",
      detail: "Audit, rebuild, and optimization",
    },
    {
      label: "The Clarity Audit",
      href: "/clarity",
      detail: "The $150 diagnostic entry point",
    },
  ],
  hiddenRoutes: ["/clarity-session"],
} as const;
