"use client";

import { useState, useCallback } from "react";
import { Listbox, ListboxOption, ListboxOptions } from "@headlessui/react";
import type { SearchKeywordCategory } from "@/app/constants";
import { Modal } from "../../components/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  keywordCategories: SearchKeywordCategory[];
  selectedKeywords: string[];
  onSelectedKeywordsChange: (keywords: string[]) => void;
};

const listboxOptionClass =
  "group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded";
const optionSpanClass =
  "flex items-center gap-2 px-2 py-1.5 text-sm rounded group-hover:bg-foreground/10 group-data-[selected]:bg-foreground/15";

function CategoryKeywordList({ category }: { category: SearchKeywordCategory }) {
  return (
    <ul className="flex flex-col gap-1">
      {category.keywords.map((keyword) => (
        <li key={keyword}>
          <ListboxOption value={keyword} className={listboxOptionClass}>
            {({ selected }) => (
              <span className={optionSpanClass}>
                <span
                  className="shrink-0 w-4 h-4 rounded flex items-center justify-center bg-foreground/10 group-data-[selected]:bg-foreground/20"
                  aria-hidden
                >
                  {selected ? (
                    <span className="text-[10px] leading-none">✓</span>
                  ) : null}
                </span>
                {keyword}
              </span>
            )}
          </ListboxOption>
        </li>
      ))}
    </ul>
  );
}

/**
 * Modal でキーワード一覧を分類ごとに表示し、チェックボックスで絞り込み用に選択できる。
 */
export function KeywordListModal({
  open,
  onClose,
  keywordCategories,
  selectedKeywords,
  onSelectedKeywordsChange,
}: Props) {
  const [openAccordionIds, setOpenAccordionIds] = useState<Set<string>>(
    () => new Set(keywordCategories[0] ? [keywordCategories[0].id] : [])
  );

  const toggleAccordion = useCallback((id: string) => {
    setOpenAccordionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <Modal open={open} onClose={onClose} title="キーワード一覧" size="extra-large">
      <Listbox
        value={selectedKeywords}
        onChange={onSelectedKeywordsChange}
        multiple
        as="div"
        className="flex flex-col gap-4"
      >
        <ListboxOptions
          static
          className="flex flex-col gap-2 outline-none md:grid md:grid-cols-2 md:gap-6 md:items-start"
        >
          {keywordCategories.map((category, index) => {
            const isOpen = openAccordionIds.has(category.id);
            const isLastCategory = index === keywordCategories.length - 1;
            const gridPlacement = isLastCategory
              ? "md:col-start-2 md:row-start-1 md:row-span-2"
              : index === 0
                ? "md:col-start-1 md:row-start-1"
                : "md:col-start-1 md:row-start-2";
            return (
              <div
                key={category.id}
                className={`border border-foreground/20 rounded-lg md:border-0 md:rounded-none ${gridPlacement}`}
              >
                {/* モバイル: アコーディオン用ボタン（＋/－付き） */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(category.id)}
                  className="md:hidden w-full flex items-center gap-2 text-left text-sm font-semibold px-3 py-2.5 bg-foreground/5 hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset rounded-lg"
                  aria-expanded={isOpen}
                >
                  <span
                    className="shrink-0 w-5 h-5 flex items-center justify-center text-foreground"
                    aria-hidden
                  >
                    {isOpen ? "－" : "＋"}
                  </span>
                  {category.label}
                </button>
                {/* md以上: 見出しのみ */}
                <h3 className="hidden md:block text-sm font-semibold border-b border-foreground/20 pb-1 mb-2">
                  {category.label}
                </h3>
                {/* キーワード一覧（モバイルは開いている時のみ表示、md以上は常に表示） */}
                <div
                  className={
                    isOpen
                      ? "px-3 pb-3 pt-0 border-t border-foreground/10 md:border-0 md:p-0 md:block"
                      : "hidden md:block md:border-0 md:p-0"
                  }
                >
                  <CategoryKeywordList category={category} />
                </div>
              </div>
            );
          })}
        </ListboxOptions>
      </Listbox>
    </Modal>
  );
}
