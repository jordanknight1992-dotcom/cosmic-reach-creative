import Image from "next/image";

const credentials = [
  {
    name: "Google Analytics Certified",
    image: "/images/badges/hubspot-inbound-icon.png",
  },
  {
    name: "Hubspot Digital Marketing Certified",
    image: "/images/badges/hubspot-digital-badge.png",
  },
  {
    name: "Hubspot Inbound Marketing Optimization Certified",
    image: "/images/badges/Credentials-1-04.png",
  },
];

export function Credentials() {
  return (
    <section
      className="py-16 sm:py-24 bg-deep-space"
      aria-labelledby="credentials-heading"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="credentials-heading"
            className="font-display font-semibold mb-4 text-starlight"
          >
            Credentials supporting the work
          </h2>
          <p className="text-sm leading-relaxed max-w-xl mx-auto text-starlight/60">
            Certified in Google Analytics, Digital Marketing, and Inbound
            Marketing Optimization to support performance analysis, conversion
            strategy, and visibility decisions.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-[560px] mx-auto mt-4">
          {credentials.map((cred) => (
            <div key={cred.name} className="flex flex-col items-center gap-3">
              <div className="rounded-[var(--radius-md)] border border-starlight/15 p-5 flex items-center justify-center transition-colors duration-300 ease-out hover:border-copper/60">
                <Image
                  src={cred.image}
                  alt={cred.name}
                  width={200}
                  height={200}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <p className="text-xs sm:text-sm leading-snug font-display font-semibold text-starlight/80 text-center">
                {cred.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
