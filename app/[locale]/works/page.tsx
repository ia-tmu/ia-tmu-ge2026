import { fetchSheetValues } from "@/lib/getSheets";
import type { SheetData } from "../types/work";
import { WorksPageContent } from "./WorksPageContent";

export default async function WorksPage() {
  let data: SheetData;
  try {
    const fetched = await fetchSheetValues();
    data = {
      spreadsheetTitle: fetched.spreadsheetTitle,
      sheetTitle: fetched.sheetTitle,
      headers: fetched.headers,
      works: fetched.works,
      rows: fetched.rows,
      objects: fetched.objects,
      raw: fetched.raw,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch sheets";
    data = {
      spreadsheetTitle: "",
      sheetTitle: "",
      headers: [],
      works: [],
      rows: [],
      objects: [],
      raw: [],
      error: message,
    };
  }

  return <WorksPageContent data={data} />;
}
