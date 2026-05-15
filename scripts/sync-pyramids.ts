import { fallbackPyramids } from "@/lib/pyramids";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function syncPyramids() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      ok: false,
      synced: 0,
      reason: "Supabase no configurado",
    };
  }

  const payload = fallbackPyramids.map((item) => ({
    ...item,
    updatedAt: new Date().toISOString(),
  }));

  const { error } = await supabase.from("pyramids").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }

  return {
    ok: true,
    synced: payload.length,
  };
}

if (process.argv[1]?.endsWith("sync-pyramids.ts")) {
  syncPyramids()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
