"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import LangSwitcher from "../features/LangSwitcher";
import { useFVScrollRef } from "../contexts/FVScrollRefContext";
import Button from "./Button";
import guruguru05Static from "../../../public/images/top/guruguru_05.png";

const SECTION_IDS = [
    { id: "concept", key: "header.nav.concept" },
    { id: "web-exhibition", key: "header.nav.webExhibition" },
    { id: "events", key: "header.nav.events" },
    { id: "info", key: "header.nav.info" },
    { id: "sns", key: "header.nav.sns" },
] as const;


export default function Header() {
    const { t } = useTranslation();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const fvScrollRef = useFVScrollRef();

    // トップページかどうか（[locale] 直下のみ＝FV があるページ。pathname は / または /works/ など）
    const path = (pathname ?? "").replace(/\/$/, "") || "/";
    const isTopPage = path === "/";
    const isWorksPage = pathname?.startsWith("/works/");

    // FV→Concept のスクロールに合わせてロゴを透明→表示（Teaserのフェードアウトと同期）
    // トップページ以外ではロゴを常に表示
    const { scrollYProgress } = useScroll({
        target: fvScrollRef ?? undefined,
        offset: ["start start", "end start"],
    });
    const logoOpacityFromScroll = useTransform(scrollYProgress, [0, 0.08, 0.2], [0, 0, 1]);
    const logoOpacity = isTopPage ? logoOpacityFromScroll : 1;

    const closeMenu = useCallback(() => setMenuOpen(false), []);


    const Highlighted = ({ children }: { children: React.ReactNode }) => {
        return (
            <div className="text-dark-blue-primary! font-medium!">
                {children}
            </div>
        )
    }

    return (
        <>
            <div
                className={`fixed inset-0 z-50 backdrop-blur-md transition-opacity duration-300 pointer-events-none ${menuOpen ? "opacity-100" : "opacity-0"}`}
                aria-hidden={!menuOpen}
            />

            <header
                className={`w-full h-20 md:h-24 px-4 md:px-8 flex items-center justify-between fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}
            >
                {/* 左: ロゴ（FV→Concept スクロールでフェードイン） */}
                <motion.a
                    href="/"
                    className="shrink-0 w-10 h-10 md:w-14 md:h-14 relative overflow-hidden rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue-primary block transition-opacity duration-300"
                    aria-label={t("teaser.logo")}
                    style={{ opacity: menuOpen ? 1 : logoOpacity }}
                >
                    <Image
                        src={guruguru05Static}
                        alt={t("teaser.logo")}
                        fill
                        className="object-contain"
                        sizes="56px"
                        priority
                    />
                </motion.a>

                {/* 中央: セクションリンク（md以上のみ表示） */}
                <nav
                    className="hidden md:flex absolute justify-center left-1/2 -translate-x-1/2 gap-8 min-w-[440px]"
                    aria-label="Main navigation"
                >
                    {SECTION_IDS.map(({ id, key }) => (
                        isWorksPage && id === "web-exhibition" ? (
                            <Button key={id} href={`/works`} linkNoUnderline={true}>
                                <Highlighted>
                                    {t(key)}
                                </Highlighted>
                            </Button>
                        ) : (
                            <Button key={id} href={`/#${id}`} linkNoUnderline={true}>
                                {t(key)}
                            </Button>
                        )
                    ))}
                </nav>

                {/* 右: ハンバーガーボタン */}
                <div className="shrink-0 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="md:hidden p-2 w-10 h-10 md:w-12 md:h-12 flex flex-col justify-center items-center gap-1.5 text-foreground hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-blue-primary rounded"
                        aria-expanded={menuOpen}
                        aria-controls="header-menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </button>

                    <div className="hidden md:block">
                        <LangSwitcher />
                    </div>

                </div>
            </header >

            <div
                id="header-menu"
                className={`fixed left-0 right-0 top-20 bottom-0 md:top-[120px] z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                aria-hidden={!menuOpen}
            >
                <nav
                    className="flex flex-col items-center gap-6 p-6 md:flex-row md:flex-wrap md:justify-center md:gap-8 md:p-8"
                    aria-label="Menu navigation"
                >
                    {SECTION_IDS.map(({ id, key }) => (
                        <Button key={id} href={`/#${id}`} linkNoUnderline={true} onClick={closeMenu}>
                            {t(key)}
                        </Button>
                    ))}
                    <div className="pt-4 w-full md:w-max md:pt-0 md:pl-4 border-t border-foreground/20 md:border-t-0 md:border-l md:border-foreground/20 flex justify-center">
                        <LangSwitcher />
                    </div>
                </nav>
            </div>
        </>
    );
}
