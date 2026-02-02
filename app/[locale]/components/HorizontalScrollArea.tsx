"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

const DEFAULT_SCROLL_OFFSET = 280;

export type HorizontalScrollAreaProps = {
  children: React.ReactNode;
  /** ボタン押下時のスクロール量（px） */
  scrollOffset?: number;
  /** ラッパーに渡す追加の className */
  className?: string;
  /** スクロールコンテナに渡す追加の className */
  scrollClassName?: string;
  /** 中身が変わったときにスクロール状態を再計算するためのキー（例: 一覧の長さやID） */
  contentKey?: string | number;
};

/**
 * 横スクロール＋左右ボタン＋端フェードのエリア。
 * 作品一覧・関連作品などで再利用可能。
 */
export function HorizontalScrollArea({
  children,
  scrollOffset = DEFAULT_SCROLL_OFFSET,
  className = "",
  scrollClassName = "",
  contentKey,
}: HorizontalScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState, contentKey]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -scrollOffset : scrollOffset,
      behavior: "smooth",
    });
  };

  const scrollMaskClass =
    canScrollLeft && canScrollRight
      ? "scroll-mask-both"
      : !canScrollLeft && canScrollRight
        ? "scroll-mask-right-only"
        : canScrollLeft && !canScrollRight
          ? "scroll-mask-left-only"
          : "";

  return (
    <div className={`relative w-full min-w-0 ${className}`.trim()}>
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-0 bottom-0 z-10 w-10 items-center justify-center text-foreground cursor-pointer"
          aria-label="左にスクロール"
        >
          <ChevronLeftIcon width={24} height={24} className="w-6 h-6" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={`flex flex-col gap-2 md:flex-row md:overflow-x-auto md:scroll-smooth pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 ${scrollMaskClass} ${scrollClassName}`.trim()}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="cursor-pointer hidden md:flex absolute right-0 top-0 bottom-0 z-10 w-10 items-center justify-center text-foreground"
          aria-label="右にスクロール"
        >
          <ChevronRightIcon width={24} height={24} className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
