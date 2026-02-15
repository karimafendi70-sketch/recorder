"use client";

import { useCallback, useState } from "react";
import { useLanguage, type TranslationKey } from "@/app/LanguageProvider";

interface SharePanelProps {
  link: string;
  text: string;
  className?: string;
}

export function SharePanel({ link, text, className }: SharePanelProps) {
  const { t } = useLanguage();
  const [copiedField, setCopiedField] = useState<"link" | "text" | null>(null);

  const copy = useCallback(async (value: string, field: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* fallback: select + execCommand */
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, []);

  return (
    <div className={className}>
      <button onClick={() => copy(link, "link")}>
        {copiedField === "link"
          ? `✅ ${t("share.copied" as TranslationKey)}`
          : `🔗 ${t("share.copyLink" as TranslationKey)}`}
      </button>
      <button onClick={() => copy(text, "text")}>
        {copiedField === "text"
          ? `✅ ${t("share.copied" as TranslationKey)}`
          : `📋 ${t("share.copyText" as TranslationKey)}`}
      </button>
    </div>
  );
}
