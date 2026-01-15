// 静的エクスポート用の設定
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    const params: Array<{ slug: string }> = [{ slug: "__placeholder__" }];

    console.log("generateStaticParams-@/works/[slug]:", params);
    return params;
  } catch (e) {
    console.error("generateStaticParams error:", e);
    return [{ slug: "__placeholder__" }];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Work({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{String(slug)}</h1>
    </div>
  );
}
