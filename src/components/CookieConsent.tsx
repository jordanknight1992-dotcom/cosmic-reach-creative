"use client";

import { useState, useEffect, useCallback } from "react";
import { siteConfig } from "@/config/site";

const CONSENT_COOKIE = "crc_analytics_consent";
const GA_ID = siteConfig.ga4MeasurementId;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

function loadGA4() {
  // Prevent duplicate initialization
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
    return;
  }

  // Update consent to granted
  window.gtag("consent", "update", { analytics_storage: "granted" });

  // Load the gtag.js script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Configure GA4
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const consent = getCookie(CONSENT_COOKIE);
    if (consent === "accepted") {
      loadGA4();
    } else {
      setShowBanner(true);
    }
  }, []);

  // Listen for the custom event from footer button
  useEffect(() => {
    function handleOpenPreferences() {
      setShowModal(true);
      setShowBanner(false);
      setAnalyticsEnabled(getCookie(CONSENT_COOKIE) === "accepted");
    }
    window.addEventListener("open-cookie-preferences", handleOpenPreferences);
    return () => window.removeEventListener("open-cookie-preferences", handleOpenPreferences);
  }, []);

  const handleAccept = useCallback(() => {
    setCookie(CONSENT_COOKIE, "accepted", 365);
    setShowBanner(false);
    setShowModal(false);
    loadGA4();
  }, []);

  const handleDecline = useCallback(() => {
    // No persistent cookie — visitor will be prompted again next visit
    deleteCookie(CONSENT_COOKIE);
    setShowBanner(false);
    setShowModal(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    if (analyticsEnabled) {
      handleAccept();
    } else {
      handleDecline();
    }
  }, [analyticsEnabled, handleAccept, handleDecline]);

  const handleOpenManage = useCallback(() => {
    setAnalyticsEnabled(getCookie(CONSENT_COOKIE) === "accepted");
    setShowModal(true);
    setShowBanner(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [showModal]);

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showModal && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-[60] border-t border-starlight/10 bg-navy/95 backdrop-blur-md"
          style={{ animation: "cookieBannerIn 0.35s var(--ease-out) both" }}
        >
          <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-sm text-starlight/70 flex-1">
                Cosmic Reach uses cookies to improve site performance and understand
                traffic. You can accept, decline, or manage your preferences.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDecline}
                  className="rounded-[var(--radius-md)] border border-starlight/15 px-4 py-2 text-sm font-display font-medium text-starlight/70 transition-colors duration-[var(--duration-fast)] hover:border-starlight/30 hover:text-starlight focus-visible:outline-[var(--focus-width)] focus-visible:outline-[var(--focus-color)] focus-visible:outline-offset-[var(--focus-offset)]"
                >
                  Decline
                </button>
                <button
                  onClick={handleOpenManage}
                  className="rounded-[var(--radius-md)] border border-starlight/15 px-4 py-2 text-sm font-display font-medium text-starlight/70 transition-colors duration-[var(--duration-fast)] hover:border-copper/40 hover:text-copper focus-visible:outline-[var(--focus-width)] focus-visible:outline-[var(--focus-color)] focus-visible:outline-offset-[var(--focus-offset)]"
                >
                  Manage Preferences
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-[var(--radius-md)] bg-copper px-4 py-2 text-sm font-display font-semibold text-deep-space transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 focus-visible:outline-[var(--focus-width)] focus-visible:outline-[var(--focus-color)] focus-visible:outline-offset-[var(--focus-offset)]"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-deep-space/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
            style={{ animation: "cookieBackdropIn 0.25s ease both" }}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-starlight/10 bg-navy shadow-soft"
            style={{ animation: "cookieModalIn 0.3s var(--ease-out) both" }}
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-lg font-display font-semibold mb-2">
                Cookie Preferences
              </h2>
              <p className="text-sm text-starlight/60 mb-6">
                Essential cookies keep the site functioning properly. Analytics
                cookies help us understand traffic and improve the experience.
              </p>

              <div className="space-y-4">
                {/* Essential */}
                <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-starlight/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-display font-medium">
                      Essential Cookies
                    </p>
                    <p className="text-xs text-starlight/50 mt-0.5">
                      Required for the site to function
                    </p>
                  </div>
                  <span className="text-xs text-starlight/40 font-display">
                    Always on
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-starlight/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-display font-medium">
                      Analytics Cookies
                    </p>
                    <p className="text-xs text-starlight/50 mt-0.5">
                      Help us understand traffic patterns
                    </p>
                  </div>
                  <button
                    role="switch"
                    aria-checked={analyticsEnabled}
                    aria-label="Toggle analytics cookies"
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-[var(--duration-fast)] focus-visible:outline-[var(--focus-width)] focus-visible:outline-[var(--focus-color)] focus-visible:outline-offset-[var(--focus-offset)]"
                    style={{
                      backgroundColor: analyticsEnabled
                        ? "var(--color-copper)"
                        : "rgba(232, 223, 207, 0.15)",
                    }}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-[var(--duration-fast)]"
                      style={{
                        transform: analyticsEnabled
                          ? "translateX(20px)"
                          : "translateX(0)",
                      }}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-[var(--radius-md)] border border-starlight/15 px-4 py-2.5 text-sm font-display font-medium text-starlight/70 transition-colors duration-[var(--duration-fast)] hover:border-starlight/30 hover:text-starlight"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 rounded-[var(--radius-md)] bg-copper px-4 py-2.5 text-sm font-display font-semibold text-deep-space transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes cookieBannerIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes cookieBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cookieModalIn {
          from { transform: translateY(12px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
