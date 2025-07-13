-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can do everything on users" ON public.users;

DROP POLICY IF EXISTS "Users can view their own payments" ON public.membership_payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.membership_payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.membership_payments;

DROP POLICY IF EXISTS "Users can view donations" ON public.donations;
DROP POLICY IF EXISTS "Users can insert donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;

DROP POLICY IF EXISTS "Everyone can view accidents" ON public.accidents;
DROP POLICY IF EXISTS "Admins can manage accidents" ON public.accidents;

DROP POLICY IF EXISTS "Everyone can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;

DROP POLICY IF EXISTS "Everyone can view gallery" ON public.gallery;
DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;

DROP POLICY IF EXISTS "Anyone can insert OTP" ON public.otp_verifications;
DROP POLICY IF EXISTS "Anyone can view their OTP" ON public.otp_verifications;
DROP POLICY IF EXISTS "Anyone can update OTP" ON public.otp_verifications;

-- RLS Policies for users table
CREATE POLICY "Enable read access for all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for registration" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (phone = current_setting('app.current_user_phone', true));

CREATE POLICY "Admins can update any user" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

-- RLS Policies for membership_payments
CREATE POLICY "Users can view own payments" ON public.membership_payments
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true)
        )
        OR EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

CREATE POLICY "Users can insert own payments" ON public.membership_payments
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true)
        )
    );

CREATE POLICY "Admins can manage payments" ON public.membership_payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

-- RLS Policies for donations
CREATE POLICY "Everyone can view donations" ON public.donations
    FOR SELECT USING (true);

CREATE POLICY "Users can insert donations" ON public.donations
    FOR INSERT WITH CHECK (
        donor_id IN (
            SELECT id FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true)
        )
    );

CREATE POLICY "Admins can manage donations" ON public.donations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

-- RLS Policies for accidents
CREATE POLICY "Everyone can view accidents" ON public.accidents
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage accidents" ON public.accidents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

-- RLS Policies for notifications
CREATE POLICY "Everyone can view notifications" ON public.notifications
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

-- RLS Policies for gallery
CREATE POLICY "Everyone can view gallery" ON public.gallery
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery" ON public.gallery
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE phone = current_setting('app.current_user_phone', true) 
            AND role = 'admin'
        )
    );

-- RLS Policies for OTP (more permissive for authentication)
CREATE POLICY "Anyone can manage OTP" ON public.otp_verifications
    FOR ALL USING (true);
