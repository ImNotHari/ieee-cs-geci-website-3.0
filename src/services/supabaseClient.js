import { createClient } from '@insforge/sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl !== 'your-supabase-url';

export const supabase = isConfigured
  ? createClient({ baseUrl: supabaseUrl, anonKey: supabaseAnonKey })
  : null;
