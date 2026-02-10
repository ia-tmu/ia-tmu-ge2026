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
import ClientLanguageRedirect from "./features/ClientLanguageRedirect";
import ScrollManager from "./components/ScrollManager";
import BuildInfoLogger from "./components/BuildInfoLogger";
import { FVScrollRefProvider } from "./contexts/FVScrollRefContext";
import Header from "./components/Header";
import "../../globals.css";
import siteConfig from "../../site.config";

const {
  title,
  description,
  keywords,
  twitterSite,
  defaultLocale: siteLocale,
} = siteConfig;

const basePath = process.env.BASE_PATH || "";
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}${basePath}/`
  : "https://industrial-art.sd.tmu.ac.jp/ge2026/";
const ogpImageUrl = `${baseUrl}images/ogp.png`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: title,
    template: `%s | 東京都立大学 卒展 2026`,
  },

  description,

  openGraph: {
    type: "website",
    title,
    description,
    url: baseUrl,
    siteName: title,
    locale: siteLocale,
    alternateLocale: "en_US",
    images: [
      {
        url: ogpImageUrl,
        width: 1200,
        height: 630,
        alt: "東京都立大学 卒展 2026 - インダストリアルアート学科 卒業・修了制作研究展",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: twitterSite,
    title,
    description,
    images: ogpImageUrl,
  },

  keywords,

  alternates: {
    canonical: `${baseUrl}ja/`,
    languages: {
      ja: `${baseUrl}ja/`,
      en: `${baseUrl}en/`,
      "x-default": `${baseUrl}ja/`,
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export async function generateStaticParams(): Promise<
  Array<{ locale: Locale }>
> {
  console.log("generateStaticParams-@/layout:", locales);
  return locales.map((locale) => ({ locale }));
}

// JSON-LD 構造化データ（イベント情報 + WebSite）
function getJsonLd(locale: string) {
  const isJa = locale === "ja";

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "ExhibitionEvent",
    name: isJa
      ? "東京都立大学 卒展 2026 - インダストリアルアート学科 卒業・修了制作研究展"
      : "TMU Industrial Art Graduation Exhibition 2026",
    alternateName: isJa
      ? [
        "都立大 卒展 2026",
        "TMU IA 卒展",
        "インダストリアルアート 卒業制作展",
      ]
      : ["TMU IA GE 2026"],
    description: isJa
      ? "東京都立大学（都立大）システムデザイン学部 インダストリアルアート学科・学域の卒業・修了制作研究展2026。テーマは『もや』。東京都美術館にて入場無料で開催。"
      : "Tokyo Metropolitan University, Department of Industrial Art Graduation Exhibition 2026. Theme: 'Moya'. Free admission at Tokyo Metropolitan Art Museum.",
    startDate: "2026-03-01T09:30:00+09:00",
    endDate: "2026-03-07T12:00:00+09:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: isJa
        ? "東京都美術館 ギャラリーA・B"
        : "Tokyo Metropolitan Art Museum Gallery A/B",
      address: {
        "@type": "PostalAddress",
        streetAddress: "8-36 Uenokoen",
        addressLocality: isJa ? "台東区" : "Taito-ku",
        addressRegion: isJa ? "東京都" : "Tokyo",
        postalCode: "110-0007",
        addressCountry: "JP",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 35.717211,
        longitude: 139.772939,
      },
    },
    organizer: {
      "@type": "EducationalOrganization",
      name: isJa
        ? "東京都立大学 システムデザイン学部 インダストリアルアート学科"
        : "Tokyo Metropolitan University, Department of Industrial Art",
      url: "https://industrial-art.sd.tmu.ac.jp/",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      description: isJa ? "入場無料" : "Free admission",
    },
    image: ogpImageUrl,
    url: baseUrl,
    inLanguage: isJa ? "ja" : "en",
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: isJa
      ? "東京都立大学 卒展 2026"
      : "TMU Industrial Art Graduation Exhibition 2026",
    alternateName: isJa
      ? "都立大 卒展 2026"
      : "TMU IA GE 2026",
    url: baseUrl,
    inLanguage: isJa ? "ja" : "en",
  };

  return { eventJsonLd, webSiteJsonLd };
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

  const { eventJsonLd, webSiteJsonLd } = getJsonLd(locale);

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />
      </head>
      <body className="antialiased scroll-smooth">
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
          <FVScrollRefProvider>
            <ClientLanguageRedirect locale={locale} />
            <BuildInfoLogger />
            <Header />
            {children}
          </FVScrollRefProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
