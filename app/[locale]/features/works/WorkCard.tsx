"use client";

import type { Work } from "../../types/work";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { localePath } from "../../lib/localePath";

const cardHoverClass = "transition-colors duration-200 hover:bg-white/10";

export function WorkCard({ work }: { work: Work }) {
  const params = useParams();
  const locale = (params?.locale as string) ?? "ja";
  const href = localePath(locale, `/works/${work.id}`);
  const imageSrc = (work.thumbnail?.trim() || work.images?.[0]?.trim()) || null;

  return (
    <Link href={href} className="block h-full max-h-[240px] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
      <div
        className={`hidden md:flex p-4 h-full max-h-[240px] max-w-[192px] min-w-[192px] w-[192px] flex-col items-start gap-2 border border-foreground backdrop-blur-lg rounded-sm ${cardHoverClass}`}
      >
        <div className="relative w-full h-full max-h-[120px] max-w-[160px] overflow-hidden bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={work.workTitle}
              className="object-cover object-center"
              width={160}
              height={120}
              style={{ width: "auto", height: "auto" }}
            />
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-sm w-full line-clamp-4 font-semibold">{work.workTitle}</h3>
        </div>
      </div>

      <div
        className={`flex md:hidden h-full max-h-[240px] w-full flex-row items-stretch gap-3 border border-foreground backdrop-blur-lg overflow-hidden p-2 rounded-sm ${cardHoverClass}`}
      >
        <div className="relative w-[120px] h-[120px] shrink-0 p-2 bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={work.workTitle}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 50vw, 120px"
            />
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
          <h3 className="text-sm w-full line-clamp-4 font-semibold">{work.workTitle}</h3>
          <div className="flex flex-col gap-1">
            {work.keywords?.map((keyword) => (
              <div key={`${work.id}-${keyword}`} className="text-xs w-full line-clamp-4 font-semibold">
                {keyword}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}