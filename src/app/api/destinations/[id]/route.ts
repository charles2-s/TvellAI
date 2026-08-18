import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  if (body.duration) updates.duration = body.duration;
  if (body.photos) updates.photos = body.photos;

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

  return NextResponse.json({ data });
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
