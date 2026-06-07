import { supabase } from './supabaseClient';

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

export async function deleteEvent(id) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  return { error };
}

export async function uploadEventFile(file, folder = 'images') {
  if (!supabase) {
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

/** Fetch all events created by a specific member */
export async function fetchMemberEvents(memberId) {
  if (!supabase) {
    const myEvents = demoEvents.filter(e => e.created_by === memberId);
    return { data: myEvents, error: null };
  }
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('created_by', memberId)
    .order('created_at', { ascending: false });
  return { data, error };
}
