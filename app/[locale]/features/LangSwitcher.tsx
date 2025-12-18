"use client";

import { useParams, usePathname } from "next/navigation";
import { localePath } from "../lib/localePath";
import Button from "../components/Button";

export default function LangSwitcher() {
  const { locale } = useParams();
  const pathname = usePathname();

  const target = locale === "ja" ? "en" : "ja";

  const currentPathWithoutLocale = (() => {
    const prefixRegex = new RegExp(`^/${locale}(/|$)`);
    if (prefixRegex.test(pathname)) {
      const cleaned = pathname.replace(prefixRegex, "");
      return cleaned.startsWith("/") ? cleaned : "/" + cleaned;
    }
    return pathname.startsWith("/") ? pathname : "/" + pathname;
  })();

  const targetHref = localePath(target, currentPathWithoutLocale);

  const handleLanguageChange = () => {
    // CookieにNEXT_LOCALEを設定して、ミドルウェアがユーザーの選択を優先するようにする
    const date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30日間有効

    // CookieのパスをbasePathに合わせる（サブディレクトリ運用の競合回避）
    // NEXT_PUBLIC_BASE_PATHはnext.config.tsで設定
    const cookiePath = process.env.NEXT_PUBLIC_BASE_PATH || "/";
    document.cookie = `NEXT_LOCALE=${target};expires=${date.toUTCString()};path=${cookiePath}`;
  };

  return (
    <Button href={targetHref} className={"text-2xl !no-underline"} onClick={handleLanguageChange}>
      {locale === "ja" ? "EN" : "JA"}
    </Button>
  );
}
