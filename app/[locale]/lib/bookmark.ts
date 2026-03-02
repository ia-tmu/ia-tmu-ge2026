const STORAGE_KEY = "bookmarkedWorks";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function isBookmarked(slug: string): boolean {
  const list = getBookmarks();
  return list.includes(slug);
}

export function toggleBookmark(slug: string): string[] {
  const list = getBookmarks();

  let newList: string[];
  if (list.includes(slug)) {
    newList = list.filter((id) => id !== slug);
  } else {
    newList = [...list, slug];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return newList;
}

export function addBookmark(slug: string) {
  const list = getBookmarks();
  if (!list.includes(slug)) {
    const newList = [...list, slug];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  }
}

export function removeBookmark(slug: string) {
  const list = getBookmarks().filter((id) => id !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function createShareUrl() {
  if (typeof window === "undefined") return null;

  const ids = getBookmarks();
  if (ids.length === 0) return null;

  const params = new URLSearchParams({
    ids: ids.join(","), // ← 仕様固定
  });

  return `${location.origin}${basePath}/share?${params.toString()}`;
}
