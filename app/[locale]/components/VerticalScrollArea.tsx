"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "./Icons";

const DEFAULT_SCROLL_OFFSET = 140;

export type VerticalScrollAreaProps = {
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
 * 縦スクロール＋上下ボタン＋端フェードのエリア。
 */
export function VerticalScrollArea({
  children,
  scrollOffset = DEFAULT_SCROLL_OFFSET,
  className = "",
  scrollClassName = "",
  contentKey,
}: VerticalScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 0);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState, contentKey]);

  const scroll = (direction: "up" | "down") => {
    scrollRef.current?.scrollBy({
      top: direction === "up" ? -scrollOffset : scrollOffset,
      behavior: "smooth",
    });
  };

  const scrollMaskClass =
    canScrollUp && canScrollDown
      ? "scroll-mask-vertical-both"
      : !canScrollUp && canScrollDown
        ? "scroll-mask-vertical-bottom-only"
        : canScrollUp && !canScrollDown
          ? "scroll-mask-vertical-top-only"
          : "";

  return (
    <div className={`relative h-full min-h-0 w-full flex flex-col md:flex-row ${className}`.trim()}>
      {canScrollUp && (
        <button
          type="button"
          onClick={() => scroll("up")}
          className="hidden md:flex absolute left-0 right-0 top-0 z-10 h-10 shrink-0 items-center justify-center text-foreground cursor-pointer"
          aria-label="上にスクロール"
        >
          <ChevronUpIcon width={24} height={24} className="w-6 h-6" />
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={`flex min-h-0 flex-1 flex-row justify-start flex-wrap gap-2 overflow-y-auto scroll-smooth py-2 md:py-0 ${scrollMaskClass} ${scrollClassName}`.trim()}
      >
        {children}
      </div>
      {canScrollDown && (
        <button
          type="button"
          onClick={() => scroll("down")}
          className="cursor-pointer hidden md:flex absolute left-0 right-0 bottom-0 z-10 h-10 shrink-0 items-center justify-center text-foreground"
          aria-label="下にスクロール"
        >
          <ChevronDownIcon width={24} height={24} className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
