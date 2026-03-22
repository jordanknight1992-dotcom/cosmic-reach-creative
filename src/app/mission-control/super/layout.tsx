export default function SuperLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
