"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { localePath } from "../lib/localePath";
import { isTopPagePath } from "../lib/pathUtils";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * トップページの右下にのみ固定表示するレポートページへの動線ボタン。
 */
export default function ReportFAB() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) ?? "ja";
  const { t } = useTranslation();

  if (!isTopPagePath(pathname)) return null;

  return (
    <Link
      href={`${basePath}${localePath(locale, "/report")}`}
      className="fixed -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-40 w-24 h-24 md:w-40 md:h-40 pb-6 pr-6 md:pb-10 md:pr-10 rounded-full border border-foreground/40 bg-dark-blue-primary/70 backdrop-blur-md flex flex-col items-center justify-center gap-1 text-foreground hover:bg-dark-blue-primary hover:border-foreground/70 transition-all duration-300 shadow-[0_4px_32px_rgba(0,0,50,0.5)]"
      aria-label={t("reportFAB.aria")}
    >
      <span className="text-base md:text-2xl font-medium leading-none tracking-widest translate-x-1 md:translate-x-2 translate-y-1 md:translate-y-2">{t("reportFAB.line1")}</span>
      <span className="text-base md:text-2xl font-medium leading-none tracking-widest translate-x-1 md:translate-x-2 translate-y-1 md:translate-y-2">{t("reportFAB.line2")}</span>
    </Link>
  );
}
