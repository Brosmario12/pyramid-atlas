import { NextResponse } from "next/server";
import { fallbackRoutes } from "@/lib/binnibus";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) return NextResponse.json(fallbackRoutes);

  const { data, error } = await supabase.from("binnibus_routes").select("*");

  if (error || !data?.length) return NextResponse.json(fallbackRoutes);

  return NextResponse.json(data);
}
