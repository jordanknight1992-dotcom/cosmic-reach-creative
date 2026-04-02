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
  ga4MeasurementId: "G-HX48MQKM94",
  nav: [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  howItWorksDropdown: [
    {
      label: "How We Think",
      href: "/framework",
      detail: "The four-layer evaluation framework",
    },
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
    {
      label: "Example Report",
      href: "/clarity-report-example",
      detail: "See what the audit delivers",
    },
  ],
  hiddenRoutes: ["/clarity-session"],
} as const;
