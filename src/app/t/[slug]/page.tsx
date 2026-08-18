import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Map } from "lucide-react";
import StatusToggle from "@/components/StatusToggle";

import { Destination } from "@/types/database";

export default async function PublicTripPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!company) {
    notFound();
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
    <div className="flex flex-col flex-1">
      <header className="border-b border-green-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-800">
            TrailShare
          </Link>
          <span className="text-sm text-green-600">Public trip view</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-green-900">
                {company.name}
              </h1>
              <p className="mt-1 text-sm text-green-700/80">
                {total} destinations
              </p>
            </div>
            {company.logo_url && (
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-12 w-12 rounded-full object-cover border border-green-200"
              />
            )}
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
                The company hasn&apos;t added any destinations to this trip yet.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {destinations.map((dest: Destination) => (
                <div
                  key={dest.id}
                  className={`overflow-hidden rounded-xl border bg-white ${
                    dest.status === "Completed"
                      ? "border-green-300"
                      : "border-green-200"
                  }`}
                >
                  {dest.photos.length > 0 && (
                    <div className="grid gap-1 sm:grid-cols-2">
                      {dest.photos.slice(0, 2).map((photo: string, i: number) => (
                        <img
                          key={i}
                          src={photo}
                          alt={dest.name}
                          className="h-56 w-full object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-green-900">
                        {dest.name}
                      </h3>
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {dest.type}
                      </span>
                    </div>
                    {dest.description && (
                      <p className="mt-2 text-sm text-green-700/80">
                        {dest.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-green-600">
                        Duration: {dest.duration}
                      </span>
                      <StatusToggle id={dest.id} status={dest.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-green-200 bg-white/60">
        <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-green-600">
          <Link href="/" className="hover:text-green-800">
            TrailShare
          </Link>{" "}
          — shared trip page
        </div>
      </footer>
    </div>
  );
}
