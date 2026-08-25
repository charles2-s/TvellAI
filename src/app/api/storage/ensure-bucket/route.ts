import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = createClient();

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 400 });
    }

    const exists = buckets?.some((bucket) => bucket.name === "destination-photos");

    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket("destination-photos", {
        public: true,
        fileSizeLimit: 5242880,
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
