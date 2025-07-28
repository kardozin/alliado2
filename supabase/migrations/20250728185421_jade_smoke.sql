/*
  # Create drafts table

  1. New Tables
    - `drafts`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, foreign key to ideas)
      - `project_id` (uuid, foreign key to projects)
      - `title` (text)
      - `content` (text)
      - `version` (integer)
      - `analysis` (jsonb, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `drafts` table
    - Add policy for users to manage drafts in their projects
*/

CREATE TABLE IF NOT EXISTS drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  version integer DEFAULT 1,
  analysis jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage drafts in their projects"
  ON drafts
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS drafts_project_id_idx ON drafts(project_id);
CREATE INDEX IF NOT EXISTS drafts_idea_id_idx ON drafts(idea_id);
CREATE INDEX IF NOT EXISTS drafts_updated_at_idx ON drafts(updated_at DESC);
CREATE INDEX IF NOT EXISTS drafts_version_idx ON drafts(version);