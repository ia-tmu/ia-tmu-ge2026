"use client";

import { useState } from "react";
import { createShareUrl } from "../../lib/bookmark";

export function ShareBookmarksButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = createShareUrl("/share");

    if (!url) {
      alert("ブックマークがありません");
      return;
    }

    const absoluteUrl = `${window.location.origin}${url}`;

    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("このURLをコピーしてください", absoluteUrl);
    }
  };


  return (
    <button
      onClick={handleCopy}
      className="fixed bottom-6 right-6 z-100 text-sm border border-foreground px-3 py-2 cursor-pointer"
    >
      {copied ? "Copied!" : "★ お気に入りを共有する"}
    </button>
  );
}
