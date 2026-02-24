import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <main id="main-content" className="flex items-center justify-center min-h-[60vh] pt-20">
      <div className="text-center px-4">
        <Icon name="compass" size={48} className="opacity-50 mb-6 mx-auto block" />
        <h1 className="mb-4">Signal Lost</h1>
        <p className="text-starlight/70 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-6 py-3 font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
        >
          Return to Mission Control
        </Link>
      </div>
    </main>
  );
}
