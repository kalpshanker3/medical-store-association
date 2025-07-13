-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accidents_updated_at BEFORE UPDATE ON public.accidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired OTPs
CREATE OR REPLACE FUNCTION clean_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM public.otp_verifications 
    WHERE expires_at < NOW() OR verified = true;
END;
$$ language 'plpgsql';

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE(
    total_users bigint,
    active_members bigint,
    pending_registrations bigint,
    total_payments numeric,
    total_donations numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.users) as total_users,
        (SELECT COUNT(*) FROM public.users WHERE membership_status = 'active') as active_members,
        (SELECT COUNT(*) FROM public.users WHERE status = 'pending') as pending_registrations,
        (SELECT COALESCE(SUM(amount), 0) FROM public.membership_payments WHERE status = 'approved') as total_payments,
        (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE status = 'approved') as total_donations;
END;
$$ language 'plpgsql';
