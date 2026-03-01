import { RedirectToLocaleWorks } from "./RedirectToLocaleWorks";

/**
 * /works に直アクセスした場合に /ja/works へリダイレクトする。
 * 本番（静的エクスポート）で locale なし URL の 404 を防ぐ。
 */
export default function WorksRedirectPage() {
  return <RedirectToLocaleWorks />;
}
