import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, full_name, ieee_member_id, role, department, year, phone } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Generate random 10-character password
    const password = Math.random().toString(36).slice(2, 12);

    // MOCK MODE FALLBACK
    if (!supabaseUrl || !serviceRoleKey || supabaseUrl === "your-supabase-url") {
      // Return a simulated success response with a fake ID
      const fakeId = "usr-" + Math.random().toString(36).slice(2, 8);
      return NextResponse.json({
        user: { id: fakeId, email },
        memberData: { id: fakeId, full_name, email, ieee_member_id, role, department, year, phone },
        password,
      });
    }

    // REAL MODE
    const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Create Auth User
    const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Insert into Members table
    const { data: memberData, error: memberError } = await adminAuthClient
      .from("members")
      .insert([
        {
          id: authData.user.id,
          email,
          full_name,
          ieee_member_id,
          role,
          department,
          year,
          phone,
        },
      ])
      .select()
      .single();

    if (memberError) {
      // Cleanup auth user if member insert fails
      await adminAuthClient.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: memberError.message }, { status: 400 });
    }

    return NextResponse.json({ user: authData.user, memberData, password });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
