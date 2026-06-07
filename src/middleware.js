import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const isConfigured =
      supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl.startsWith('http') &&
      supabaseUrl !== 'your-supabase-url';

    if (!isConfigured) {
      // Demo Mode Fallback
      const isDemoAdmin = request.cookies.get('demo_admin')?.value === 'true';
      if (!isDemoAdmin) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return NextResponse.next();
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          cookie: request.headers.get('cookie') ?? '',
        },
      },
    });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Not logged in → redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check role
    const { data: member } = await supabase
      .from('members')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Not an admin → redirect to home
    if (!member || member.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
