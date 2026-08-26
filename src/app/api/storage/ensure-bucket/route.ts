import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error:
            "Server misconfigured: missing Supabase admin credentials. " +
            "Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local and Vercel environment variables.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient();

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error("ensure-bucket listBuckets full error:", listError);
      return NextResponse.json(
        { error: `Failed to list storage buckets: ${listError.message}` },
        { status: 500 }
      );
    }

    const exists = buckets?.some((bucket) => bucket.name === "destination-photos");

    if (!exists) {
      const { error: createError } = await supabase.storage.createBucket("destination-photos", {
        public: true,
        fileSizeLimit: 5242880,
      });

      if (createError) {
        console.error("ensure-bucket createBucket full error:", createError);
        return NextResponse.json(
          { error: `Failed to create storage bucket: ${createError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ensure-bucket unexpected full error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
