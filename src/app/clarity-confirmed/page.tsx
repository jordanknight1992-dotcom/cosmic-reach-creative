import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Clarity Session Confirmed",
  description: "Your Clarity Session is confirmed.",
  alternates: { canonical: `${siteConfig.domain}/clarity-confirmed` },
  robots: { index: false, follow: false },
};

export default function ClarityConfirmedPage() {
  return (
    <main id="main-content">
      <section className="relative overflow-hidden" aria-labelledby="confirmed-title">
        <div className="absolute inset-0">
          <Image
            src="/images/08-results-section.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/80 via-deep-space/70 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
          <div className="max-w-2xl">
            <h1 id="confirmed-title">Clarity Session Confirmed</h1>
            <p className="text-starlight/80 text-lg mt-6">
              Your Clarity Session is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-22">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-starlight/70 mb-4">
              You will receive a calendar confirmation with Google Meet details shortly.
            </p>
            <p className="text-starlight/70 mb-4">
              Within 24 hours, you will receive a short preparation note outlining what to bring.
            </p>
            <p className="text-starlight/70 mb-6">
              After the session, you will receive a structured Clarity Report within five business days.
            </p>
            <p className="text-starlight/70 mb-4">To prepare:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-starlight/70">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Identify the initiative most at risk
              </li>
              <li className="flex items-start gap-2 text-starlight/70">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Clarify where alignment currently breaks down
              </li>
              <li className="flex items-start gap-2 text-starlight/70">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Gather any documents that reflect your current operating structure
              </li>
            </ul>
            <p className="text-starlight/70 mb-4">
              If you need to adjust scheduling, use the reschedule link in your confirmation email.
            </p>
            <p className="text-starlight/70 font-semibold">
              Clarity is not accidental. It is designed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
