import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase admin env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  if (!url.startsWith("https://") || url.includes("your-project")) {
    throw new Error(`Invalid Supabase URL: ${url}. Replace placeholder values in .env.local with your actual Supabase project URL.`);
  }

  if (key.includes("your-service-role") || key.includes("your-anon")) {
    throw new Error("Invalid Supabase service role key. Replace placeholder values in .env.local with your actual Supabase service role key.");
  }

  return createSupabaseClient(
    url,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
