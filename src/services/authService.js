import { supabase } from './supabaseClient';

/** Sign in with email + password. Returns { user, member, error } */
export async function signIn(email, password) {
  if (!supabase) {
    if (email === 'admin@admin.com' && password === 'admin') {
      document.cookie = "demo_admin=true; path=/";
      return { 
        user: { id: 'demo-user-id', email }, 
        member: { id: 'demo-user-id', role: 'admin', full_name: 'Demo Admin' }, 
        error: null 
      };
    }
    return { user: null, member: null, error: { message: 'Invalid demo credentials. Use admin@admin.com / admin' } };
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
  if (!supabase) {
    document.cookie = "demo_admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

/** Get the current authenticated session */
export async function getSession() {
  if (!supabase) {
    const isDemo = typeof document !== 'undefined' && document.cookie.includes('demo_admin=true');
    return isDemo ? { user: { id: 'demo-user-id', email: 'admin@admin.com' } } : null;
  }
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Get the current user's member record (including role) */
export async function getCurrentMember() {
  const session = await getSession();
  if (!session) return null;

  if (!supabase) {
    return { id: 'demo-user-id', role: 'admin', full_name: 'Demo Admin', email: 'admin@admin.com' };
  }

  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('id', session.user.id)
    .single();
  return data;
}
