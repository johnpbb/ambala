/*
  # Fix schema issues

  1. Changes
    - Add missing columns to cars table:
      - fuel_type
      - transmission
      - passengers
      - year
    
  2. Notes
    - Adds default values to ensure existing data remains valid
*/

-- Add missing columns to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS fuel_type text DEFAULT 'Petrol',
ADD COLUMN IF NOT EXISTS transmission text DEFAULT 'Automatic',
ADD COLUMN IF NOT EXISTS passengers integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS year integer DEFAULT 2024;

-- Update the Toyota Corolla with proper values
UPDATE cars
SET 
  fuel_type = 'Petrol',
  transmission = 'Automatic',
  passengers = 5,
  year = 2024
WHERE name = 'Toyota Corolla';