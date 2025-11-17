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

// "use client";
//
// import { useParams, usePathname, useRouter } from "next/navigation";
// import { useTransition } from "react";
// import i18next from "i18next";
// import { localePath } from "../lib/localePath";
// import Button from "../components/Button";
//
// export default function LangSwitcher() {
//   const { locale } = useParams();        // 現在のロケール
//   const pathname = usePathname();        // 現在のパス
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//
//   const target = locale === "ja" ? "en" : "ja";
//
//   // パスから /en を取り除く処理
//   const currentPathWithoutLocale = (() => {
//     if (locale === "en") {
//       return pathname.replace(/^\/en/, "") || "/";
//     }
//     return pathname;
//   })();
//
//   const targetHref = localePath(target, currentPathWithoutLocale);
//
//   const handleChange = () => {
//     // ① i18next 側も変更
//     i18next.changeLanguage(target);
//
//     // ② Next.js のルーターでURLを切り替え（並列レンダーで安全に）
//     startTransition(() => {
//       router.push(targetHref);
//     });
//   };
//
//   return (
//     <Button onClick={handleChange}>
//       {isPending ? "..." : target.toUpperCase()}
//     </Button>
//   );
// }
//
