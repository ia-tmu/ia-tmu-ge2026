"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/Modal";
import { generateQRCodeImage } from "../../lib/qr-code";
import { createShareUrl } from "../../lib/bookmark";
import type { Work } from "../../types/work";
import { BookmarkedWorksList } from "./BookmarkedWorksList";
import { EmptyBookmarksGuideContent } from "./BookmarkedWorksSection";

const STORAGE_KEY = "bookmarkedWorks";

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
  const [copied, setCopied] = useState(false); // 追加

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

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000); // 2秒後に元に戻す
  };

  return (
    <Modal open={open} onClose={onClose} title="お気に入り作品をシェア" size="extra-large">
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
            <EmptyBookmarksGuideContent />
          )}

          {shareUrl && (
            <>
              <button
                onClick={handleCopy}
                className="text-sm border border-foreground px-3 py-2 cursor-pointer bg-foreground/10 hover:bg-dark-blue-primary/10 hover:text-foreground transition-colors duration-300 w-full max-w-3xs"
              >
                {copied ? "コピーされました！" : "リンクをコピー"}
              </button>
            </>
          )}
          <p className="my-6">
            気になった作品のリストを、他のデバイスやSNSに共有できます。<br />
            会場での鑑賞用や、後で見返す際にご活用ください。
          </p>
        </div>

        <div className="h-px w-full bg-foreground/20" />

        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold">
            お気に入り作品一覧
          </h3>

          <BookmarkedWorksList
            allWorks={allWorks}
            limit={999}
          />
        </div>
      </div>
    </Modal>
  );
}
