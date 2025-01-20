/*
  # Add sample bookings

  1. New Data
    - Past booking (completed 2 weeks ago)
    - Current booking (started yesterday, ends next week)
    - Future booking (starts next month)
    
  2. Security
    - No changes to security policies
*/

-- Get the first car's ID
DO $$ 
DECLARE
  car_id uuid;
  user_id uuid;
BEGIN
  -- Get the first car
  SELECT id INTO car_id FROM cars LIMIT 1;
  
  -- Get the first user
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  
  -- Past booking (2 weeks ago)
  INSERT INTO bookings (
    car_id,
    user_id,
    start_date,
    end_date,
    total_amount,
    payment_method,
    status,
    created_at
  ) VALUES (
    car_id,
    user_id,
    CURRENT_DATE - INTERVAL '14 days',
    CURRENT_DATE - INTERVAL '10 days',
    300.00,
    'paypal',
    'completed',
    CURRENT_TIMESTAMP - INTERVAL '14 days'
  );

  -- Current booking (started yesterday, ends next week)
  INSERT INTO bookings (
    car_id,
    user_id,
    start_date,
    end_date,
    total_amount,
    payment_method,
    status,
    created_at
  ) VALUES (
    car_id,
    user_id,
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '6 days',
    525.00,
    'paypal',
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '7 days'
  );

  -- Future booking (next month)
  INSERT INTO bookings (
    car_id,
    user_id,
    start_date,
    end_date,
    total_amount,
    payment_method,
    status,
    created_at
  ) VALUES (
    car_id,
    user_id,
    CURRENT_DATE + INTERVAL '30 days',
    CURRENT_DATE + INTERVAL '35 days',
    375.00,
    'mpesa',
    'confirmed',
    CURRENT_TIMESTAMP - INTERVAL '1 day'
  );
END $$;