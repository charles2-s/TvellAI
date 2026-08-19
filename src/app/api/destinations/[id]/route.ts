import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getDestinationStatus,
  computeTimeDisplay,
  suggestDurationLabel,
} from "@/lib/time";
import { Destination } from "@/types/destination";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.status) {
    updates.status = body.status;
    updates.completed_at = body.status === "Completed" ? new Date().toISOString() : null;
  }
  if (body.name) updates.name = body.name;
  if (body.type) updates.type = body.type;
  if (body.description !== undefined) updates.description = body.description;
  if (body.photos) updates.photos = body.photos;
  if (body.photos?.[0]) updates.cover_photo = body.photos[0];
  if (body.start_time !== undefined) updates.start_time = body.start_time;
  if (body.end_time !== undefined) updates.end_time = body.end_time;

  if (body.start_time && body.end_time) {
    const start = new Date(body.start_time);
    const end = new Date(body.end_time);
    if (end >= start) {
      updates.duration = suggestDurationLabel(start, end);
    }
  }

  const isStatusOnly = Object.keys(updates).every(
    (key) => key === "status" || key === "completed_at"
  );

  if (!isStatusOnly) {
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
      .single();

    if (!company || company.id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const startTime = data.start_time ? new Date(data.start_time) : null;
  const endTime = data.end_time ? new Date(data.end_time) : null;
  const status = getDestinationStatus(startTime, endTime, data.status);
  const { time_remaining, time_display } = computeTimeDisplay(startTime, endTime, status);

  return NextResponse.json({
    data: {
      ...data,
      computed_status: status,
      time_remaining,
      time_display,
    },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    .single();

  if (!company || company.id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", id)
    .eq("company_id", company.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const startTime = data.start_time ? new Date(data.start_time) : null;
  const endTime = data.end_time ? new Date(data.end_time) : null;
  const status = getDestinationStatus(startTime, endTime, data.status);
  const { time_remaining, time_display } = computeTimeDisplay(startTime, endTime, status);

  return NextResponse.json({
    data: {
      ...data,
      computed_status: status,
      time_remaining,
      time_display,
    },
  });
}
