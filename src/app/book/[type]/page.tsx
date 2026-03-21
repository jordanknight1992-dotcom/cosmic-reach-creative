import { Metadata } from "next";
import { notFound } from "next/navigation";
import { bookingTypes } from "@/config/booking";
import { siteConfig } from "@/config/site";
import { BookingFlow } from "@/components/BookingFlow";

type Props = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const booking = bookingTypes[type];
  if (!booking) return {};

  return {
    title: `Book a ${booking.title}`,
    description: booking.description,
    alternates: { canonical: `${siteConfig.domain}/book/${type}` },
  };
}

export default async function BookPage({ params }: Props) {
  const { type } = await params;
  const booking = bookingTypes[type];
  if (!booking) notFound();

  return (
    <main id="main-content">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-deep-space to-deep-space" />
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-10 sm:pb-14 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-copper font-display font-semibold text-sm tracking-widest uppercase mb-3">
              {booking.durationMinutes} minutes
            </p>
            <h1 className="text-starlight">{booking.title}</h1>
            <p className="text-starlight/70 text-base sm:text-lg mt-3">
              {booking.description}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <BookingFlow bookingType={booking} />
          </div>
        </div>
      </section>
    </main>
  );
}
