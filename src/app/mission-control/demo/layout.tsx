import { McShell } from "../[tenantSlug]/McShell";

const DEMO_USER = {
  id: 0,
  email: "demo@cosmicreachcreative.com",
  full_name: "Demo User",
  is_super_admin: false,
};

const DEMO_TENANT = {
  id: 0,
  name: "Cosmic Reach Creative",
  slug: "demo",
  plan: "core",
  onboarding_completed: true,
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > header,
        body > footer,
        body > a.skip-link,
        body > div[class*="fixed"] { display: none !important; }
        a[href="/connect"][class*="fixed"] { display: none !important; }
      `}</style>
      <McShell user={DEMO_USER} tenant={DEMO_TENANT} isImpersonation={false}>
        {children}
      </McShell>
    </>
  );
}
