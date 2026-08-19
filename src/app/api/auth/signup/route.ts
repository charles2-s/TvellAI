import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, email, password } = body;

    if (!name || !slug || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          slug,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const { error: companyError } = await supabase
        .from("companies")
        .insert({
          id: data.user.id,
          name,
          slug,
        });

      if (companyError) {
        return NextResponse.json(
          { error: companyError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
