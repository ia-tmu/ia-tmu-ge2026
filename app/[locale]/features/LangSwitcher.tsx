"use client";

import { useParams, usePathname } from "next/navigation";
import { localePath } from "../lib/localePath";
import Button from "../components/Button";

export default function LangSwitcher() {
  const { locale } = useParams();        // 現在のロケール
  const pathname = usePathname();        // 現在のフルパス (例: "/en/works/abc")

  const target = locale === "ja" ? "en" : "ja";

  const currentPathWithoutLocale = (() => {
    if (locale === "en") {
      return pathname.replace(/^\/en/, "") || "/";
    }
    return pathname;
  })();

  const targetHref = localePath(target, currentPathWithoutLocale);

  return (
    <Button href={targetHref}>
      {locale === "ja" ? "EN" : "JA"}
    </Button>
  );
}
