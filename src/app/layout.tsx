import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `${siteConfig.siteName} | Operational Clarity for Teams`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    "Cosmic Reach helps organizations diagnose friction, align execution, and build operational systems that make progress sustainable.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.domain,
    siteName: siteConfig.siteName,
    title: "Cosmic Reach | Operational Clarity for Teams",
    description:
      "Cosmic Reach helps organizations diagnose friction, align execution, and build operational systems that make progress sustainable.",
    images: [
      {
        url: "/images/og-preview.png",
        width: 1200,
        height: 627,
        alt: `${siteConfig.siteName} — Mission Control for Operational Clarity`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cosmic Reach | Operational Clarity for Teams",
    description:
      "Cosmic Reach helps organizations diagnose friction, align execution, and build operational systems that make progress sustainable.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <FloatingCTA />

        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4MeasurementId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteConfig.ga4MeasurementId}', {
              anonymize_ip: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}
