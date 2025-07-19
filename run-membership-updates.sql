-- Run this script in your Supabase SQL editor to add membership expiry functionality

-- Add membership expiry fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS membership_expiry_date DATE,
ADD COLUMN IF NOT EXISTS membership_start_date DATE;

-- Add membership year field to membership_payments table
ALTER TABLE public.membership_payments 
ADD COLUMN IF NOT EXISTS membership_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW());

-- Create index for membership expiry
CREATE INDEX IF NOT EXISTS idx_users_membership_expiry ON public.users(membership_expiry_date);
CREATE INDEX IF NOT EXISTS idx_membership_payments_year ON public.membership_payments(membership_year);

-- Function to update user membership status when payment is approved
CREATE OR REPLACE FUNCTION update_membership_on_approval()
RETURNS TRIGGER AS $$
BEGIN
    -- If payment is being approved, update user's membership status
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Set membership start date to April 1st of the current year
        UPDATE public.users 
        SET 
            membership_status = 'active',
            membership_start_date = DATE(NEW.membership_year || '-04-01'),
            membership_expiry_date = DATE((NEW.membership_year + 1) || '-03-31')
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for membership approval
DROP TRIGGER IF EXISTS trigger_update_membership_on_approval ON public.membership_payments;
CREATE TRIGGER trigger_update_membership_on_approval 
    AFTER UPDATE ON public.membership_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_membership_on_approval();

-- Function to check and update expired memberships
CREATE OR REPLACE FUNCTION check_expired_memberships()
RETURNS void AS $$
BEGIN
    -- Update users whose membership has expired
    UPDATE public.users 
    SET membership_status = 'expired'
    WHERE membership_expiry_date < CURRENT_DATE 
    AND membership_status = 'active';
END;
$$ language 'plpgsql';

-- Function to get membership status for a user
CREATE OR REPLACE FUNCTION get_user_membership_status(user_uuid UUID)
RETURNS TABLE(
    membership_status VARCHAR(20),
    membership_start_date DATE,
    membership_expiry_date DATE,
    days_remaining INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.membership_status,
        u.membership_start_date,
        u.membership_expiry_date,
        CASE 
            WHEN u.membership_expiry_date IS NOT NULL 
            THEN (u.membership_expiry_date - CURRENT_DATE)::INTEGER
            ELSE NULL
        END as days_remaining,
        CASE 
            WHEN u.membership_status = 'active' AND u.membership_expiry_date >= CURRENT_DATE
            THEN true
            ELSE false
        END as is_active
    FROM public.users u
    WHERE u.id = user_uuid;
END;
$$ language 'plpgsql';

-- Test the functions
SELECT 'Membership functions created successfully!' as status; 