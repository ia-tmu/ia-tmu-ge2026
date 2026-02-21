export interface Work {
  id: string;
  keyword1: string;
  keyword2: string;
  keyword3: string;
  name: string;
  studentID: string;
  studioName: string;
  degree: string;
  workTitle: string;
  workDescriptionJP: string;
  workDescriptionEN: string;
  thumbnail: string;
  image: string[];
  movie: string;
  application: string;
  link1: string;
  link2: string;
  link3: string;
  order: string;
  link1Title: string;
  link2Title: string;
  link3Title: string;
  keywords: string[];
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
