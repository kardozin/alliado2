import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In production, show a user-friendly message instead of throwing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify.');
  
  // Create a mock client that will show helpful error messages
  export const supabase = {
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
  } as any;
} else {
  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    throw new Error(`Invalid VITE_SUPABASE_URL format: "${supabaseUrl}". Must be a complete URL like https://your-project-id.supabase.co`);
  }

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}

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