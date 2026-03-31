import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Cosmic Reach Creative | Marketing Strategy & Growth Systems for Founders",
    template: `%s | Cosmic Reach Creative`,
  },
  description:
    "Cosmic Reach Creative is a marketing strategy consultancy founded by Jordan Knight in Memphis, TN. We help founders and growing businesses build messaging, offer design, customer journeys, and growth systems that scale. Start with a Business Clarity Audit.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.siteName,
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 627,
        alt: "Cosmic Reach Creative: Marketing Strategy & Growth Systems for Founders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-preview.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  alternates: {
    canonical: siteConfig.domain,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": `${siteConfig.domain}/#organization`,
      name: "Cosmic Reach Creative",
      url: siteConfig.domain,
      logo: `${siteConfig.domain}/favicon/favicon.svg`,
      image: `${siteConfig.domain}/images/og-preview.png`,
      description:
        "Cosmic Reach Creative is a marketing strategy consultancy that helps founders and growing businesses build messaging, offer design, customer journeys, and growth systems that scale. Founded by Jordan Knight in Memphis, TN.",
      email: siteConfig.contactEmail,
      founder: {
        "@type": "Person",
        name: "Jordan Knight",
        jobTitle: "Founder & Marketing Strategist",
        url: `${siteConfig.domain}/about`,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Memphis",
        addressRegion: "TN",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 35.1495,
        longitude: -90.0490,
      },
      areaServed: [
        {
          "@type": "City",
          name: "Memphis",
          "@id": "https://www.wikidata.org/wiki/Q16563",
        },
        {
          "@type": "Country",
          name: "United States",
        },
      ],
      priceRange: "$150–$6,000",
      serviceType: [
        "Marketing Strategy Consulting",
        "Marketing Consulting",
        "Business Strategy Consulting",
        "Brand Messaging Strategy",
        "Growth Systems Design",
      ],
      knowsAbout: [
        "Marketing Strategy",
        "Brand Messaging",
        "Offer Design",
        "Customer Journey Optimization",
        "Growth Systems",
        "Marketing Architecture",
        "Business Clarity Audits",
        "Go-to-Market Strategy",
        "Fractional Marketing Strategy",
      ],
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.domain}/#website`,
      url: siteConfig.domain,
      name: "Cosmic Reach Creative",
      publisher: { "@id": `${siteConfig.domain}/#organization` },
    },
    {
      "@type": "Service",
      "@id": `${siteConfig.domain}/#clarity-audit`,
      name: "Website Audit",
      provider: { "@id": `${siteConfig.domain}/#organization` },
      description:
        "A focused review of your website and messaging that shows where visitors get stuck, what is unclear, what is limiting inquiries, and what to fix first.",
      serviceType: "Website Audit",
      offers: {
        "@type": "Offer",
        price: "150",
        priceCurrency: "USD",
        url: `${siteConfig.domain}/pricing`,
      },
    },
    {
      "@type": "Service",
      name: "Brand and Website Rebuild",
      provider: { "@id": `${siteConfig.domain}/#organization` },
      description:
        "A full rebuild of positioning, messaging, website, sales materials, and lead capture. Completed in about 30 days.",
      serviceType: "Website Design and Development",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "4000",
        highPrice: "8000",
        priceCurrency: "USD",
        url: `${siteConfig.domain}/pricing`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', { analytics_storage: 'denied' });
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
