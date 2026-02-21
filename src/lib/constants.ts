export const SITE = {
  name: "Cosmic Reach Creative",
  domain: "cosmicreachcreative.com",
  url: "https://cosmicreachcreative.com",
  email: "jordan@cosmicreachcreative.com",
  founder: "Jordan Knight",
  founderTitle: "Managing Partner, Cosmic Reach",
  description:
    "Systems design for companies navigating complexity. We restore the signal when growth creates noise.",
  linkedIn: "https://www.linkedin.com/company/cosmic-reach-creative",
} as const;

export const MILESTONE_URL = "https://milestone-alpha-liard.vercel.app/";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Approach", href: "/approach" },
  { label: "About", href: "/about" },
  { label: "Labs", href: "/labs" },
] as const;

export const FOOTER_LINKS = [
  { label: "Parallax", href: "/parallax", external: false },
  { label: "Privacy", href: "/privacy", external: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cosmic-reach-creative", external: true },
] as const;
