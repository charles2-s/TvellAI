import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function AuthLogout() {
  const supabase = await createClient();
  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-full border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
      >
        <LogOut size={14} />
        Log out
      </button>
    </form>
  );
}
