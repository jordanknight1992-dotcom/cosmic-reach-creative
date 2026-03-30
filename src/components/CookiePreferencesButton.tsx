"use client";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
      className="hover:text-copper transition-colors"
    >
      Cookie Preferences
    </button>
  );
}
