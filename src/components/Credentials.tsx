import Image from "next/image";

const credentials = [
  {
    name: "Google Analytics",
    image: "/images/badges/google-analytics.png",
    href: "https://skillshop.credential.net/179008672",
  },
  {
    name: "HubSpot Digital Marketing",
    image: "/images/badges/hubspot-digital.png",
    href: "https://app-na2.hubspot.com/academy/achievements/q8pgmpkc/en/1/jordan-knight/digital-marketing",
  },
  {
    name: "HubSpot Inbound Marketing Optimization",
    image: "/images/badges/hubspot-inbound.png",
    href: "https://app-na2.hubspot.com/academy/achievements/fy5zpqkx/en/1/jordan-knight/inbound-marketing-optimization",
  },
];

export function Credentials() {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="credentials-heading">
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-[var(--radius-lg)] border border-starlight/6 bg-navy/30 px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center mb-8">
              <h2
                id="credentials-heading"
                className="font-display font-semibold text-sm tracking-widest uppercase text-starlight/30 mb-3"
              >
                Credentials supporting the work
              </h2>
              <p className="text-starlight/40 text-sm leading-relaxed max-w-lg mx-auto">
                Certified in Google Analytics, Digital Marketing, and Inbound Marketing Optimization to support performance visibility, conversion strategy, and smarter growth decisions.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {credentials.map((cred) => (
                <a
                  key={cred.name}
                  href={cred.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-[88px] h-[88px] sm:w-[96px] sm:h-[96px] rounded-xl bg-starlight/[0.03] border border-starlight/[0.04] p-3 transition-all duration-[var(--duration-base)] hover:border-copper/20 hover:bg-starlight/[0.05]"
                  aria-label={`${cred.name} certification`}
                >
                  <Image
                    src={cred.image}
                    alt={`${cred.name} certified`}
                    width={72}
                    height={72}
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
