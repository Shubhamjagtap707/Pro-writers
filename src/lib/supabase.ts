import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgfxpdxzeszmanszough.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZnhwZHh6ZXN6bWFuc3pvdWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NjA3OTYsImV4cCI6MjEwNDUzNjc5Nn0.V3a1bPHsPFREaIi_d9lsya9iL32bgWz7hraYBNEO3k8';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key are required. Please ensure they are set in your .env.local file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
