"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { BookingType } from "@/config/booking";

type Slot = { start: string; end: string };
type Step = "date" | "time" | "details" | "confirmed";

interface BookingFlowProps {
  bookingType: BookingType;
}

export function BookingFlow({ bookingType }: BookingFlowProps) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const fetchSlots = useCallback(
    async (dateStr: string) => {
      setLoadingSlots(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/booking/slots?type=${bookingType.slug}&date=${dateStr}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load slots");
        setSlots(data.slots);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load slots");
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [bookingType.slug]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  function handleDateSelect(dateStr: string) {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setStep("time");
  }

  function handleSlotSelect(slot: Slot) {
    setSelectedSlot(slot);
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: bookingType.slug,
          startTime: selectedSlot.start,
          name,
          email,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setBookingId(data.booking.id);
      setStep("confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  const stepIndex = { date: 0, time: 1, details: 2, confirmed: 3 };

  return (
    <div>
      {/* Progress indicator */}
      {step !== "confirmed" && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {["Date", "Time", "Details"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (i === 0) setStep("date");
                  else if (i === 1 && selectedDate) setStep("time");
                }}
                disabled={i > stepIndex[step]}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-colors ${
                  i <= stepIndex[step]
                    ? "bg-copper text-deep-space"
                    : "bg-starlight/10 text-starlight/40"
                } ${i < stepIndex[step] ? "cursor-pointer hover:bg-copper/80" : ""}`}
              >
                {i + 1}
              </button>
              <span
                className={`text-sm font-display ${
                  i <= stepIndex[step]
                    ? "text-starlight"
                    : "text-starlight/40"
                }`}
              >
                {label}
              </span>
              {i < 2 && (
                <div
                  className={`w-8 h-px ${
                    i < stepIndex[step] ? "bg-copper" : "bg-starlight/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-[var(--radius-sm)] bg-spark-red/10 border border-spark-red/30 text-spark-red text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Date Picker */}
      {step === "date" && (
        <DatePicker
          calendarMonth={calendarMonth}
          setCalendarMonth={setCalendarMonth}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
        />
      )}

      {/* Step 2: Time Slots */}
      {step === "time" && selectedDate && (
        <TimeSlots
          date={selectedDate}
          slots={slots}
          loading={loadingSlots}
          duration={bookingType.durationMinutes}
          onSelect={handleSlotSelect}
          onBack={() => setStep("date")}
        />
      )}

      {/* Step 3: Details Form */}
      {step === "details" && selectedSlot && (
        <DetailsForm
          slot={selectedSlot}
          duration={bookingType.durationMinutes}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          notes={notes}
          setNotes={setNotes}
          submitting={submitting}
          onSubmit={handleSubmit}
          onBack={() => setStep("time")}
        />
      )}

      {/* Step 4: Confirmation */}
      {step === "confirmed" && selectedSlot && (
        <Confirmation
          slot={selectedSlot}
          duration={bookingType.durationMinutes}
          title={bookingType.title}
          name={name}
          email={email}
          bookingId={bookingId}
        />
      )}
    </div>
  );
}

/* ─── Date Picker ─── */

function DatePicker({
  calendarMonth,
  setCalendarMonth,
  selectedDate,
  onSelect,
}: {
  calendarMonth: { year: number; month: number };
  setCalendarMonth: (m: { year: number; month: number }) => void;
  selectedDate: string | null;
  onSelect: (date: string) => void;
}) {
  const { year, month } = calendarMonth;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = firstDay.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    const prev = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
    // Don't go before current month
    const now = new Date();
    if (prev.year > now.getFullYear() || (prev.year === now.getFullYear() && prev.month >= now.getMonth())) {
      setCalendarMonth(prev);
    }
  }

  function nextMonth() {
    const next = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
    const maxMonth = new Date(maxDate);
    if (next.year < maxMonth.getFullYear() || (next.year === maxMonth.getFullYear() && next.month <= maxMonth.getMonth())) {
      setCalendarMonth(next);
    }
  }

  const days: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  function isAvailable(day: number): boolean {
    const date = new Date(year, month, day);
    if (date < today) return false;
    if (date > maxDate) return false;
    // Only Mon-Fri
    const dow = date.getDay();
    return dow >= 1 && dow <= 5;
  }

  function toDateStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="bg-navy/60 rounded-[var(--radius-lg)] border border-starlight/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center text-starlight/60 hover:text-copper hover:bg-starlight/5 transition-colors"
          aria-label="Previous month"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h3 className="text-starlight font-display text-lg">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full flex items-center justify-center text-starlight/60 hover:text-copper hover:bg-starlight/5 transition-colors"
          aria-label="Next month"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-display text-starlight/40 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = toDateStr(day);
          const available = isAvailable(day);
          const isSelected = dateStr === selectedDate;
          const isToday = new Date(year, month, day).getTime() === today.getTime();

          return (
            <button
              key={day}
              onClick={() => available && onSelect(dateStr)}
              disabled={!available}
              className={`
                relative h-10 rounded-[var(--radius-sm)] text-sm font-display font-medium
                transition-all duration-[var(--duration-fast)]
                ${available
                  ? isSelected
                    ? "bg-copper text-deep-space"
                    : "text-starlight hover:bg-copper/15 hover:text-copper"
                  : "text-starlight/20 cursor-not-allowed"
                }
              `}
            >
              {day}
              {isToday && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-copper" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Time Slots ─── */

function TimeSlots({
  date,
  slots,
  loading,
  duration,
  onSelect,
  onBack,
}: {
  date: string;
  slots: Slot[];
  loading: boolean;
  duration: number;
  onSelect: (slot: Slot) => void;
  onBack: () => void;
}) {
  const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="bg-navy/60 rounded-[var(--radius-lg)] border border-starlight/10 p-6">
      <button
        onClick={onBack}
        className="text-copper text-sm font-display flex items-center gap-1 mb-4 hover:text-copper/80 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Change date
      </button>

      <h3 className="text-starlight font-display text-lg mb-1">{dateLabel}</h3>
      <p className="text-starlight/50 text-sm mb-5">{duration}-minute slots</p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-copper/30 border-t-copper rounded-full animate-spin" />
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-starlight/50">No available times on this day.</p>
          <button
            onClick={onBack}
            className="text-copper text-sm font-display mt-2 hover:text-copper/80 transition-colors"
          >
            Try another date
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.start}
              onClick={() => onSelect(slot)}
              className="px-3 py-2.5 rounded-[var(--radius-sm)] border border-starlight/10
                text-sm font-display text-starlight
                hover:border-copper hover:text-copper hover:bg-copper/5
                transition-all duration-[var(--duration-fast)]"
            >
              {formatTime(slot.start)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Details Form ─── */

function DetailsForm({
  slot,
  duration,
  name,
  setName,
  email,
  setEmail,
  notes,
  setNotes,
  submitting,
  onSubmit,
  onBack,
}: {
  slot: Slot;
  duration: number;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  const dateLabel = new Date(slot.start).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeLabel = `${formatTime(slot.start)} – ${formatTime(slot.end)}`;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const inputStyles =
    "w-full bg-deep-space/60 border border-starlight/15 rounded-[var(--radius-sm)] px-4 py-3 text-starlight text-sm font-body placeholder:text-starlight/30 focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper/50 transition-colors";

  return (
    <div className="bg-navy/60 rounded-[var(--radius-lg)] border border-starlight/10 p-6">
      <button
        onClick={onBack}
        className="text-copper text-sm font-display flex items-center gap-1 mb-4 hover:text-copper/80 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Change time
      </button>

      {/* Selected slot summary */}
      <div className="bg-copper/5 border border-copper/20 rounded-[var(--radius-sm)] p-4 mb-6">
        <p className="text-copper font-display font-semibold text-sm">{dateLabel}</p>
        <p className="text-starlight/70 text-sm">{timeLabel} ({duration} min)</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="booking-name" className="block text-sm font-display text-starlight/70 mb-1.5">
            Your name
          </label>
          <input
            id="booking-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="booking-email" className="block text-sm font-display text-starlight/70 mb-1.5">
            Email address
          </label>
          <input
            id="booking-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="booking-notes" className="block text-sm font-display text-starlight/70 mb-1.5">
            Anything we should know? <span className="text-starlight/30">(optional)</span>
          </label>
          <textarea
            id="booking-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tell us briefly about your business and what you'd like to discuss..."
            className={inputStyles + " resize-none"}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !name || !email}
          className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3
            font-display font-semibold text-base text-white
            bg-spark-red hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Confirm Booking"
          )}
        </button>
      </form>
    </div>
  );
}

/* ─── Confirmation ─── */

function Confirmation({
  slot,
  duration,
  title,
  name,
  email,
  bookingId,
}: {
  slot: Slot;
  duration: number;
  title: string;
  name: string;
  email: string;
  bookingId: number | null;
}) {
  const dateLabel = new Date(slot.start).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeLabel = `${formatTime(slot.start)} – ${formatTime(slot.end)}`;

  function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="bg-navy/60 rounded-[var(--radius-lg)] border border-copper/20 p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-copper/10 flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13L9 17L19 7" stroke="#d4a574" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h2 className="text-copper font-display text-xl mb-2">You&apos;re booked!</h2>
      <p className="text-starlight/70 text-sm mb-6">
        A calendar invite has been sent to <span className="text-starlight">{email}</span>
      </p>

      <div className="bg-deep-space/60 rounded-[var(--radius-sm)] p-5 text-left space-y-3 mb-6">
        <div>
          <p className="text-starlight/40 text-xs font-display uppercase tracking-wider">Session</p>
          <p className="text-starlight font-display font-semibold">{title}</p>
        </div>
        <div>
          <p className="text-starlight/40 text-xs font-display uppercase tracking-wider">Date & Time</p>
          <p className="text-starlight">{dateLabel}</p>
          <p className="text-starlight/70 text-sm">{timeLabel} ({duration} min)</p>
        </div>
        <div>
          <p className="text-starlight/40 text-xs font-display uppercase tracking-wider">Name</p>
          <p className="text-starlight">{name}</p>
        </div>
        {bookingId && (
          <div>
            <p className="text-starlight/40 text-xs font-display uppercase tracking-wider">Booking ID</p>
            <p className="text-starlight/50 text-sm">#{bookingId}</p>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3
          font-display font-semibold text-sm text-copper border-2 border-copper
          hover:bg-copper/10 transition-all duration-[var(--duration-base)]"
      >
        Back to Home
      </Link>
    </div>
  );
}
