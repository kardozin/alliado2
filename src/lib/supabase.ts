import { createClient } from '@supabase/supabase-js';

let supabase: any;
let isSupabaseConfigured = false;

async function initSupabase() {
  try {
    const res = await fetch('/api/supabase-config');
    if (!res.ok) throw new Error('Missing config');
    const { url, anonKey } = await res.json();

    if (!url || !anonKey) throw new Error('Missing config');

    // Validate URL format
    new URL(url);

    supabase = createClient(url, anonKey);
    isSupabaseConfigured = true;
  } catch (error) {
    console.error('Missing Supabase environment variables. Please configure them on the server.');

    // Create a mock client that will show helpful error messages
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase no está configurado. Contacta al administrador.' } }),
        signUp: () => Promise.resolve({ error: { message: 'Supabase no está configurado. Contacta al administrador.' } }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase no está configurado' } }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase no está configurado' } }) }) }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase no está configurado' } }) })
      })
    };
  }
}

await initSupabase();

export { supabase, isSupabaseConfigured };

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
          settings: any;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          created_at?: string;
          updated_at?: string;
          settings: any;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
          settings?: any;
        };
      };
      ideas: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          category: string;
          source: string;
          source_data: string | null;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description: string;
          category: string;
          source: string;
          source_data?: string | null;
          created_at?: string;
          status: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string;
          category?: string;
          source?: string;
          source_data?: string | null;
          created_at?: string;
          status?: string;
        };
      };
      drafts: {
        Row: {
          id: string;
          idea_id: string;
          project_id: string;
          title: string;
          content: string;
          version: number;
          analysis: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          project_id: string;
          title: string;
          content: string;
          version: number;
          analysis?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          idea_id?: string;
          project_id?: string;
          title?: string;
          content?: string;
          version?: number;
          analysis?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      publications: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          content: string;
          platform: string;
          published_at: string;
          analysis: any;
          performance: any | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          content: string;
          platform: string;
          published_at: string;
          analysis: any;
          performance?: any | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          content?: string;
          platform?: string;
          published_at?: string;
          analysis?: any;
          performance?: any | null;
        };
      };
    };
  };
};