"use client";

import { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-white px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50"
    >
      {copied ? (
        <>
          <CheckCircle2 size={14} />
          Copied
        </>
      ) : (
        <>
          <Copy size={14} />
          Copy
        </>
      )}
    </button>
  );
}
