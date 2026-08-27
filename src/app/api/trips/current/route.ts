import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id, slug, name")
      .eq("id", user.id)
      .single();

    if (companyError || !company) {
      console.error("companies fetch error:", companyError);
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    let { data: trip } = await supabase
      .from("trips")
      .select("id, slug, name")
      .eq("company_id", company.id)
      .single();

    if (!trip) {
      const fallbackSlug = (company.slug || `trip-${company.id}`).toLowerCase().replace(/[^a-z0-9-]/g, "");
      const { data: newTrip, error: tripError } = await supabase
        .from("trips")
        .insert({
          slug: fallbackSlug,
          name: company.name || fallbackSlug,
          company_id: company.id,
        })
        .select("id, slug, name")
        .single();

      if (tripError || !newTrip) {
        console.error("trip creation error:", tripError);
        return NextResponse.json(
          { error: "Failed to create trip", details: tripError?.message || null },
          { status: 500 }
        );
      }

      trip = newTrip;
    }

    return NextResponse.json({ trip });
  } catch (err) {
    console.error("/api/trips/current unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
