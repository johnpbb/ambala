/*
  # Initial Schema Setup
  
  1. Tables Created:
    - cars
      - Basic car information including pricing
    - bookings
      - Rental booking records with payment info
    
  2. Security:
    - RLS enabled on all tables
    - Policies for user access control
*/

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  image text,
  price_per_day decimal NOT NULL,
  description text,
  available boolean DEFAULT true
);

-- Create bookings table  
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  car_id uuid REFERENCES cars(id),
  user_id uuid REFERENCES auth.users(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_amount decimal NOT NULL,
  payment_id text,
  payment_method text,
  status text DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for cars table
CREATE POLICY "Cars are viewable by everyone" 
  ON cars FOR SELECT 
  USING (true);

-- Policies for bookings table
CREATE POLICY "Users can view their own bookings" 
  ON bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);