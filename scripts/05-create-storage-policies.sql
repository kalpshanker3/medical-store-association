-- Storage policies for file uploads
-- Note: Run these in Supabase Dashboard > Storage > Policies

-- Receipts bucket policies
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can upload receipts" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Anyone can view receipts" ON storage.objects
FOR SELECT USING (bucket_id = 'receipts');

CREATE POLICY "Admins can delete receipts" ON storage.objects
FOR DELETE USING (
    bucket_id = 'receipts' AND
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE phone = current_setting('app.current_user_phone', true) 
        AND role = 'admin'
    )
);

-- Gallery bucket policies
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload to gallery" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE phone = current_setting('app.current_user_phone', true) 
        AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete from gallery" ON storage.objects
FOR DELETE USING (
    bucket_id = 'gallery' AND
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE phone = current_setting('app.current_user_phone', true) 
        AND role = 'admin'
    )
);

-- Documents bucket policies
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (
        SELECT 1 FROM public.users 
        WHERE phone = current_setting('app.current_user_phone', true) 
        AND role = 'admin'
    ))
);
