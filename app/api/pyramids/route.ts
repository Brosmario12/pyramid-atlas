import { NextResponse } from "next/server";
import { fallbackPyramids } from "@/lib/pyramids";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(fallbackPyramids);
  }

  const { data, error } = await supabase
    .from("pyramids")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data?.length) {
    return NextResponse.json(fallbackPyramids);
  }

  return NextResponse.json(data);
}
