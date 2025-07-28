/*
  # Update drafts table to allow null idea_id

  1. Changes
    - Make idea_id column nullable to support manual drafts
    - Update foreign key constraint to handle null values
  
  2. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Make idea_id nullable for manual drafts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drafts' AND column_name = 'idea_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE drafts ALTER COLUMN idea_id DROP NOT NULL;
  END IF;
END $$;