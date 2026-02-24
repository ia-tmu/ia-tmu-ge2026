"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { localePath } from "../lib/localePath";

export type WorkThumbnailItem = {
  id: string;
  thumbnail: string;
  workTitle: string;
};

const THUMB_WIDTH = 160;
const THUMB_HEIGHT = 120;

type Props = {
  items: WorkThumbnailItem[];
  direction: "left" | "right";
};

export function ScrollingThumbnailsRow({ items, direction }: Props) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "ja";

  if (items.length === 0) return null;

  const trackClass =
    direction === "left"
      ? "scroll-row-track scroll-row-track-left"
      : "scroll-row-track scroll-row-track-right";

  return (
    <div
      className="w-full overflow-hidden py-2"
      aria-label={
        direction === "left"
          ? "作品サムネイルを左に流す一覧"
          : "作品サムネイルを右に流す一覧"
      }
    >
      <div className={`flex gap-4 ${trackClass}`} style={{ width: "max-content" }}>
        {[items, items].flat().map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            href={localePath(locale, `/works/${item.id}`)}
            className="shrink-0 block overflow-hidden border border-foreground/30 hover:border-foreground hover:opacity-90 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${item.workTitle}の作品ページへ`}
          >
            <span className="block relative w-[200px] h-[150px] bg-muted">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.workTitle}
                  width={THUMB_WIDTH}
                  height={THUMB_HEIGHT}
                  className="object-cover object-center w-full h-full"
                  sizes="160px"
                  unoptimized
                />
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
