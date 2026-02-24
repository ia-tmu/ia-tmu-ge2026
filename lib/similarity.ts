import worksData from '@/app//[locale]/lib/embeddings.json';

export interface Keyword {
  ja: string;
  en: string;
  key: string;
}

export interface Title {
  en: string;
  ja?: string;
}

export interface Work {
  id: string;
  name: string;
  grade: string;
  title: Title;
  lab: string;
  keyword1: Keyword;
  keyword2: Keyword;
  keyword3: Keyword;
  embedding_text: string;
  embedding: number[];
  embedding_dim: number;
}

export interface SimilarWork {
  work: Work;
  similarity: number;
  rank: number;
}

export interface SimilarityResult {
  selectedWork: Work;
  similarWorks: SimilarWork[];
  stats: {
    count: number;
    maxSimilarity: number;
    minSimilarity: number;
    avgSimilarity: number;
  };
}

const works = worksData as Work[];

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getSimilarWorks(
  id: string,
  limit: number = 10
): SimilarityResult | null {
  const selectedWork = works.find(work => work.id === id);

  if (!selectedWork || !selectedWork.embedding) {
    return null;
  }

  const similarWorks: SimilarWork[] = works
    .filter(work =>
      work.id !== id &&
      work.embedding &&
      work.embedding.length > 0
    )
    .map(work => ({
      work,
      similarity: cosineSimilarity(selectedWork.embedding, work.embedding),
      rank: 0,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const stats = {
    count: similarWorks.length,
    maxSimilarity: similarWorks[0]?.similarity || 0,
    minSimilarity: similarWorks[similarWorks.length - 1]?.similarity || 0,
    avgSimilarity: similarWorks.length > 0
      ? similarWorks.reduce((sum, item) => sum + item.similarity, 0) / similarWorks.length
      : 0,
  };

  return {
    selectedWork,
    similarWorks,
    stats,
  };
}

export function getAllWorks(): Work[] {
  return works;
}

export function getWorkById(id: string): Work | undefined {
  return works.find(work => work.id === id);
}
