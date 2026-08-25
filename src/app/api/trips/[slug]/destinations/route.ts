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

    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("id, name, slug, company_id")
      .eq("slug", slug)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const { data: destinations, error: destError } = await supabase
      .from("destinations")
      .select("*")
      .eq("company_id", trip.company_id)
      .order("order", { ascending: true });

    if (destError) {
      return NextResponse.json({ error: destError.message }, { status: 400 });
    }

    const now = new Date();
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
        id: trip.id,
        name: trip.name,
        slug: trip.slug,
      },
      destinations: enriched,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
