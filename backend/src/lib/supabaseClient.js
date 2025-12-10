import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

/**
 * Supabase client configured with service role key
 * This client has admin privileges and should only be used on the backend
 * 
 * SECURITY NOTE: Never expose this client or its key to the frontend
 */
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

console.log('✅ Supabase client initialized');

