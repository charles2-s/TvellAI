import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Server misconfigured: missing Supabase admin credentials" }, { status: 500 });
    }

    const supabase = createClient();

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      return NextResponse.json({ error: `Failed to list buckets: ${listError.message}` }, { status: 400 });
    }

    const exists = buckets?.some((bucket) => bucket.name === "destination-photos");

    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket("destination-photos", {
        public: true,
        fileSizeLimit: 5242880,
      });

      if (createError) {
        return NextResponse.json({ error: `Failed to create bucket: ${createError.message}` }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
