/*
  # Create ideas table

  1. New Tables
    - `ideas`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `source` (text)
      - `source_data` (text, nullable)
      - `created_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on `ideas` table
    - Add policy for users to manage ideas in their projects
*/

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT '',
  source text DEFAULT 'direct',
  source_data text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'captured'
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage ideas in their projects"
  ON ideas
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
CREATE INDEX IF NOT EXISTS ideas_project_id_idx ON ideas(project_id);
CREATE INDEX IF NOT EXISTS ideas_created_at_idx ON ideas(created_at DESC);
CREATE INDEX IF NOT EXISTS ideas_status_idx ON ideas(status);