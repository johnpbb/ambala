/*
  # Add insert policy for bookings table

  1. Changes
    - Add RLS policy to allow authenticated users to insert their own bookings
  
  2. Security
    - Users can only insert bookings where they are the user_id
    - Maintains existing RLS policies
*/

-- Add insert policy for bookings
CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);