/*
  # Fix billing info table and policies

  1. Changes
    - Create billing_info table if it doesn't exist
    - Add proper RLS policies for billing_info table
    - Add single row constraint for billing info

  2. Security
    - Enable RLS
    - Users can only view/modify their own billing info
    - Each user can only have one billing info record
*/

-- Create billing_info table if it doesn't exist
CREATE TABLE IF NOT EXISTS billing_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  card_last4 text NOT NULL,
  card_brand text NOT NULL,
  exp_month integer NOT NULL,
  exp_year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own billing info" ON billing_info;
DROP POLICY IF EXISTS "Users can insert their own billing info" ON billing_info;
DROP POLICY IF EXISTS "Users can update their own billing info" ON billing_info;

-- Create new policies
CREATE POLICY "Users can view their own billing info"
  ON billing_info FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing info"
  ON billing_info FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing info"
  ON billing_info FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_billing_info_updated_at
    BEFORE UPDATE ON billing_info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();