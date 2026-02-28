"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/Modal";
import { generateQRCodeImage } from "../../lib/qr-code";
import { createShareUrl } from "../../lib/bookmark";
import type { Work } from "../../types/work";
import { BookmarkedWorksList } from "./BookmarkedWorksList";

const STORAGE_KEY = "bookmarkedWorks";

function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

type ShareQRModalProps = {
  open: boolean;
  onClose: () => void;
  allWorks: Work[];
};

export function ShareQRModal({
  open,
  onClose,
  allWorks,
}: ShareQRModalProps) {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  const shareUrl = createShareUrl("/share");

  useEffect(() => {
    if (!open || !shareUrl) {
      setQrSrc(null);
      return;
    }

    generateQRCodeImage(shareUrl, {
      size: 320,
      errorCorrectionLevel: "Q",
      margin: 2,
    }).then(setQrSrc);
  }, [open, shareUrl]);

  return (
    <Modal open={open} onClose={onClose} title="Share Bookmarks" size="large">
      <div className="flex flex-col gap-6">
        {/* QRセクション */}
        <div className="flex flex-col items-center gap-3">
          {qrSrc ? (
            <img
              src={qrSrc}
              alt="Share QR Code"
              className="w-64 h-64 rounded-xl border border-foreground/20"
            />
          ) : (
            <div className="w-64 h-64 rounded-xl border border-foreground/20 flex items-center justify-center text-sm opacity-60">
              No bookmarks
            </div>
          )}

          {shareUrl && (
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="text-xs underline opacity-70 hover:opacity-100"
            >
              URLをコピー
            </button>
          )}
        </div>

        <div className="h-px w-full bg-foreground/20" />

        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold">
            Bookmarked Works
          </h3>

          <BookmarkedWorksList
            allWorks={allWorks}
            limit={999} // モーダルでは全部見せたいなら大きめ
          />
        </div>
      </div>
    </Modal>
  );
}
