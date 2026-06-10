import { NextResponse } from 'next/server';
import { createClient } from '@insforge/sdk';

/**
 * Role-based route protection middleware.
 *
 * /admin/*  → requires role === 'admin'
 * /member/* → requires any authenticated member (admin, execom, or member)
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isMemberRoute = pathname.startsWith('/member');

  if (!isAdminRoute && !isMemberRoute) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    supabaseUrl !== 'your-supabase-url';

  // ── Demo Mode Fallback ────────────────────────────────────
  if (!isConfigured) {
    const isDemoAdmin = request.cookies.get('demo_admin')?.value === 'true';
    const isDemoMember = request.cookies.get('demo_member')?.value === 'true';
    if (!isDemoAdmin && !isDemoMember) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Admin trying to access anywhere is fine
    // Member trying to access /admin -> deny
    if (isDemoMember && isAdminRoute) {
      return NextResponse.redirect(new URL('/member/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // ── Production: Supabase Auth ─────────────────────────────
  const supabase = createClient({
    baseUrl: supabaseUrl,
    anonKey: supabaseAnonKey,
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

  // Fetch member role
  const { data: member } = await supabase
    .from('members')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!member) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ── Role Guards ───────────────────────────────────────────
  if (isAdminRoute && member.role !== 'admin') {
    // Non-admins trying to access /admin → redirect to member dashboard
    return NextResponse.redirect(new URL('/member/dashboard', request.url));
  }

  if (isMemberRoute && !['admin', 'execom', 'member'].includes(member.role)) {
    // Unknown role → redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
};
