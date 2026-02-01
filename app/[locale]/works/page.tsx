import { fetchSheetValues } from "@/lib/getSheets";
import { Works } from "../features/works/Works";
import type { SheetData } from "../types/work";
import MoyaBG from "../features/MoyaBG";
import Footer from "../components/Footer";

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
  return (
    <main className="relative text-sm md:text-base pt-20 md:pt-[120px]">
      <MoyaBG />
      <div className="max-w-[960px] mx-auto px-4 md:px-8">
        <Works data={data} />
      </div>
      <Footer />
    </main>
  );
}
