import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Destination } from "@/types/destination";
import {
  getDestinationStatus,
  computeTimeDisplay,
  suggestDurationLabel,
} from "@/lib/time";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const startTime = body.start_time ? new Date(body.start_time) : null;
    const endTime = body.end_time ? new Date(body.end_time) : null;

    let duration = body.duration || null;
    if (!duration && startTime && endTime) {
      duration = suggestDurationLabel(startTime, endTime);
    }

    const status: Destination["status"] = body.status === "Completed" ? "Completed" : "Upcoming";
    const { time_remaining, time_display } = computeTimeDisplay(startTime, endTime, status);

    const { data, error } = await supabase
      .from("destinations")
      .insert({
        company_id: company.id,
        name: body.name,
        type: body.type,
        description: body.description || null,
        photos: body.photos || [],
        cover_photo: body.photos?.[0] || null,
        start_time: body.start_time || null,
        end_time: body.end_time || null,
        duration,
        status,
        order: body.order ?? 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: {
        ...data,
        computed_status: getDestinationStatus(startTime, endTime, status),
        time_remaining,
        time_display,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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
      .select("id")
      .eq("id", user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("destinations")
      .select("*")
      .eq("company_id", company.id)
      .order("order", { ascending: true });

    const { data: destinations, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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

    return NextResponse.json({ data: enriched });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
