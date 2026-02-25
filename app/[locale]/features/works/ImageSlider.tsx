"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowIcon } from "../../components/Icons";

type MovieOrder = "掲載なし" | "サムネイルの次（2番目）" | "最後";

type Props = {
  thumbnail?: string;
  images?: string[];
  movie?: string; // YouTube URL
  movieOrder?: MovieOrder;
  name: string;
};

const SWIPE_THRESHOLD = 50;

type Slide = { type: "image"; src: string } | { type: "youtube"; id: string };

function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname === "youtu.be") return u.pathname.replace("/", "") || null;

    const v = u.searchParams.get("v");
    if (v) return v;

    const embed = u.pathname.match(/\/embed\/([^/]+)/)?.[1];
    if (embed) return embed;

    const shorts = u.pathname.match(/\/shorts\/([^/]+)/)?.[1];
    if (shorts) return shorts;

    return null;
  } catch {
    return null;
  }
}

export default function ImageSlider({
  thumbnail,
  images = [],
  movie,
  movieOrder = "掲載なし",
  name,
}: Props) {
  // 画像スライド作成（thumbnail + images）。空・空白のみのURLは除外
  const baseImages = [thumbnail, ...images]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0) as string[];
  const slides: Slide[] = baseImages.map((src) => ({ type: "image", src }));

  // 動画を挿入（掲載順に応じて）
  const youtubeId = movie ? getYoutubeId(movie) : null;
  if (youtubeId && movieOrder !== "掲載なし") {
    const movieSlide: Slide = { type: "youtube", id: youtubeId };

    if (movieOrder === "サムネイルの次（2番目）") {
      // 2番目（index=1）に挿入。
      const insertIndex = Math.min(1, slides.length);
      slides.splice(insertIndex, 0, movieSlide);
    } else if (movieOrder === "最後") {
      slides.push(movieSlide);
    }
  }

  const [current, setCurrent] = useState(0);
  const [failedImageSrcs, setFailedImageSrcs] = useState<Set<string>>(() => new Set());

  const handleImageError = (src: string) => {
    setFailedImageSrcs((prev) => new Set(prev).add(src));
  };

  // スワイプ用
  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  if (slides.length === 0) return null;

  const goPrev = () => setCurrent((c) => Math.max(0, c - 1));
  const goNext = () => setCurrent((c) => Math.min(slides.length - 1, c + 1));

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || startXRef.current == null) return;

    const dx = e.clientX - startXRef.current;

    isDraggingRef.current = false;
    startXRef.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (dx < 0) goNext();
    else goPrev();
  };

  const onPointerCancel = () => {
    isDraggingRef.current = false;
    startXRef.current = null;
  };

  const THUMB_COUNT = 5;

  const start = Math.max(
    0,
    Math.min(
      current - Math.floor(THUMB_COUNT / 2),
      slides.length - THUMB_COUNT,
    ),
  );

  const thumbSlides = slides.slice(start, start + THUMB_COUNT);

  const currentSlide = slides[current];

  return (
    <div className="w-full max-w-md md:max-w-lg flex flex-col gap-2.5">
      {/* メイン */}
      <div className="relative flex justify-center items-center">
        <div
          className="select-none touch-pan-y w-full"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          {/* 画像/動画を同じ枠で表示（4:3） */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
            {currentSlide.type === "image" ? (
              failedImageSrcs.has(currentSlide.src) ? (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                  画像を読み込めません
                </div>
              ) : (
                <Image
                  src={currentSlide.src}
                  alt={`${name}-${current}`}
                  fill
                  className="object-cover"
                  draggable={false}
                  priority={current === 0}
                  onError={() => handleImageError(currentSlide.src)}
                />
              )
            ) : (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${currentSlide.id}`}
                title={`${name}-movie`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
        </div>

        {current > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/0 hover:bg-black/20 transition-colors duration-300"
          >
            <ArrowIcon
              width={19}
              height={15}
              className="mix-blend-difference"
            />
          </button>
        )}
        {current < slides.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/0 hover:bg-black/20 transition-colors duration-300"
          >
            <ArrowIcon
              width={19}
              height={15}
              className="-scale-x-100 mix-blend-difference"
            />
          </button>
        )}
      </div>

      {/* サムネ */}
      <div className="flex justify-center gap-2">
        {thumbSlides.map((s, i) => {
          const index = start + i;

          const thumbSrc =
            s.type === "image"
              ? s.src
              : `https://img.youtube.com/vi/${s.id}/hqdefault.jpg`;

          return (
            <button
              key={`${s.type}-${index}`}
              onClick={() => setCurrent(index)}
              className={`relative outline-2 outline-offset-2 w-[52px] h-[39px] shrink-0 overflow-hidden bg-muted ${
                index === current ? "outline-white" : "outline-transparent"
              }`}
            >
              {s.type === "image" && failedImageSrcs.has(thumbSrc) ? (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                  —
                </div>
              ) : (
                <Image
                  src={thumbSrc}
                  width={52}
                  height={39}
                  alt={`${name}-thumb-${index}`}
                  className="object-cover"
                  draggable={false}
                  priority={index === 0}
                  onError={s.type === "image" ? () => handleImageError(thumbSrc) : undefined}
                />
              )}

              {s.type === "youtube" && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full bg-black/50 px-2 py-1 text-[10px]">
                    ▶
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
