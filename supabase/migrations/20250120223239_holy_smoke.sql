/*
  # Add SUVs and 4x4s to car listings

  1. Changes
    - Add new SUVs and 4x4s to the cars table
    - Includes popular models suitable for Fiji's terrain
*/

-- Insert Toyota Land Cruiser Prado
INSERT INTO cars (
  name,
  image,
  price_per_day,
  description,
  fuel_type,
  transmission,
  passengers,
  year
) VALUES (
  'Toyota Land Cruiser Prado',
  'https://images.unsplash.com/photo-1625055930842-b9ad84b7facd?q=80&w=2574&auto=format&fit=crop',
  150.00,
  'The Toyota Land Cruiser Prado is a full-capability SUV that combines luxury with legendary off-road performance. Perfect for exploring Fiji''s rugged terrain and remote beaches.',
  'Diesel',
  'Automatic',
  7,
  2024
);

-- Insert Nissan X-Trail
INSERT INTO cars (
  name,
  image,
  price_per_day,
  description,
  fuel_type,
  transmission,
  passengers,
  year
) VALUES (
  'Nissan X-Trail',
  'https://images.unsplash.com/photo-1609352772910-fe3c7c10d5f8?q=80&w=2574&auto=format&fit=crop',
  120.00,
  'The Nissan X-Trail offers the perfect blend of urban comfort and off-road capability. Ideal for both city driving and adventure trips across Fiji.',
  'Petrol',
  'CVT',
  5,
  2023
);

-- Insert Suzuki Jimny
INSERT INTO cars (
  name,
  image,
  price_per_day,
  description,
  fuel_type,
  transmission,
  passengers,
  year
) VALUES (
  'Suzuki Jimny',
  'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=2574&auto=format&fit=crop',
  90.00,
  'The compact yet capable Suzuki Jimny is perfect for adventurous travelers. Its small size and excellent 4x4 capabilities make it ideal for both city parking and off-road exploration.',
  'Petrol',
  'Automatic',
  4,
  2024
);

-- Insert Mitsubishi Pajero Sport
INSERT INTO cars (
  name,
  image,
  price_per_day,
  description,
  fuel_type,
  transmission,
  passengers,
  year
) VALUES (
  'Mitsubishi Pajero Sport',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2574&auto=format&fit=crop',
  140.00,
  'The Mitsubishi Pajero Sport combines sophisticated styling with powerful performance. Features advanced 4WD technology and spacious interior perfect for family adventures.',
  'Diesel',
  'Automatic',
  7,
  2023
);