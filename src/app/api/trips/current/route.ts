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

    const { data: company } = await supabase
      .from("companies")
      .select("id, slug, name")
      .eq("id", user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { data: trip } = await supabase
      .from("trips")
      .select("id, slug, name")
      .eq("company_id", company.id)
      .single();

    if (!trip) {
      const { data: newTrip, error: tripError } = await supabase
        .from("trips")
        .insert({
          slug: company.slug,
          name: company.name,
          company_id: company.id,
        })
        .select("id, slug, name")
        .single();

      if (tripError || !newTrip) {
        console.error("trip creation error:", tripError);
        return NextResponse.json(
          { error: "Failed to create trip" },
          { status: 500 }
        );
      }

      trip = newTrip;
    }

    return NextResponse.json({ trip });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
