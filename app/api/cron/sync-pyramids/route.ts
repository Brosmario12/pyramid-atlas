import { NextRequest, NextResponse } from "next/server";
import { syncPyramids } from "@/scripts/sync-pyramids";

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await syncPyramids();
  return NextResponse.json(result);
}
