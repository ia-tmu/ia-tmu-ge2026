import { NextResponse } from "next/server";
import { fetchSheetValues } from "@/lib/getSheets";

export async function GET() {
  try {
    const data = await fetchSheetValues();
    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
