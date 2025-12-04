import type { Metadata } from "next";
import I18nProvider from "./features/I18nProvider";
import {
  Locale,
  locales,
  initI18next,
  isValidLocale,
  defaultLocale,
} from "../i18n";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026";
const description = `
  インダストリアルアート学科・学域の卒業・修了制作研究展を開催します。
  ｜ 2026年3月1日(土)〜3月7日(日)（3月2日(月)は休館日）
  ｜ @東京都美術館 ギャラリーA・B【入場無料】
  ｜ 今年の展示名は「卒業・修了制作研究展2026」
  会期：9:30 - 17:30（最終入場17:00）
  最終日3/7は 9:30 - 12:00（最終入場11:30）
`;
const baseUrl = "https://industrial-art.sd.tmu.ac.jp/ge2026/";
const ogpImageUrl = `${baseUrl}images/ogp.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: title,
    template: `%s | 東京都立大学 卒業・修了制作研究展 2026`,
  },

  description,

  openGraph: {
    type: "website",
    title,
    description,
    url: baseUrl,
    siteName: title,
    locale: "ja_JP",
    images: [
      {
        url: ogpImageUrl,
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@tmu_ia_sotsuten",
    title,
    description,
    images: ogpImageUrl,
  },

  keywords: [
    "東京都立大学",
    "システムデザイン学部",
    "インダストリアルアート",
    "卒業制作",
    "修了制作",
    "展示",
    "2026",
    "東京",
    "東京都美術館",
  ],

  alternates: {
    canonical: baseUrl,
  },
};

export async function generateStaticParams(): Promise<
  Array<{ locale: Locale }>
> {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = isValidLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : defaultLocale;
  const i18n = await initI18next(locale, ["translation"]);
  const resources = {
    [locale]: {
      translation: i18n.getResourceBundle(locale, "translation"),
    },
  };
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider locale={locale} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
