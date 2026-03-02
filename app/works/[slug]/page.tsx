import { fetchAllIds } from "@/lib/get-works";
import { RedirectToLocaleWorks } from "../RedirectToLocaleWorks";

/**
 * /works/[slug] に直アクセスした場合に /ja/works/[slug] へリダイレクトする。
 * 本番（静的エクスポート）で locale なし URL の 404 を防ぐ。
 */
export async function generateStaticParams() {
  const ids = await fetchAllIds();
  return ids.map((slug) => ({ slug }));
}

export default function WorkSlugRedirectPage() {
  return <RedirectToLocaleWorks />;
}
