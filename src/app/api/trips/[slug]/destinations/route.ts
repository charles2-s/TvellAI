import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Destination } from "@/types/destination";
import {
  getDestinationStatus,
  computeTimeDisplay,
} from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, slug, name")
      .eq("slug", slug)
      .single();

    if (companyError || !company) {
      console.error("[/api/trips/[slug]/destinations] company query error:", companyError);
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const { data: destinations, error: destError } = await supabase
      .from("destinations")
      .select("*")
      .eq("company_id", company.id)
      .order("order", { ascending: true });

    if (destError) {
      console.error("[/api/trips/[slug]/destinations] destinations query error:", destError);
      return NextResponse.json({ error: destError.message }, { status: 500 });
    }

    const enriched = (destinations || []).map((d: Destination) => {
      const startTime = d.start_time ? new Date(d.start_time) : null;
      const endTime = d.end_time ? new Date(d.end_time) : null;
      const status = getDestinationStatus(startTime, endTime, d.status);
      const { time_remaining, time_display } = computeTimeDisplay(
        startTime,
        endTime,
        status
      );

      return {
        ...d,
        computed_status: status,
        time_remaining,
        time_display,
      };
    });

    return NextResponse.json({
      trip: {
        id: company.id,
        name: company.name,
        slug: company.slug,
      },
      destinations: enriched,
    });
  } catch (err) {
    console.error("[/api/trips/[slug]/destinations] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
