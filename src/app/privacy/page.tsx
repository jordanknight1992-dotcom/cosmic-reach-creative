import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.siteName}.`,
  alternates: { canonical: `${siteConfig.domain}/privacy` },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="pt-32 pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="mb-4">Privacy Policy</h1>
          <p className="text-starlight/60 text-sm mb-8">Last updated: March 30, 2026</p>

          <div className="space-y-6 text-starlight/70">
            <p>
              {siteConfig.siteName} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy. This policy describes how we collect, use, and protect information when you visit our website or use our services.
            </p>

            <h2 className="text-xl mt-8">Information We Collect</h2>
            <p>We collect information in the following ways:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Contact forms:</strong> When you submit a contact or audit intake form, we collect your name, email address, company name, and any details you provide about your business.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Booking system:</strong> When you book a session, we collect your name, email, and any notes you include. We use Google Calendar to schedule meetings and Google Meet for video calls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Payment processing:</strong> Payments are processed securely through Stripe. We do not store credit card numbers on our servers. Stripe&apos;s privacy policy governs payment data handling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Analytics:</strong> We use Google Analytics (GA4) with anonymized IP addresses to understand how visitors use our site. This data helps us improve the experience and does not personally identify you.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>CTA tracking:</strong> We track which buttons and calls-to-action are clicked to understand user behavior. This data is aggregated and does not include personal information.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Mission Control accounts:</strong> If you create a Mission Control workspace, we collect your name, email address, and a hashed password. Passwords are stored using bcrypt encryption and are never stored in plain text. We also store session tokens to keep you signed in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Two-factor authentication:</strong> If you enable two-factor authentication, we store an encrypted TOTP secret used to verify your authenticator app codes. We do not have access to your authenticator app.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <span><strong>Third-party API keys:</strong> Mission Control users may provide their own API keys for integrations. These are encrypted using AES-256-GCM with PBKDF2 key derivation and stored securely. Keys are only decrypted server-side when making API calls on your behalf.</span>
              </li>
            </ul>

            <h2 className="text-xl mt-8">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Respond to inquiries and manage bookings
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Deliver services including audits, reports, and strategy sessions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Send booking confirmations and service-related communications
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Improve our website and services based on usage patterns
              </li>
            </ul>
            <p>
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>

            <h2 className="text-xl mt-8">Data Storage &amp; Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. Form submissions and booking data are stored in a secured database hosted by Neon (PostgreSQL). We use Resend for transactional email delivery. All data transmission uses HTTPS encryption.
            </p>

            <h2 className="text-xl mt-8">Cookies</h2>
            <p>
              Cosmic Reach uses essential cookies to support core site functionality and analytics cookies to understand traffic and improve the website experience. Visitors can accept, decline, or manage analytics preferences through the cookie banner and the &ldquo;Cookie Preferences&rdquo; link in the footer.
            </p>
            <p>
              If you accept analytics cookies, Google Analytics (GA4) will set cookies to distinguish unique users and sessions. These cookies do not personally identify you. If you decline, no analytics cookies are set and GA4 does not load.
            </p>
            <p>
              Mission Control uses a secure, HTTP-only session cookie to keep you signed in. This cookie is set to SameSite Strict, meaning it is not sent with cross-site requests. Session cookies expire after 30 days of inactivity.
            </p>

            <h2 className="text-xl mt-8">Third-Party Services</h2>
            <p>We use the following third-party services, each governed by their own privacy policies:</p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <strong>Google Analytics</strong> (site analytics)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <strong>Google Calendar &amp; Meet</strong> (scheduling and video calls)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <strong>Stripe</strong> (payment processing)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <strong>Resend</strong> (transactional emails)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                <strong>Vercel</strong> (website hosting)
              </li>
            </ul>

            <h2 className="text-xl mt-8">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information at any time by contacting us. We will respond within 30 days.
            </p>

            <h2 className="text-xl mt-8">Contact</h2>
            <p>
              If you have privacy-related questions, contact us at{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-copper hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
