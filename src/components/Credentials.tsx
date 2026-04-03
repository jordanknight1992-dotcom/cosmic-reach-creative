import Image from "next/image";

const credentials = [
  {
    name: "Google Analytics Certified",
    image: "/images/badges/google-analytics.png",
  },
  {
    name: "HubSpot Digital Marketing Certified",
    image: "/images/badges/hubspot-digital-badge.png",
  },
  {
    name: "HubSpot Inbound Marketing Optimization Certified",
    image: "/images/badges/hubspot-inbound-badge.png",
  },
];

export function Credentials() {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "#F5F0EB" }}
      aria-labelledby="credentials-heading"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="credentials-heading"
            className="font-display font-semibold text-sm tracking-[0.15em] uppercase mb-3"
            style={{ color: "#1a1a1a" }}
          >
            Credentials supporting the work
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xl mx-auto mb-12"
            style={{ color: "#555" }}
          >
            Certified in Google Analytics, Digital Marketing, and Inbound
            Marketing Optimization to support performance analysis, conversion
            strategy, and visibility decisions.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-[540px] mx-auto">
            {credentials.map((cred) => (
              <div key={cred.name} className="flex flex-col items-center gap-3">
                <div className="w-full aspect-square bg-white rounded-full shadow-sm flex items-center justify-center p-3 sm:p-5">
                  <Image
                    src={cred.image}
                    alt={cred.name}
                    width={120}
                    height={120}
                    className="w-full h-full object-contain transition-transform duration-300 ease-out hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <p
                  className="text-[11px] sm:text-xs leading-snug font-display font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {cred.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
