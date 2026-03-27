import { RedirectToLocaleReport } from "./RedirectToLocaleReport";

/**
 * /report 直アクセス時に /ja/report へリダイレクトする。
 */
export default function ReportRedirectPage() {
  return <RedirectToLocaleReport />;
}
