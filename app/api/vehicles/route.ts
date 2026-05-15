import { NextResponse } from "next/server";
import type { VehiclePosition } from "@/lib/types";

export async function GET() {
  const realtimeUrl = process.env.BINNIBUS_REALTIME_URL;

  if (!realtimeUrl) {
    return NextResponse.json([] satisfies VehiclePosition[]);
  }

  const response = await fetch(realtimeUrl, { next: { revalidate: 15 } });

  if (!response.ok) {
    return NextResponse.json([] satisfies VehiclePosition[]);
  }

  const vehicles = (await response.json()) as VehiclePosition[];
  return NextResponse.json(vehicles);
}
