/*
  # Create publications table

  1. New Tables
    - `publications`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `title` (text)
      - `content` (text)
      - `platform` (text)
      - `published_at` (timestamp)
      - `analysis` (jsonb)
      - `performance` (jsonb, nullable)

  2. Security
    - Enable RLS on `publications` table
    - Add policy for users to manage publications in their projects
*/

CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  platform text DEFAULT '',
  published_at timestamptz DEFAULT now(),
  analysis jsonb DEFAULT '{}'::jsonb,
  performance jsonb
);

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage publications in their projects"
  ON publications
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
CREATE INDEX IF NOT EXISTS publications_project_id_idx ON publications(project_id);
CREATE INDEX IF NOT EXISTS publications_published_at_idx ON publications(published_at DESC);
CREATE INDEX IF NOT EXISTS publications_platform_idx ON publications(platform);