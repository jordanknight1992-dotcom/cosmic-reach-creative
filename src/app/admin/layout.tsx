/**
 * Admin layout — suppresses the site header, footer, and floating CTA
 * so the admin dashboard has its own full-screen layout.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide site chrome on admin pages */}
      <style>{`
        body > header,
        body > footer,
        body > a.skip-link,
        body > div[class*="fixed"] { display: none !important; }
        a[href="/connect"][class*="fixed"] { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
