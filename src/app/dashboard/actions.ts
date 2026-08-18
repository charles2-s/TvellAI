"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteDestination(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .single();

  if (!company || company.id !== user.id) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", id)
    .eq("company_id", company.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
