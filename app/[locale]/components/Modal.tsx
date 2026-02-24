"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CrossLargeIcon } from "./Icons";

export type ModalProps = {
  /** 開閉状態 */
  open: boolean;
  /** 閉じるときのコールバック */
  onClose: () => void;
  /** タイトル（省略時は DialogTitle を描画しない） */
  title?: string;
  /** モーダル本体の内容 */
  children: React.ReactNode;
  /** パネルに渡す追加の className */
  className?: string;
  /** 閉じるボタンを表示するか */
  showCloseButton?: boolean;
  /** モーダルのサイズ */
  size?: "small" | "medium" | "large" | "extra-large";
};

/**
 * Headless UI の Dialog を使った基本モーダル。
 * オーバーレイクリック・Esc で onClose が呼ばれ、フォーカス管理とスクロールロックが有効。
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
  showCloseButton = true,
  size = "medium",
}: ModalProps) {
  const handleClose = () => onClose();

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-hidden
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={`flex flex-col w-full max-h-[85vh] overflow-hidden rounded-2xl border border-foreground bg-black/20 backdrop-blur-3xl shadow-lg ${className} ${size === "small"
            ? "max-w-sm"
            : size === "medium"
              ? "max-w-md"
              : size === "large"
                ? "max-w-2xl"
                : size === "extra-large"
                  ? "max-w-4xl"
                  : "max-w-md"
            }`.trim()}
        >
          {(title || showCloseButton) && (
            <div className="sticky top-0 z-10 shrink-0 flex items-start justify-between gap-4 p-6 border-b border-foreground/20">
              {title ? (
                <DialogTitle className="text-lg font-semibold text-foreground">
                  {title}
                </DialogTitle>
              ) : (
                <span />
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="shrink-0 p-1 cursor-pointer rounded text-foreground hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="閉じる"
                >
                  <CrossLargeIcon width={20} height={20} />
                </button>
              )}
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto p-6 text-foreground">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
