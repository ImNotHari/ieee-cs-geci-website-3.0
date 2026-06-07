import { supabase } from './supabaseClient';

/** Fetch all members (admin only) */
export async function fetchMembers() {
  if (!supabase) {
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
