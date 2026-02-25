"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Props = {
  locale: string;
};

/**
 * 静的エクスポート環境向けのクライアントサイド言語リダイレクト機能
 * Middlewareが動作しない環境で、ブラウザの言語設定に基づいてリダイレクトを行う
 */
export default function ClientLanguageRedirect({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    // 初回マウント時のみチェック
    if (checkedRef.current) return;
    checkedRef.current = true;

    // 1. 既にユーザーが言語を選択済み（Cookieがある）場合は何もしない
    // LangSwitcherで NEXT_LOCALE クッキーを設定している想定
    if (document.cookie.includes("NEXT_LOCALE=")) {
      return;
    }

    // 2. ブラウザの言語設定を取得
    const browserLang =
      typeof navigator !== "undefined" ? navigator.language : "";
    const isEnglishBrowser = browserLang.startsWith("en");

    // 3. 言語設定と現在のページが不一致の場合にリダイレクト
    if (isEnglishBrowser && locale !== "en") {
      // 英語ブラウザなのに日本語ページ（locale="ja"）にいる場合 -> 英語ページへ
      // prefixDefault: true のため pathname は常に /ja/... または /en/... の形式
      const newPath = pathname.replace(/^\/ja/, "/en");
      router.replace(newPath);
    }

    // 日本語ブラウザの場合、デフォルトで日本語ページ（/）が表示されるのでリダイレクト不要
    // もし英語ページ(/en)に直接アクセスした場合は、そこを見たいという意図なのでリダイレクトしない方が親切
  }, [locale, pathname, router]);

  return null;
}
