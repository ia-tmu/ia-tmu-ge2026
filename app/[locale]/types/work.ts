export interface Work {
  id: string;
  keywords: string[];
  studentID: string;
  studioName: string;
  degree: string;
  workTitle: string;
  workDescriptionJP: string;
  workDescriptionEN: string;
  thumbnail: string;
  images: string[];
  movie: string;
  application: string;
  link1: string;
  link2: string;
  link3: string;
  order: string;
  link1Title: string;
  link2Title: string;
  link3Title: string;
}

export type SheetData = {
  spreadsheetTitle: string;
  sheetTitle: string;
  headers: (string | number)[];
  works: Work[];
  rows: (string | number | null)[][];
  error?: string;
  objects: Record<string, string>[];
  raw: string[][];
};

export type MovieOrder = "掲載なし" | "サムネイルの次（2番目）" | "最後";
