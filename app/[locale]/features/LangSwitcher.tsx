"use client";

import { useParams, usePathname } from "next/navigation";
import { localePath } from "../lib/localePath";
import Button from "../components/Button";

export default function LangSwitcher() {
  const { locale } = useParams();
  const pathname = usePathname();

  const target = locale === "ja" ? "en" : "ja";

  const currentPathWithoutLocale = (() => {
    if (locale === "en") {
      const cleaned = pathname.replace(/^\/en(\/|$)/, "/ja");
      return cleaned === "" ? "/" : cleaned;
    }
    return pathname || "/";
  })();

  const targetHref = localePath(target, currentPathWithoutLocale);

  return (
    <Button href={targetHref}>
      {locale === "ja" ? "EN" : "JA"}
    </Button>
  );
}
