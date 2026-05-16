"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** `public/images/report/gallery` 配下のファイル名（ファイル名昇順）。画像を増やしたらここにも追加してください。 */
const GALLERY_IMAGE_FILENAMES = [
  "DSC00150.jpg",
  "DSC00154.jpg",
  "DSC00155.jpg",
  "DSC00156.jpg",
  "DSC00157.jpg",
  "DSC00158.jpg",
  "DSC00178.jpg",
  "DSC09693.jpg",
  "DSC09694.jpg",
  "DSC09695.jpg",
  "DSC09696.jpg",
  "DSC09697.jpg",
  "DSC09698.jpg",
  "DSC09699.jpg",
  "DSC09700.jpg",
  "DSC09701.jpg",
  "DSC09702.jpg",
  "DSC09704.jpg",
  "DSC09707.jpg",
  "DSC09709.jpg",
  "DSC09719.jpg",
  "DSC09722.jpg",
  "DSC09725.jpg",
  "DSC09727.jpg",
  "DSC09734.jpg",
  "DSC09735.jpg",
  "DSC09736.jpg",
  "DSC09754.jpg",
  "DSC09755.jpg",
  "DSC09756.jpg",
  "DSC09757.jpg",
  "DSC09758.jpg",
  "DSC09759.jpg",
  "DSC09775.jpg",
  "DSC09779.jpg",
  "DSC09780.jpg",
  "DSC09781.jpg",
  "DSC09782.jpg",
  "DSC09784.jpg",
  "DSC09787.jpg",
] as const;

function galleryImageSrc(filename: string) {
  return `${basePath}/images/report/gallery/${filename}`;
}

/** Fisher–Yates。呼び出しのたびに新しい配列を返す。 */
function shuffleFilenames(filenames: readonly string[]): string[] {
  const out = [...filenames];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = out[i]!;
    out[i] = out[j]!;
    out[j] = t;
  }
  return out;
}

type AutoScrollRowProps = {
  filenames: readonly string[];
  direction: "left" | "right";
};

function AutoScrollRow({ filenames, direction }: AutoScrollRowProps) {
  const trackClass =
    direction === "left"
      ? "scroll-row-track scroll-row-track-left"
      : "scroll-row-track scroll-row-track-right";

  const loopItems = [...filenames, ...filenames];

  return (
    <div className="w-full overflow-hidden py-2">
      <div className={`flex gap-3 md:gap-4 ${trackClass}`} style={{ width: "max-content" }}>
        {loopItems.map((filename, index) => (
          <div
            key={`${filename}-${index}`}
            className="relative shrink-0 w-[200px] md:w-[240px] lg:w-[260px] aspect-4/3 overflow-hidden border border-foreground/30 bg-foreground/5"
          >
            <Image
              src={galleryImageSrc(filename)}
              alt={`会場の様子（${filename.replace(/\.jpg$/i, "")}）`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 260px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** px 付きラッパー内に置く（見出し・リード文） */
export function ReportExhibitionScenesIntro() {
  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col">
        <h2 className="text-3xl md:text-4xl font-semibold">Exhibition Scenes</h2>
        <p className="text-xs md:text-sm leading-7 md:leading-8 whitespace-pre-line drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]">
          会場風景や作品写真を通して、展覧会の様子をご紹介します。展示空間の広がりや、作品と鑑賞者の関わりをご覧ください。
        </p>
      </div>
    </section>
  );
}

/**
 * main 直下（水平 padding の外）に置く。ビューポート全幅の帯になる。
 * ギャラリー画像を2段の自動横スクロールで表示する。
 * 表示順はマウントごとにランダム（SSR と一致させるため初回描画後にシャッフル）。
 */
export function ReportExhibitionScenesGalleries() {
  const [ordered, setOrdered] = useState<string[]>(() => [...GALLERY_IMAGE_FILENAMES]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOrdered(shuffleFilenames(GALLERY_IMAGE_FILENAMES));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const midpoint = Math.ceil(ordered.length / 2);
  const row1 = ordered.slice(0, midpoint);
  const row2 = ordered.slice(midpoint);

  return (
    <div className="flex flex-col gap-4 md:gap-5 -mt-12">
      <div className="w-full min-w-0 overflow-x-hidden shrink-0">
        <AutoScrollRow filenames={row1} direction="right" />
      </div>
      <div className="w-full min-w-0 overflow-x-hidden shrink-0">
        <AutoScrollRow filenames={row2} direction="left" />
      </div>
    </div>
  );
}
