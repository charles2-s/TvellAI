import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogOut, Plus, Share2, Map } from "lucide-react";

import { signOut } from "@/app/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .single();

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-green-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold text-green-800">
              TrailShare
            </Link>
            {company && (
              <span className="hidden sm:inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                {company.name}
              </span>
            )}
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/dashboard/share"
              className="flex items-center gap-1.5 rounded-full border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
            >
              <Share2 size={14} />
              Share
            </Link>
            <Link
              href="/dashboard/new"
              className="flex items-center gap-1.5 rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-800"
            >
              <Plus size={14} />
              Add destination
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
              >
                <LogOut size={14} />
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
