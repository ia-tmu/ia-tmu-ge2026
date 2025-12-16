import type { Metadata } from "next";
import Script from "next/script";
import I18nProvider from "./features/I18nProvider";
import {
  Locale,
  locales,
  initI18next,
  isValidLocale,
  defaultLocale,
} from "../i18n";
import ScrollManager from "./components/ScrollManager";
import "../../globals.css";

const title =
  "東京都立大学システムデザイン学部・研究科 インダストリアルアート学科・学域 卒業・修了制作研究展2026";
const description = `
  インダストリアルアート学科・学域の卒業・修了制作研究展を開催します。
  2026年3月1日(日)〜3月7日(土)（3月2日(月)は休館日）
  @東京都美術館 ギャラリーA・B【入場無料】
  会期：9:30 - 17:30（最終入場17:00）
  最終日3/7は 9:30 - 12:00（最終入場11:30）
`;
const basePath = process.env.BASE_PATH || "";
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}${basePath}/`
  : "https://industrial-art.sd.tmu.ac.jp/ge2026/";
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
      <body className="antialiased">
        <ScrollManager />
        <Script
          id="adobe-fonts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d) {
                var config = {
                  kitId: 'rzs4zgy',
                  scriptTimeout: 3000,
                  async: true
                },
                h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
              })(document);
            `,
          }}
        />
        <I18nProvider locale={locale} resources={resources}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
