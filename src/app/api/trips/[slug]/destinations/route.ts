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
    console.log("[/api/trips/[slug]/destinations] received slug:", JSON.stringify(slug));

    const supabase = await createClient();
    console.log("[/api/trips/[slug]/destinations] supabase client url:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    let trip = null;

    const tripBySlugResult = await supabase
      .from("trips")
      .select("id, name, slug, company_id")
      .eq("slug", slug)
      .single();

    console.log("[/api/trips/[slug]/destinations] trips query result:", JSON.stringify({
      data: tripBySlugResult.data,
      error: tripBySlugResult.error,
    }));

    if (tripBySlugResult.data) {
      trip = tripBySlugResult.data;
    } else {
      const companyBySlugResult = await supabase
        .from("companies")
        .select("id, slug, name")
        .eq("slug", slug)
        .single();

      console.log("[/api/trips/[slug]/destinations] companies query result:", JSON.stringify({
        data: companyBySlugResult.data,
        error: companyBySlugResult.error,
      }));

      if (companyBySlugResult.data) {
        const tripByCompanyResult = await supabase
          .from("trips")
          .select("id, name, slug, company_id")
          .eq("company_id", companyBySlugResult.data.id)
          .single();

        console.log("[/api/trips/[slug]/destinations] trips-by-company query result:", JSON.stringify({
          data: tripByCompanyResult.data,
          error: tripByCompanyResult.error,
        }));

        trip = tripByCompanyResult.data;

        if (!trip) {
          const newTripResult = await supabase
            .from("trips")
            .insert({
              slug: companyBySlugResult.data.slug || slug,
              name: companyBySlugResult.data.name || slug,
              company_id: companyBySlugResult.data.id,
            })
            .select("id, name, slug, company_id")
            .single();

          console.log("[/api/trips/[slug]/destinations] auto-create trip result:", JSON.stringify({
            data: newTripResult.data,
            error: newTripResult.error,
          }));

          trip = newTripResult.data || null;
        }
      }
    }

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const { data: destinations, error: destError } = await supabase
      .from("destinations")
      .select("*")
      .eq("company_id", trip.company_id)
      .order("order", { ascending: true });

    if (destError) {
      console.error("fetch destinations by trip error:", destError);
      return NextResponse.json({ error: destError.message }, { status: 500 });
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
  } catch (err) {
    console.error("[/api/trips/[slug]/destinations] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
