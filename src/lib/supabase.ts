import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: "${supabaseUrl}". Must be a complete URL like https://your-project-id.supabase.co`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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