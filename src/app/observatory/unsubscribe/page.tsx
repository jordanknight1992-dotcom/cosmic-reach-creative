import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribe | The Observatory",
  robots: { index: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const isSuccess = success === "true";

  return (
    <main id="main-content">
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
        <div className="max-w-md mx-auto">
          {isSuccess ? (
            <>
              <h1 className="font-display text-2xl font-semibold text-starlight mb-4">
                You&apos;ve been unsubscribed.
              </h1>
              <p className="text-starlight/60 text-base mb-8">
                You will no longer receive emails from The Observatory.
              </p>
              <Link
                href="/observatory"
                className="text-copper font-display font-semibold text-sm hover:text-copper/80 transition-colors"
              >
                &larr; Back to The Observatory
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold text-starlight mb-4">
                Invalid unsubscribe link.
              </h1>
              <p className="text-starlight/60 text-base mb-8">
                This link may have expired or already been used.
              </p>
              <Link
                href="/observatory"
                className="text-copper font-display font-semibold text-sm hover:text-copper/80 transition-colors"
              >
                &larr; Back to The Observatory
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
