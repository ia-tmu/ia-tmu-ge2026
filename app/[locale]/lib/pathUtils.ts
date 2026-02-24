/**
 * ロケールを考慮したパス判定ユーティリティ
 *
 * next-i18n-router では、デフォルトロケール(ja)はプレフィックスなし（/）、
 * その他(en等)は /en のようにプレフィックス付きになる。
 * パス比較時は必ずこのモジュールの関数を使用し、ロケールの有無による不具合を防ぐ。
 */
import { locales } from "../../i18n";

/**
 * 末尾スラシュを除去し、空の場合は "/" を返す
 */
export function getNormalizedPath(pathname: string | null | undefined): string {
  return (pathname ?? "").replace(/\/$/, "") || "/";
}

/**
 * トップページ（FV がある [locale] 直下）かどうか
 * pathname が "/" または "/ja", "/en" 等のロケールルートの場合に true
 */
export function isTopPagePath(pathname: string | null | undefined): boolean {
  const path = getNormalizedPath(pathname);
  return path === "/" || locales.some((loc) => path === `/${loc}`);
}

/**
 * 作品ページ（works 一覧または詳細）かどうか
 * pathname が "/works" または "/works/xxx"、"/en/works" 等の場合に true
 */
export function isWorksPagePath(
  pathname: string | null | undefined
): boolean {
  const path = getNormalizedPath(pathname);
  const possiblePrefixes = ["", ...locales.map((loc) => `/${loc}`)];
  return possiblePrefixes.some((prefix) => {
    const worksPath = `${prefix}/works`;
    return path === worksPath || path.startsWith(`${worksPath}/`);
  });
}
