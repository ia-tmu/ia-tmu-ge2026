"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowIcon } from "../../components/Icons";

type Props = {
  thumbnail?: string;
  images?: string[];
  name: string;
};

const SWIPE_THRESHOLD = 50; // スワイプとみなす最小距離

export default function ImageSlider({ thumbnail, images = [], name }: Props) {
  const allImages = [thumbnail, ...images].filter(Boolean) as string[];

  const [current, setCurrent] = useState(0);

  // スワイプ用
  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(allImages.length - 1, c + 1));

  const onPointerDown = (e: React.PointerEvent) => {
    // 左クリック/タッチのみ（右クリック等を除外）
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDraggingRef.current = true;
    startXRef.current = e.clientX;

    // 途中で要素外に出ても追跡できるように
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || startXRef.current == null) return;

    const dx = e.clientX - startXRef.current;

    isDraggingRef.current = false;
    startXRef.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (dx < 0) {
      // 左にスワイプ → 次
      goNext();
    } else {
      // 右にスワイプ → 前
      goPrev();
    }
  };

  const onPointerCancel = () => {
    isDraggingRef.current = false;
    startXRef.current = null;
  };

  if (allImages.length === 0) return null;

  const THUMB_COUNT = 5;

  // サムネ開始位置を計算
  const start = Math.max(
    0,
    Math.min(
      current - Math.floor(THUMB_COUNT / 2),
      allImages.length - THUMB_COUNT,
    ),
  );

  const thumbImages = allImages.slice(start, start + THUMB_COUNT);

  return (
    <div className="w-full max-w-md md:max-w-lg flex flex-col gap-2.5">
      {/* メイン */}
      <div className="relative flex justify-center items-center">
        <div
          className="select-none touch-pan-y"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <Image
            src={allImages[current]}
            width={600}
            height={450}
            alt={`${name}-${current}`}
            className="object-cover"
            draggable={false}
          />
        </div>

        {current > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/0 hover:bg-black/20 transition-colors duration-300"
          >
            <ArrowIcon width={19} height={15} />
          </button>
        )}
        {current < allImages.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/0 hover:bg-black/20 transition-colors duration-300"
          >
            <ArrowIcon width={19} height={15} className="-scale-x-100" />
          </button>
        )}
      </div>

      {/* サムネ */}
      <div className="flex justify-center gap-2">
        {thumbImages.map((img, i) => {
          const index = start + i; // 元のindexに戻す

          return (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`outline-2 outline-offset-1 ${
                index === current ? "outline-white" : "outline-transparent"
              }`}
            >
              <Image
                src={img}
                width={52}
                height={39}
                alt={`${name}-thumb-${index}`}
                className="object-cover"
                draggable={false}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
