import { supabase } from './supabaseClient';

const demoMembers = [
  { id: '1', full_name: 'Alice Smith', email: 'alice@ieee.org', role: 'execom', ieee_member_id: '90001234', department: 'Computer Science', year: '3rd Year' },
  { id: '2', full_name: 'Bob Johnson', email: 'bob@ieee.org', role: 'member', ieee_member_id: '90005678', department: 'Electronics', year: '2nd Year' },
  { id: 'demo-user-id', full_name: 'Demo Admin', email: 'admin@admin.com', role: 'admin', ieee_member_id: '99999999', department: 'Faculty', year: 'Alumni' },
];

/** Fetch all members (admin only) */
export async function fetchMembers() {
  if (!supabase) {
    return { data: [...demoMembers], error: null };
  }
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

/** Add a new member using the secure API route */
export async function addMember(memberData) {
  try {
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    });
    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: new Error(data.error || 'Failed to create user') };
    }
    
    // In mock mode, update the local array so it persists in memory
    if (!supabase) {
      demoMembers.unshift(data.memberData);
    }
    
    return { data, error: null }; // Returns { user, memberData, password }
  } catch (err) {
    return { data: null, error: err };
  }
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
