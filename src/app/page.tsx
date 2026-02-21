import { Hero } from "@/components/sections/Hero";
import { ClarityBlock } from "@/components/sections/ClarityBlock";
import { SocialProof } from "@/components/sections/SocialProof";
import { Pillars } from "@/components/sections/Pillars";
import { FeaturedProof } from "@/components/sections/FeaturedProof";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          founder: {
            "@type": "Person",
            name: SITE.founder,
            jobTitle: SITE.founderTitle,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
        }}
      />
      <Hero />
      <ClarityBlock />
      <SocialProof />
      <Pillars />
      <FeaturedProof />
      <FinalCTA />
    </>
  );
}
