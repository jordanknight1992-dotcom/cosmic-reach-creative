export const siteConfig = {
  siteName: "Cosmic Reach Creative",
  domain: "https://cosmicreachcreative.com",
  contactEmail: "jordan@cosmicreachcreative.com",
  calendlySignalCheckUrl:
    "https://calendly.com/jordan-cosmicreachcreative/signal-check",
  calendlyClaritySessionUrl:
    "https://calendly.com/jordan-cosmicreachcreative/clarity-session",
  ga4MeasurementId: "G-BHD0025QXR",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Framework", href: "/framework" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  hiddenRoutes: ["/clarity", "/clarity-session"],
} as const;
