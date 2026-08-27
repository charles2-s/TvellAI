"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ShareModalProps {
  url: string;
  onClose: () => void;
}

export function ShareModal({ url, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("share-qr-code") as unknown as SVGSVGElement;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const urlObject = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = urlObject;
    link.download = "trip-qr-code.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(urlObject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-card-hover border border-charcoal-100 p-6 sm:p-8 max-w-sm w-full animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-charcoal-900">Share Trip</h2>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-500 hover:text-charcoal-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-charcoal-500 mb-4">
          Share this link with travelers so they can view your trip itinerary.
        </p>

        <div className="flex items-center gap-2 p-3 bg-cream-50 border border-charcoal-200 rounded-xl mb-6">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-sm text-charcoal-700 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-forest-700 text-white rounded-lg text-xs font-semibold hover:bg-forest-800 transition-colors whitespace-nowrap"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="p-4 bg-white border border-charcoal-200 rounded-2xl mb-4">
            <QRCodeSVG
              id="share-qr-code"
              value={url}
              size={180}
              level="M"
              includeMargin={true}
            />
          </div>
          <button
            onClick={handleDownloadQR}
            className="text-sm text-forest-700 hover:text-forest-800 font-semibold transition-colors"
          >
            Download QR code
          </button>
        </div>
      </div>
    </div>
  );
}
