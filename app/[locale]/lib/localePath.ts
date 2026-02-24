/**
 * 常にロケール付きのパスを返す（prefixDefault: true と統一）。
 * これにより /works のようにロケールが付かない URL での 404 を防ぐ。
 */
export function localePath(locale: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}
