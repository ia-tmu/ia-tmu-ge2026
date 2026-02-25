"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { Work } from "../../types/work";
import type { SearchKeywordCategory } from "@/app/constants";
import { localePath } from "../../lib/localePath";
import { KeywordListModal } from "./KeywordListModal";

const MAX_WORK_SUGGESTIONS = 4;
const MAX_KEYWORD_SUGGESTIONS_TOTAL = 15;

type Props = {
  works: Work[];
  /** 分類付きキーワード。検索は全キーワード横断、表示は分類ごと。 */
  keywordCategories: SearchKeywordCategory[];
  /** 絞り込み用に選択中のキーワード */
  selectedKeywords: string[];
  /** 選択キーワードの変更 */
  onSelectedKeywordsChange: (keywords: string[]) => void;
};

function matchTitle(query: string, work: Work): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (work.workTitle ?? "").toLowerCase().includes(q);
}

function matchId(query: string, work: Work): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (work.id ?? "").toLowerCase().includes(q);
}

function matchKeyword(query: string, keyword: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return keyword.toLowerCase().includes(q);
}

export function WorksSearch({
  works,
  keywordCategories,
  selectedKeywords,
  onSelectedKeywordsChange,
}: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const locale = (params?.locale as string) ?? "ja";
  const [query, setQuery] = useState("");
  const [closedByUser, setClosedByUser] = useState(false);
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const allKeywords = useMemo(
    () => keywordCategories.flatMap((c) => c.keywords),
    [keywordCategories]
  );

  const matchedWorks = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return works
      .filter((w) => matchTitle(query, w) || matchId(query, w))
      .slice(0, MAX_WORK_SUGGESTIONS);
  }, [works, query]);

  /** 検索は全キーワード横断。一致したキーワードを件数制限しつつ、分類ごとにまとめる。 */
  const matchedKeywordsByCategory = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const matchedSet = new Set<string>();
    const matched: string[] = [];
    for (const k of allKeywords) {
      if (matchKeyword(query, k) && !matchedSet.has(k)) {
        matchedSet.add(k);
        matched.push(k);
        if (matched.length >= MAX_KEYWORD_SUGGESTIONS_TOTAL) break;
      }
    }
    return keywordCategories
      .map((cat) => ({
        category: cat,
        keywords: matched.filter((k) => cat.keywords.includes(k)),
      }))
      .filter((g) => g.keywords.length > 0);
  }, [keywordCategories, allKeywords, query]);

  const hasMatchedKeywords = matchedKeywordsByCategory.length > 0;
  const showDropdown =
    query.trim() !== "" && (matchedWorks.length > 0 || hasMatchedKeywords);
  const effectiveOpen = showDropdown && !closedByUser;

  const closeDropdown = useCallback(() => {
    setClosedByUser(true);
  }, []);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setClosedByUser(false);
  }, []);

  const toggleKeyword = useCallback(
    (keyword: string) => {
      onSelectedKeywordsChange(
        selectedKeywords.includes(keyword)
          ? selectedKeywords.filter((k) => k !== keyword)
          : [...selectedKeywords, keyword]
      );
    },
    [selectedKeywords, onSelectedKeywordsChange]
  );

  const removeKeyword = useCallback(
    (keyword: string) => {
      onSelectedKeywordsChange(selectedKeywords.filter((k) => k !== keyword));
    },
    [selectedKeywords, onSelectedKeywordsChange]
  );

  useEffect(() => {
    if (!effectiveOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDropdown();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveOpen, closeDropdown]);

  useEffect(() => {
    if (!effectiveOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [effectiveOpen, closeDropdown]);

  return (
    <div ref={containerRef} className="relative w-full py-6 md:py-12 flex flex-col gap-2">
      <label htmlFor="works-search" className="sr-only">
        {t("works.search.label")}
      </label>
      <input
        id="works-search"
        type="search"
        value={query}
        onChange={handleQueryChange}
        placeholder={t("works.search.placeholder")}
        className="search-input-clear w-full text-sm md:text-base rounded-full px-6 py-2 border border-foreground bg-background/10 backdrop-blur-lg text-foreground placeholder:text-foreground/90 focus:outline-none focus:ring-0 focus:border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2"
        role="combobox"
        aria-expanded={effectiveOpen}
        aria-controls="works-search-listbox"
        aria-autocomplete="list"
      />

      {effectiveOpen && (
        <div
          id="works-search-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-full -mt-8 z-20 max-h-[min(70vh,400px)] overflow-y-auto border border-foreground backdrop-blur-lg rounded-2xl shadow-lg bg-black/10"
        >
          {matchedWorks.length > 0 && (
            <div className="p-2 border-b border-foreground/30">
              {/* <div className="text-xs font-semibold text-foreground/75 uppercase tracking-wide px-2 py-1">
                {t("works.search.worksHeading")}
              </div> */}
              <ul className="flex flex-col gap-1" role="group" aria-label={t("works.search.worksAriaLabel")}>
                {matchedWorks.map((work) => {
                  const href = localePath(locale, `/works/${work.id}`);
                  const imageSrc = (work.thumbnail?.trim() || work.images?.[0]?.trim()) || null;
                  return (
                    <li key={work.id} role="option" aria-selected="false">
                      <Link
                        href={href}
                        className="flex items-center gap-3 p-2 rounded-sm hover:bg-foreground/10 focus:bg-foreground/10 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                        onClick={closeDropdown}
                      >
                        <span className="relative shrink-0 w-16 h-12 overflow-hidden rounded bg-muted">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt=""
                              width={64}
                              height={48}
                              className="object-cover object-center w-full h-full"
                              sizes="64px"
                            />
                          ) : null}
                        </span>
                        <span className="text-sm font-semibold line-clamp-2">{work.workTitle}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {hasMatchedKeywords && (
            <div className="p-2">
              <div className="flex flex-col gap-3" role="group" aria-label={t("works.search.keywordsAriaLabel")}>
                {matchedKeywordsByCategory.map(({ category, keywords }) => (
                  <div key={category.id}>
                    <ul className="flex flex-col gap-0.5 mt-0.5">
                      {keywords.map((keyword) => {
                        const isSelected = selectedKeywords.includes(keyword);
                        return (
                          <li key={keyword} role="option" aria-selected={isSelected}>
                            <button
                              type="button"
                              onClick={() => toggleKeyword(keyword)}
                              className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left rounded-sm hover:bg-foreground/10 focus:bg-foreground/10 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                            >
                              <span
                                className="shrink-0 w-4 h-4 border border-foreground rounded flex items-center justify-center"
                                aria-hidden
                              >
                                {isSelected ? (
                                  <span className="text-[10px] leading-none">✓</span>
                                ) : null}
                              </span>
                              {keyword}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 w-full">
        {selectedKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 rounded-full px-2 text-sm text-foreground/90 bg-foreground/10 border border-foreground/20"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="shrink-0 cursor-pointer rounded-full p-1.5 hover:bg-foreground/20 focus:bg-foreground/20 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 h-[16px] w-[16px] flex items-center justify-center"
                  aria-label={t("works.search.removeKeyword", { keyword })}
                >
                  <span aria-hidden>×</span>
                </button>
              </span>
            ))}
          </div>
        )}
        <button className="ml-auto shrink-0 cursor-pointer underline underline-offset-4 hover:no-underline hover:text-dark-blue-primary transition-all duration-300" onClick={() => setKeywordModalOpen(true)}>キーワード一覧</button>
      </div>

      <KeywordListModal
        open={keywordModalOpen}
        onClose={() => setKeywordModalOpen(false)}
        keywordCategories={keywordCategories}
        selectedKeywords={selectedKeywords}
        onSelectedKeywordsChange={onSelectedKeywordsChange}
      />
    </div>
  );
}
