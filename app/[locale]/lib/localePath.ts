export function localePath(locale: string, path: string) {
  if (locale === "ja") {
    return path;
  }
  return `/${locale}${path}`;
}
