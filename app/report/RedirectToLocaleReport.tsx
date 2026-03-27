"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_LOCALE = "ja";

/**
 * ロケールなし /report へのアクセスを /ja/report へ誘導する。
 * 静的エクスポート環境で locale なし URL を 404 にしないための補助。
 */
export function RedirectToLocaleReport() {
  const pathname = usePathname();

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const path = pathname?.startsWith("/report") ? pathname : "/report";
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
