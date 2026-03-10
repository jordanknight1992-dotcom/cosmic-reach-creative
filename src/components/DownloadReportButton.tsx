"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import {
  ClarityReportDocument,
  registerFonts,
} from "@/components/ClarityReportPDF";

export function DownloadReportButton() {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const origin = window.location.origin;
      registerFonts(origin);

      const blob = await pdf(
        <ClarityReportDocument origin={origin} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Business-Clarity-Report-AtlasOps.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="print:hidden inline-flex items-center gap-2 rounded-[var(--radius-md)] border-2 border-starlight text-starlight bg-transparent px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:bg-starlight/10 disabled:opacity-60 disabled:cursor-wait"
      aria-label="Download report as PDF"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {generating ? "Generating PDF\u2026" : "Download PDF"}
    </button>
  );
}
