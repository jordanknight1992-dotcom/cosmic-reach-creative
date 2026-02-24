import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Signal Check Scheduled",
  description: "Your Signal Check is confirmed.",
  alternates: { canonical: `${siteConfig.domain}/signal-check-confirmed` },
  robots: { index: false, follow: false },
};

export default function SignalCheckConfirmedPage() {
  return (
    <main id="main-content">
      <section className="relative overflow-hidden" aria-labelledby="confirmed-title">
        <div className="absolute inset-0">
          <Image
            src="/images/07-clarity-section.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/80 via-deep-space/70 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 sm:pb-28">
          <div className="max-w-2xl">
            <h1 id="confirmed-title">Signal Check Scheduled</h1>
            <p className="text-starlight/80 text-lg mt-6">
              Your Signal Check is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-22">
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-starlight/70 mb-4">
              You will receive a calendar confirmation shortly with Google Meet details.
            </p>
            <p className="text-starlight/70 mb-6">
              This conversation is focused and diagnostic.
            </p>
            <p className="text-starlight/70 mb-4">To make it valuable, consider:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-starlight/70">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Where clarity currently breaks down
              </li>
              <li className="flex items-start gap-2 text-starlight/70">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                A decision that feels slower than it should
              </li>
              <li className="flex items-start gap-2 text-starlight/70">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                What outcome would make this discussion useful
              </li>
            </ul>
            <p className="text-starlight/70 mb-4">
              If circumstances change, you may reschedule using the link in your confirmation email.
            </p>
            <p className="text-starlight/70 font-semibold">
              We will begin by identifying whether signal is present or missing.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
