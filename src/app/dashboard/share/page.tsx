import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Share2, Copy, CheckCircle2 } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default async function SharePage() {
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

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/t/${company.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-bold text-green-900">Share your trip</h1>
      <p className="mt-1 text-sm text-green-700/80">
        Give this link to your travelers. No login required.
      </p>

      <div className="mt-8 rounded-xl border border-green-200 bg-white p-6">
        <label className="block text-sm font-medium text-green-900">
          Your public trip link
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          />
          <CopyButton text={url} />
        </div>

        <div className="mt-6 flex justify-center">
          <div className="rounded-xl border border-green-200 bg-white p-4">
            <img src={qrUrl} alt="QR code" width={180} height={180} />
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-green-600">
          Scan this QR code to open the trip page on a mobile device.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-green-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-green-900">
          How it works
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-green-700/80">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800">
              1
            </span>
            Share the link above with your travelers via email, message, or QR code.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800">
              2
            </span>
            Travelers open the link and see all your destinations.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-200 text-xs font-bold text-green-800">
              3
            </span>
            Both you and your travelers can mark destinations as completed.
          </li>
        </ul>
      </div>
    </div>
  );
}
