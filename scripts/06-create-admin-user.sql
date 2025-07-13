-- Create admin user for Kalp
-- This script creates an admin user with the specified details

-- First, check if user already exists
DO $$
BEGIN
    -- Check if user with phone 9936460026 already exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE phone = '9936460026') THEN
        -- Insert new admin user
        INSERT INTO public.users (
            phone,
            name,
            status,
            membership_status,
            role,
            created_at,
            updated_at
        ) VALUES (
            '9936460026',
            'Kalp',
            'approved',
            'active',
            'admin',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Admin user Kalp created successfully with phone: 9936460026';
    ELSE
        -- Update existing user to admin
        UPDATE public.users 
        SET 
            name = 'Kalp',
            status = 'approved',
            membership_status = 'active',
            role = 'admin',
            updated_at = NOW()
        WHERE phone = '9936460026';
        
        RAISE NOTICE 'Existing user updated to admin: Kalp (9936460026)';
    END IF;
END $$;

-- Verify the admin user was created/updated
SELECT 
    id,
    name,
    phone,
    status,
    membership_status,
    role,
    created_at,
    updated_at
FROM public.users 
WHERE phone = '9936460026';

-- Show all admin users
SELECT 
    name,
    phone,
    status,
    role,
    created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at DESC; 