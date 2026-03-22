/**
 * Mission Control top-level layout.
 * The landing page (/mission-control) shows the normal site header/footer.
 * Nested layouts (tenant pages, login, super) hide site chrome themselves.
 */
export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
