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
    <Link
      href={href}
      className="block h-[138px] md:h-[312px] w-full md:w-[200px] shrink-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div
        className={`hidden md:flex h-full w-full flex-col items-start overflow-hidden rounded-sm border border-foreground backdrop-blur-lg ${cardHoverClass}`}
      >
        <div className="relative h-[150px] w-full shrink-0 overflow-hidden bg-muted">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={work.workTitle}
              fill
              className="object-cover object-center"
              sizes="200px"
            />
          ) : null}
        </div>

        <div className="relative flex flex-col items-start py-2 px-1 justify-between h-full">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-sm w-full line-clamp-4 font-semibold">{work.workTitle}</h3>
          </div>

          <div className="flex flex-col gap-1 mt-auto">
            {work.keywords?.map((keyword) => (
              <div key={`${work.id}-${keyword}`} className="text-[10px] w-full line-clamp-4 font-semibold">
                {keyword}
              </div>
            ))}
          </div>

        </div>

      </div>

      <div
        className={`flex md:hidden p-2 h-full gap-2 w -full flex-row items-stretch border border-foreground backdrop-blur-lg overflow-hidden rounded-sm ${cardHoverClass}`}
      >
        <div className="relative w-[160px] h-[120px] shrink-0 p-2 bg-muted">
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
          <h3 className="text-sm w-full line-clamp-3 font-semibold">{work.workTitle}</h3>
          <div className="flex flex-col gap-1">
            {work.keywords?.map((keyword) => (
              <div key={`${work.id}-${keyword}`} className="text-[10px] w-full line-clamp-4 font-semibold">
                {keyword}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}