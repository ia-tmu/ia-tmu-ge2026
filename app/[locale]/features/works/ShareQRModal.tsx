"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Modal } from "../../components/Modal";
import { generateQRCodeImage } from "../../lib/qr-code";
import { createShareUrl } from "../../lib/bookmark";
import { generateBookmarkImage } from "../../lib/generate-bookmark-image";
import type { Work } from "../../types/work";
import { EmptyBookmarksGuideContent } from "./BookmarkedWorksSection";

const STORAGE_KEY = "bookmarkedWorks";

type ShareQRModalProps = {
  open: boolean;
  onClose: () => void;
  allWorks: Work[];
};

export function ShareQRModal({ open, onClose, allWorks }: ShareQRModalProps) {
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ── 画像生成ステート ──────────────────────────────────
  const [imgStatus, setImgStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [imgProgress, setImgProgress] = useState("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const shareUrl = createShareUrl();

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
    setTimeout(() => setCopied(false), 1000);
  };

  // ── ブックマーク済み作品を取得 ────────────────────────
  const bookmarkedWorks = useMemo(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      return ids
        .map((id) => allWorks.find((w) => w.id === id))
        .filter((w): w is Work => w !== undefined);
    } catch {
      return [];
    }
  }, [allWorks, open]); // open が変わるたびに再計算

  // ── 画像生成 ──────────────────────────────────────────
  const handleGenerateImage = useCallback(async () => {
    if (bookmarkedWorks.length === 0) return;
    setImgStatus("loading");
    setImgSrc(null);
    try {
      const dataUrl = await generateBookmarkImage(bookmarkedWorks, setImgProgress);
      setImgSrc(dataUrl);
      setImgStatus("done");
    } catch (e) {
      console.error(e);
      setImgStatus("error");
    }
  }, [bookmarkedWorks]);

  // モーダルが開いたら自動生成、閉じたらリセット
  useEffect(() => {
    if (open) {
      handleGenerateImage();
    } else {
      setImgStatus("idle");
      setImgSrc(null);
      setImgProgress("");
    }
  }, [open, handleGenerateImage]);

  // ── ダウンロード ──────────────────────────────────────
  const handleDownload = useCallback(() => {
    if (!imgSrc) return;
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = `industrial-art-ge2026_favorites.png`;
    a.click();
  }, [imgSrc]);

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
            <button
              onClick={handleCopy}
              className="text-sm border border-foreground px-3 py-2 cursor-pointer bg-foreground/10 hover:bg-dark-blue-primary/10 hover:text-foreground transition-colors duration-300 w-full max-w-3xs"
            >
              {copied ? "コピーされました！" : "リンクをコピー"}
            </button>
          )}
          <p className="my-6">
            気になった作品のリストを、他のデバイスやSNSに共有できます。<br />
            会場での鑑賞用や、後で見返す際にご活用ください。<br />
            会場は電波が入りにくいため画像での保存を推奨しています。
          </p>
        </div>

        <div className="h-px w-full bg-foreground/20" />

        {/* ── お気に入り一覧画像セクション ─────────────── */}
        {imgStatus === "done" && imgSrc && (
          <div className="flex flex-col gap-3">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-base font-semibold">リストを画像で保存</h3>
              <button
                onClick={handleDownload}
                className="text-sm border border-foreground px-3 py-2 cursor-pointer bg-foreground/10 hover:bg-dark-blue-primary/10 hover:text-foreground transition-colors duration-300"
              >
                ダウンロード
              </button>
            </div>
            {imgStatus === "done" && imgSrc && (
              <div className="mt-2">
                <img
                  src={imgSrc}
                  alt="お気に入り一覧プレビュー"
                  className="w-full max-w-xs rounded-lg border border-foreground/20 mx-auto block"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
