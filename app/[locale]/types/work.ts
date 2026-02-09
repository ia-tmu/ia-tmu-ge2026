export interface Work {
  id: string;
  name: string;
  image: string;
  imageURL: string;
  studentID: string;
  studioName: string;
  workTitle: string;
  workDescription: string;
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
