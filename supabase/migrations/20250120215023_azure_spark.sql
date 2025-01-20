/*
  # Add billing information table

  1. New Tables
    - `billing_info`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `card_last4` (text)
      - `card_brand` (text)
      - `exp_month` (integer)
      - `exp_year` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `billing_info` table
    - Add policies for users to manage their own billing info
*/

CREATE TABLE IF NOT EXISTS billing_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  card_last4 text,
  card_brand text,
  exp_month integer,
  exp_year integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing info"
  ON billing_info FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own billing info"
  ON billing_info FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing info"
  ON billing_info FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);