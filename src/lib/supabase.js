import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl !== 'your-supabase-url';

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Auth helpers ─────────────────────────────────────────────

/** Sign in with email + password. Returns { user, member, error } */
export async function signIn(email, password) {
  if (!supabase) {
    // Demo mode login
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

  // Fetch the member's role from the members table
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

// ── Member CRUD helpers ──────────────────────────────────────

/** Fetch all members (admin only) */
export async function fetchMembers() {
  if (!supabase) {
    // Return mock data for demo
    return { data: [
      { id: '1', full_name: 'Alice Smith', email: 'alice@ieee.org', role: 'execom', ieee_member_id: '90001234', department: 'Computer Science', year: '3rd Year' },
      { id: '2', full_name: 'Bob Johnson', email: 'bob@ieee.org', role: 'member', ieee_member_id: '90005678', department: 'Electronics', year: '2nd Year' },
      { id: 'demo-user-id', full_name: 'Demo Admin', email: 'admin@admin.com', role: 'admin', ieee_member_id: '99999999', department: 'Faculty', year: 'Alumni' },
    ], error: null };
  }
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

/** Add a new member */
export async function addMember(memberData) {
  if (!supabase) return { data: { ...memberData, id: Math.random().toString() }, error: null };
  const { data, error } = await supabase
    .from('members')
    .insert([memberData])
    .select()
    .single();
  return { data, error };
}

/** Update a member by id */
export async function updateMember(id, updates) {
  if (!supabase) return { data: { id, ...updates }, error: null };
  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/** Delete a member by id */
export async function deleteMember(id) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', id);
  return { error };
}

// ── Event helpers ────────────────────────────────────────────

const demoEvents = [
  {
    id: 'evt-1',
    title: 'CodeStorm 3.0 — 24-Hour National Hackathon',
    description: 'Build scalable full-stack applications addressing real-world challenges in FinTech, HealthTech, and EdTech. Open to teams of 2–4 across all engineering disciplines.',
    tag: 'hackathon',
    event_date: '2026-06-14T09:00:00Z',
    time_string: '9:00 AM – 9:00 AM +1',
    location: 'Seminar Hall, Block C',
    registration_link: 'https://example.com/register',
    cover_image_url: null,
    document_url: null,
    status: 'published',
    created_by: 'demo-user-id',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-2',
    title: 'Hands-On: Transformer Architectures & Fine-Tuning LLMs',
    description: 'Deep dive into attention mechanisms, tokenizer pipelines, and LoRA-based fine-tuning on custom datasets.',
    tag: 'workshop',
    event_date: '2026-06-21T14:00:00Z',
    time_string: '2:00 PM – 5:30 PM',
    location: 'AI Lab, 2nd Floor',
    registration_link: null,
    cover_image_url: null,
    document_url: null,
    status: 'published',
    created_by: 'demo-user-id',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-3',
    title: 'Guest Lecture: Distributed Systems at Scale',
    description: 'Senior SRE from Google Cloud discusses consensus algorithms, observability patterns, and chaos engineering.',
    tag: 'talk',
    event_date: '2026-06-28T10:30:00Z',
    time_string: '10:30 AM – 12:00 PM',
    location: 'Auditorium',
    registration_link: null,
    cover_image_url: null,
    document_url: null,
    status: 'published',
    created_by: 'demo-user-id',
    created_at: new Date().toISOString(),
  },
  {
    id: 'evt-4',
    title: 'AlgoArena — Competitive Programming Contest',
    description: 'Timed problemset featuring dynamic programming, graph theory, and computational geometry.',
    tag: 'competition',
    event_date: '2026-07-05T18:00:00Z',
    time_string: '6:00 PM – 9:00 PM',
    location: 'Online — HackerRank',
    registration_link: 'https://example.com/algo',
    cover_image_url: null,
    document_url: null,
    status: 'pending',
    created_by: 'demo-user-id',
    created_at: new Date().toISOString(),
  },
];

/** Fetch published events (public pages). Optionally limit count. */
export async function fetchPublishedEvents(limit) {
  if (!supabase) {
    const published = demoEvents.filter(e => e.status === 'published');
    return { data: limit ? published.slice(0, limit) : published, error: null };
  }
  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return { data, error };
}

/** Fetch all events for admin (optionally filter by status) */
export async function fetchAdminEvents(statusFilter) {
  if (!supabase) {
    const list = statusFilter && statusFilter !== 'all'
      ? demoEvents.filter(e => e.status === statusFilter)
      : demoEvents;
    return { data: list, error: null };
  }
  let query = supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  const { data, error } = await query;
  return { data, error };
}

/** Submit a new event request (member only) */
export async function submitEventRequest(eventData) {
  if (!supabase) {
    return { data: { ...eventData, id: 'evt-' + Math.random().toString(36).slice(2, 8), status: 'pending', created_at: new Date().toISOString() }, error: null };
  }
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, status: 'pending' }])
    .select()
    .single();
  return { data, error };
}

/** Update an event (admin) */
export async function updateEvent(id, updates) {
  if (!supabase) {
    return { data: { id, ...updates }, error: null };
  }
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

/** Delete an event (admin) */
export async function deleteEvent(id) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  return { error };
}

/** Upload a file to the event_assets storage bucket */
export async function uploadEventFile(file, folder = 'images') {
  if (!supabase) {
    // Demo mode: return a fake URL
    return { url: URL.createObjectURL(file), key: `${folder}/${file.name}`, error: null };
  }
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
  const { error } = await supabase.storage
    .from('event_assets')
    .upload(fileName, file);
  if (error) return { url: null, key: null, error };
  const { data: urlData } = supabase.storage
    .from('event_assets')
    .getPublicUrl(fileName);
  return { url: urlData.publicUrl, key: fileName, error: null };
}
