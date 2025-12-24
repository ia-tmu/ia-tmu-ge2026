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
    template: `%s | 東京都立大学 卒業・修了制作研究展 2026`,
  },

  description,

  openGraph: {
    type: "website",
    title,
    description,
    url: baseUrl,
    siteName: title,
    locale: siteLocale,
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
    site: twitterSite,
    title,
    description,
    images: ogpImageUrl,
  },

  keywords,

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
          <ClientLanguageRedirect locale={locale} />
          <BuildInfoLogger />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
