import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { bookingTypes, connectTypes } from "@/config/booking";

export const metadata: Metadata = {
  title: "Connect with Jordan",
  description:
    "Book a time to talk with Jordan Knight, founder of Cosmic Reach Creative. Choose a session length and pick a time that works for you.",
  alternates: { canonical: `${siteConfig.domain}/connect` },
};

export default function ConnectPage() {
  const types = connectTypes.map((slug) => bookingTypes[slug]);

  return (
    <main id="main-content">
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="mx-auto max-w-md px-5 sm:px-6 py-16 sm:py-24 text-center">
          {/* Headshot */}
          <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-copper/30 ring-offset-4 ring-offset-deep-space">
            <Image
              src="/images/founder/jordan-knight-cosmic-reach-operator.jpg"
              alt="Jordan Knight"
              fill
              className="object-cover"
              priority
              sizes="112px"
            />
          </div>

          {/* Name + Logo */}
          <h1 className="text-starlight text-2xl mb-1">Connect with Jordan</h1>
          <p className="text-copper font-display text-sm font-semibold tracking-wider uppercase mb-2">
            Cosmic Reach Creative
          </p>
          <p className="text-starlight/50 text-sm mb-8 max-w-xs mx-auto">
            Choose a session length and pick a time that works for you.
          </p>

          {/* Duration Options */}
          <div className="space-y-3">
            {types.map((type) => (
              <Link
                key={type.slug}
                href={`/book/${type.slug}`}
                className="group flex items-center justify-between gap-4 w-full rounded-[var(--radius-md)] border border-starlight/10 bg-navy/60 px-5 py-4 transition-all duration-[var(--duration-base)] hover:border-copper/40 hover:bg-copper/5"
              >
                <div className="text-left">
                  <p className="text-starlight font-display font-semibold text-base group-hover:text-copper transition-colors">
                    {type.durationMinutes} Minutes
                  </p>
                  <p className="text-starlight/40 text-xs mt-0.5">
                    {type.description}
                  </p>
                </div>
                <div className="shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-starlight/20 group-hover:text-copper transition-colors"
                  >
                    <path
                      d="M8 5L13 10L8 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-starlight/5">
            <p className="text-starlight/25 text-xs">
              Powered by{" "}
              <a
                href={siteConfig.domain}
                className="text-copper/40 hover:text-copper/60 transition-colors"
              >
                Cosmic Reach Creative
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
