import type { SimilarTag } from "@/app/[locale]/types/tag"
import { embeddingTags } from "@/app/[locale]/lib/tags"

type EmbeddingMap = Map<string, number[]>

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0)
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0))
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0))

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

const embeddingMap: EmbeddingMap = new Map(
  embeddingTags.map(({ title, embedding }) => [title, embedding])
)

export default async function sortTagsBySimilarity(
  inputTags: string[],
): Promise<SimilarTag[]> {


  const inputEmbeddings = inputTags
    .map(tag => embeddingMap.get(tag))
    .filter((e): e is number[] => Boolean(e))

  if (inputEmbeddings.length === 0) {
    throw new Error("有効な入力タグが見つかりません")
  }

  const similarities = embeddingTags.map(({ title, embedding }) => {
    const avgSimilarity =
      inputEmbeddings.reduce(
        (sum, inputEmb) => sum + cosineSimilarity(embedding, inputEmb),
        0
      ) / inputEmbeddings.length

    return {
      tag: title,
      similarity: avgSimilarity,
    }
  })

  return similarities.sort((a, b) => b.similarity - a.similarity)
}
