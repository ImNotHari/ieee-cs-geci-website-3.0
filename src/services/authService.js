import { supabase } from './supabaseClient';

/** Sign in with email + password. Returns { user, member, error } */
export async function signIn(email, password) {
  const isDev = process.env.NODE_ENV === 'development';
  if (!supabase && isDev) {
    if (email === 'admin@admin.com' && password === 'admin') {
      document.cookie = "demo_admin=true; path=/";
      return { 
        user: { id: 'demo-user-id', email }, 
        member: { id: 'demo-user-id', role: 'admin', full_name: 'Demo Admin' }, 
        error: null 
      };
    }
    if (email === 'member@member.com' && password === 'member') {
      document.cookie = "demo_member=true; path=/";
      return { 
        user: { id: 'demo-member-id', email }, 
        member: { id: 'demo-member-id', role: 'member', full_name: 'Demo Member', department: 'Computer Science', year: '3rd Year' }, 
        error: null 
      };
    }
    return { user: null, member: null, error: { message: 'Invalid demo credentials. Use admin@admin.com / admin OR member@member.com / member' } };
  }

  if (!supabase) {
    return { user: null, member: null, error: { message: 'Authentication is not configured.' } };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, member: null, error };

  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return { user: data.user, member, error: memberError };
}

/** Sign out the current user */
export async function signOut() {
  const isDev = process.env.NODE_ENV === 'development';
  if (!supabase && isDev) {
    document.cookie = "demo_admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "demo_member=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return { error: null };
  }
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Get the current authenticated session */
export async function getSession() {
  const isDev = process.env.NODE_ENV === 'development';
  if (!supabase && isDev) {
    const isAdmin = typeof document !== 'undefined' && document.cookie.includes('demo_admin=true');
    const isMember = typeof document !== 'undefined' && document.cookie.includes('demo_member=true');
    if (isAdmin) return { user: { id: 'demo-user-id', email: 'admin@admin.com' } };
    if (isMember) return { user: { id: 'demo-member-id', email: 'member@member.com' } };
    return null;
  }
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Get the current user's member record (including role) */
export async function getCurrentMember() {
  const session = await getSession();
  if (!session) return null;

  const isDev = process.env.NODE_ENV === 'development';
  if (!supabase && isDev) {
    const isAdmin = typeof document !== 'undefined' && document.cookie.includes('demo_admin=true');
    if (isAdmin) return { id: 'demo-user-id', role: 'admin', full_name: 'Demo Admin', email: 'admin@admin.com', department: 'IT', year: '4th Year' };
    return { id: 'demo-member-id', role: 'member', full_name: 'Demo Member', email: 'member@member.com', department: 'Computer Science', year: '3rd Year' };
  }

  if (!supabase) return null;

  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('id', session.user.id)
    .single();
  return data;
}
