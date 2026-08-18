import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, GripVertical, CheckCircle2, Circle, Map } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

export default async function DashboardPage() {
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

  if (!company) {
    redirect("/login");
  }

  const { data: destinations } = await supabase
    .from("destinations")
    .select("*")
    .eq("company_id", company.id)
    .order("order", { ascending: true });

  const total = destinations?.length ?? 0;
  const completed = destinations?.filter((d) => d.status === "Completed").length ?? 0;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Your trip</h1>
          <p className="mt-1 text-sm text-green-700/80">
            Manage destinations and share your itinerary.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
        >
          <Plus size={16} />
          Add destination
        </Link>
      </div>

      {total > 0 && (
        <div className="mt-8 rounded-xl border border-green-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-green-900">
              {completed} of {total} completed
            </span>
            <span className="text-green-600">{progress}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-green-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!destinations || destinations.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-green-300 bg-white p-12 text-center">
          <Map className="mx-auto h-10 w-10 text-green-400" />
          <h3 className="mt-4 text-lg font-semibold text-green-900">
            No destinations yet
          </h3>
          <p className="mt-2 text-sm text-green-700/80">
            Start building your itinerary by adding your first destination.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            <Plus size={16} />
            Add destination
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className={`flex items-start gap-4 rounded-xl border bg-white p-4 ${
                dest.status === "Completed"
                  ? "border-green-300 bg-green-50/40"
                  : "border-green-200"
              }`}
            >
              <div className="mt-1 text-green-400">
                <GripVertical size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-green-900 truncate">
                    {dest.name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      dest.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-sand-200 text-sand-800"
                    }`}
                  >
                    {dest.status === "Completed" ? (
                      <CheckCircle2 size={12} className="mr-1" />
                    ) : (
                      <Circle size={12} className="mr-1" />
                    )}
                    {dest.status}
                  </span>
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    {dest.type}
                  </span>
                </div>
                {dest.description && (
                  <p className="mt-1 text-sm text-green-700/80 line-clamp-2">
                    {dest.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-green-600">{dest.duration}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/${dest.id}/edit`}
                  className="rounded-lg border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                >
                  Edit
                </Link>
                <DeleteButton id={dest.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
