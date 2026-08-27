import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      email,
      password,
      accountType,
      website,
      logoUrl,
    } = body;

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
          account_type: accountType || "company",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const companyPayload: Record<string, unknown> = {
        id: data.user.id,
        name,
        slug,
      };

      if (accountType) {
        companyPayload.account_type = accountType;
      }
      if (website !== undefined) {
        companyPayload.website = website;
      }
      if (logoUrl !== undefined) {
        companyPayload.logo_url = logoUrl;
      }

      const { error: companyError } = await supabase
        .from("companies")
        .insert(companyPayload);

      if (companyError) {
        console.error("company insert error:", companyError);
        return NextResponse.json(
          { error: companyError.message },
          { status: 400 }
        );
      }

      const { error: tripError } = await supabase
        .from("trips")
        .insert({
          slug,
          name,
          company_id: data.user.id,
        });

      if (tripError) {
        console.error("trip creation error:", tripError);
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
