"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_LOCALE = "ja";

/**
 * ロケールなし /works または /works/[slug] にアクセスしたときに
 * /ja/works または /ja/works/[slug] へリダイレクトする。
 * 静的エクスポートではミドルウェアが動かないため、このページで対応する。
 */
export function RedirectToLocaleWorks() {
  const pathname = usePathname();

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    // pathname は basePath 抜きのパス（例: /works または /works/B15）
    const path = pathname?.startsWith("/works") ? pathname : "/works";
    const trailing = path.endsWith("/") ? "" : "/";
    const target = `${basePath}/${DEFAULT_LOCALE}${path}${trailing}`;
    window.location.replace(target);
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-white/70">
      Redirecting…
    </div>
  );
}
