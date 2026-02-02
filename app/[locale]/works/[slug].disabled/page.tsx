import { locales, type Locale } from "../../../i18n";

// 静的エクスポート用の設定
export const dynamicParams = false;

// 静的エクスポート用: すべてのロケールとslugの組み合わせを生成
export async function generateStaticParams(): Promise<
  Array<{ locale: Locale; slug: string }>
> {
  // 現時点ではworksのデータがないため、空の配列を返す
  // 将来的にworksデータが追加されたら、以下のように変更:
  // const works = await getWorks(); // worksデータを取得
  // return locales.flatMap((locale) =>
  //   works.map((work) => ({ locale, slug: work.slug }))
  // );

  return [];
}

export default function Work() {
  return <h1>this is a work page.</h1>;
}
