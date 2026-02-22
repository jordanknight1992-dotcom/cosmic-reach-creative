export const SITE = {
  name: "Cosmic Reach Creative",
  domain: "cosmicreachcreative.com",
  url: "https://www.cosmicreachcreative.com",
  email: "hjordan@cosmicreachcreative.com",
  founder: "Jordan Knight",
  founderTitle: "Managing Partner, Cosmic Reach",
  description:
    "Cosmic Reach designs systems that help teams see clearly, decide faster, and move forward with confidence.",
  linkedIn: "https://www.linkedin.com/company/cosmic-reach-creative",
} as const;

export const MILESTONE_URL = "https://milestone-alpha-liard.vercel.app/";
export const CLEAR_ENOUGH_URL = "https://clearenough.vercel.app/";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Approach", href: "/approach" },
  { label: "Work", href: "/work" },
  { label: "Labs", href: "/labs" },
  { label: "About", href: "/about" },
  { label: "Signal Session", href: "/signal-session" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = [
  { label: "Approach", href: "/approach", external: false },
  { label: "Work", href: "/work", external: false },
  { label: "Labs", href: "/labs", external: false },
  { label: "About", href: "/about", external: false },
  { label: "Contact", href: "/contact", external: false },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cosmic-reach-creative", external: true },
] as const;
