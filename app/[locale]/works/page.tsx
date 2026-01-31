import { fetchSheetValues } from "@/lib/getSheets";
import { Works, type SheetData } from "../features/Works";

export default async function WorksPage() {
  let data: SheetData;
  try {
    const fetched = await fetchSheetValues();
    data = {
      spreadsheetTitle: fetched.spreadsheetTitle,
      sheetTitle: fetched.sheetTitle,
      headers: fetched.headers,
      rows: fetched.rows,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch sheets";
    data = {
      spreadsheetTitle: "",
      sheetTitle: "",
      headers: [],
      rows: [],
      error: message,
    };
  }
  return <Works data={data} />;
}
