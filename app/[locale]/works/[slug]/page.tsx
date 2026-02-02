import Image from "next/image";
import { fetchRowBySlug, fetchAllIds } from "@/lib/getSheets";
import { notFound } from "next/navigation";

export const dynamicParams = false;

// ID列だけを読み込んでURLリストを作る
export async function generateStaticParams() {
  const ids = await fetchAllIds();
  return ids.map((id) => ({ slug: id }));
}

export default async function Work({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const work = await fetchRowBySlug(slug);

  if (!work) {
    notFound();
  }


  return (
    <div className="p-4 text-black">
      <h1 className="text-4xl font-bold">{work.name}</h1>
      <div className="overflow-x-auto mt-3">
        {work.image && (
          <div className="w-full max-w-lg float-right">
            <Image
              src={work.imageURL}
              width={800}
              height={600}
              alt={work.name}
              className="rounded-xl shadow-lg object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}