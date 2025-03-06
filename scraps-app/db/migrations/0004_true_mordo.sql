-- Add a new column with the correct type
ALTER TABLE user_inventory ADD COLUMN user_id_text TEXT;

-- Copy existing integer user IDs into the new text column
UPDATE user_inventory SET user_id_text = user_id::TEXT;

-- Drop the old column
ALTER TABLE user_inventory DROP COLUMN user_id;

-- Rename the new column to match the old name
ALTER TABLE user_inventory RENAME COLUMN user_id_text TO user_id;