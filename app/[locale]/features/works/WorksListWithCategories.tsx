"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { VerticalScrollArea } from "../../components/VerticalScrollArea";
import type { Work } from "../../types/work";
import { WorkCard } from "./WorkCard";
import { CrossLargeIcon } from "../../components/Icons";

/** 縮小時の表示高さ（3枚＋4枚目の半分程度） */
const PREVIEW_MAX_HEIGHT_PX = 520;

/** md以上で1行分のアイテムのときの高さ（カード max-h-[240px] + 余白） */
const ONE_ROW_HEIGHT_PX = 280;
/** md以上で複数行のときの最大高さ */
const MULTI_ROW_MAX_HEIGHT_PX = 400;
/** 1行に収まる件数の目安（カード幅192px+gap で約5枚/行） */
const ONE_ROW_THRESHOLD = 5;



function SectionActionButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {

  const sectionActionButtonClass =
    "cursor-pointer text-sm w-full flex items-center justify-center gap-2 font-semibold p-2 border border-foreground text-foreground";
  return (
    <button type="button" className={sectionActionButtonClass + " " + className} onClick={onClick}>
      {children}
    </button>
  );
}

export function WorksListWithCategories({ title, subtitle, id, categories, works, showAllSectionId, setShowAllSectionId }: {
  title: string;
  subtitle: string;
  id: string;
  categories: string[];
  works: Work[];
  showAllSectionId: string | null;
  setShowAllSectionId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const { t } = useTranslation();
  const isExpanded = showAllSectionId === id;
  const previewCount = 3;
  const hasMore = works.length > previewCount;
  const previewWorks = works.slice(0, previewCount);
  const fourthWork = hasMore ? works[previewCount] : null;

  const [expandedMaxHeight, setExpandedMaxHeight] = useState(PREVIEW_MAX_HEIGHT_PX);
  const expandListRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (!isExpanded) {
      const id = requestAnimationFrame(() => setExpandedMaxHeight(PREVIEW_MAX_HEIGHT_PX));
      return () => cancelAnimationFrame(id);
    }
    if (isClosingRef.current) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fullHeight = expandListRef.current?.scrollHeight ?? 3000;
        setExpandedMaxHeight(fullHeight);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isExpanded]);

  const handleClose = () => {
    isClosingRef.current = true;
    setExpandedMaxHeight(PREVIEW_MAX_HEIGHT_PX);
  };

  const handleExpandTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "max-height" || !isClosingRef.current) return;
    isClosingRef.current = false;
    setShowAllSectionId(null);
  };

  return (
    <div className="py-3 md:py-10 md:h-[496px] flex flex-col md:flex-row gap-4 overflow-hidden md:overflow-hidden max-md:overflow-visible md:justify-between">
      <div
        className="md:min-w-[245px] md:max-w-[245px] flex flex-col items-start gap-4 md:gap-8 sticky top-20 z-10 md:static max-md:backdrop-blur-xs py-6 md:py-0"
      >
        <div className="flex flex-col items-start gap-2">
          <h2 className="md:text-2xl text-xl">{title}</h2>
          <p className="md:text-base text-sm">{subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-2 md:text-sm text-xs">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>

        <div className="md:hidden w-full block">
          {showAllSectionId === id && (
            <SectionActionButton onClick={handleClose} className="border-dark-blue-primary! bg-dark-blue-primary/10! p-1!">
              <CrossLargeIcon width={12} height={12} className="w-3 h-3" color="var(--dark-blue-primary)" />
              <span className="text-dark-blue-primary text-xs">{t("works.viewLess")}</span>
            </SectionActionButton>
          )}
        </div>

      </div>

      <div
        className="hidden md:flex flex-1 min-w-0 md:h-full!"
        style={{
          height: works.length <= ONE_ROW_THRESHOLD ? ONE_ROW_HEIGHT_PX : MULTI_ROW_MAX_HEIGHT_PX,
        }}
      >
        <VerticalScrollArea contentKey={works.length} className="h-full w-full">
          {works.map((work) => (
            <div key={work.id} className="shrink-0">
              <WorkCard work={work} />
            </div>
          ))}
        </VerticalScrollArea>
      </div>


      <div className="md:hidden flex flex-col gap-2">
        {isExpanded ? (
          <div
            ref={expandListRef}
            className="flex flex-col gap-2 overflow-hidden transition-[max-height] duration-300 ease-out"
            style={{ maxHeight: expandedMaxHeight }}
            onTransitionEnd={handleExpandTransitionEnd}
          >
            {works.map((work) => (
              <div key={work.id} className="shrink-0">
                <WorkCard work={work} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {previewWorks.map((work) => (
              <div key={work.id} className="shrink-0">
                <WorkCard work={work} />
              </div>
            ))}
            {fourthWork && (
              <div className="shrink-0 overflow-hidden max-h-[100px] mask-fade-bottom">
                <WorkCard work={fourthWork} />
              </div>
            )}
            {hasMore && (
              <SectionActionButton onClick={() => setShowAllSectionId(id)}>
                {t("works.viewAll")}
              </SectionActionButton>
            )}
          </>
        )}
      </div>



    </div>
  );
}