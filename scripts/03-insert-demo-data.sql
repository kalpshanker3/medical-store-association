-- Insert demo admin user
INSERT INTO public.users (
    id, phone, name, age, store_name, location, role, status, membership_status,
    account_number, ifsc, branch, nominee_name, nominee_relation, nominee_phone,
    nominee_account_number, nominee_ifsc, nominee_branch
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '9876543210',
    'प्रशासक',
    35,
    'मुख्य कार्यालय',
    'गोरखपुर',
    'admin',
    'approved',
    'active',
    '1234567890',
    'SBIN0001234',
    'गोरखपुर मुख्य शाखा',
    'सुनीता शर्मा',
    'पत्नी',
    '9876543211',
    '1234567890123',
    'SBIN0001234',
    'गोरखपुर मुख्य शाखा'
) ON CONFLICT (phone) DO NOTHING;

-- Insert demo regular user
INSERT INTO public.users (
    id, phone, name, age, aadhar, store_name, location, gst_number,
    drug_license_number, drug_license_start_date, drug_license_end_date,
    food_license_number, food_license_start_date, food_license_end_date,
    account_number, ifsc, branch, nominee_name, nominee_relation, nominee_phone,
    nominee_account_number, nominee_ifsc, nominee_branch, status, membership_status, role
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    '8765432109',
    'राम प्रसाद शर्मा',
    42,
    '5678-9012-3456',
    'शर्मा मेडिकल',
    'देवरिया',
    'GST987654321',
    'DL987654',
    '2023-01-01',
    '2025-12-31',
    'FL987654',
    '2023-01-01',
    '2025-12-31',
    '9876543210',
    'PNB0002345',
    'देवरिया शाखा',
    'सुमित्रा देवी',
    'पत्नी',
    '8765432110',
    '9876543210987',
    'PNB0002345',
    'देवरिया शाखा',
    'approved',
    'active',
    'user'
) ON CONFLICT (phone) DO NOTHING;

-- Insert more demo users
INSERT INTO public.users (phone, name, age, store_name, location, status, membership_status, role) VALUES
('7654321098', 'मोहन सिंह', 38, 'सिंह मेडिकल', 'कुशीनगर', 'approved', 'active', 'user'),
('6543210987', 'राजेश कुमार', 45, 'कुमार ड्रग्स', 'महराजगंज', 'approved', 'active', 'user'),
('5432109876', 'सुरेश चंद्र', 40, 'चंद्र फार्मेसी', 'बस्ती', 'approved', 'active', 'user'),
('4321098765', 'दिनेश कुमार', 36, 'कुमार मेडिकल', 'सिद्धार्थनगर', 'pending', 'pending', 'user')
ON CONFLICT (phone) DO NOTHING;

-- Insert some demo notifications
INSERT INTO public.notifications (title, message, type, created_by) VALUES
('नई सदस्यता शुल्क दरें', '1 अप्रैल 2024 से सदस्यता शुल्क ₹100 से बढ़कर ₹150 हो जाएगा। कृपया समय पर भुगतान करें।', 'warning', '00000000-0000-0000-0000-000000000001'),
('वार्षिक सभा की सूचना', 'वार्षिक सभा 25 मार्च 2024 को गोरखपुर मुख्यालय में आयोजित होगी। सभी सदस्यों की उपस्थिति आवश्यक है।', 'info', '00000000-0000-0000-0000-000000000001'),
('आपातकालीन सहायता', 'सदस्य राम प्रसाद शर्मा जी की दुर्घटना के कारण उनके परिवार को तत्काल सहायता की आवश्यकता है। कृपया दान करें।', 'emergency', '00000000-0000-0000-0000-000000000001'),
('नए सदस्य स्वागत', 'इस महीने 15 नए सदस्य हमारी संस्था में शामिल हुए हैं। सभी का स्वागत है!', 'success', '00000000-0000-0000-0000-000000000001'),
('लाइसेंस नवीनीकरण अनुस्मारक', 'कृपया अपने ड्रग लाइसेंस और फूड लाइसेंस की समाप्ति तिथि की जांच करें और समय पर नवीनीकरण कराएं।', 'warning', '00000000-0000-0000-0000-000000000001');

-- Insert demo membership payments
INSERT INTO public.membership_payments (user_id, amount, status, payment_date) VALUES
('00000000-0000-0000-0000-000000000002', 100.00, 'approved', NOW() - INTERVAL '30 days'),
((SELECT id FROM public.users WHERE phone = '7654321098'), 100.00, 'pending', NOW() - INTERVAL '5 days'),
((SELECT id FROM public.users WHERE phone = '6543210987'), 100.00, 'approved', NOW() - INTERVAL '15 days');

-- Insert demo donations
INSERT INTO public.donations (donor_id, recipient_name, amount, status, donation_date) VALUES
((SELECT id FROM public.users WHERE phone = '7654321098'), 'स्वर्गीय रामेश्वर प्रसाद परिवार', 500.00, 'approved', NOW() - INTERVAL '10 days'),
((SELECT id FROM public.users WHERE phone = '6543210987'), 'स्वर्गीय श्याम सुंदर परिवार', 750.00, 'pending', NOW() - INTERVAL '3 days');

-- Insert demo accidents
INSERT INTO public.accidents (member_id, accident_type, status, created_by) VALUES
((SELECT id FROM public.users WHERE phone = '8765432109'), 'हृदयाघात', 'active', '00000000-0000-0000-0000-000000000001'),
((SELECT id FROM public.users WHERE phone = '7654321098'), 'कैंसर', 'active', '00000000-0000-0000-0000-000000000001');

-- Insert demo gallery images
INSERT INTO public.gallery (title, image_url, category, uploaded_by) VALUES
('वार्षिक सभा 2023', '/placeholder.svg?height=300&width=400&text=वार्षिक+सभा+2023', 'events', '00000000-0000-0000-0000-000000000001'),
('सदस्य सम्मान समारोह', '/placeholder.svg?height=300&width=400&text=सदस्य+सम्मान+समारोह', 'awards', '00000000-0000-0000-0000-000000000001'),
('दान वितरण कार्यक्रम', '/placeholder.svg?height=300&width=400&text=दान+वितरण+कार्यक्रम', 'charity', '00000000-0000-0000-0000-000000000001'),
('नए सदस्य स्वागत', '/placeholder.svg?height=300&width=400&text=नए+सदस्य+स्वागत', 'members', '00000000-0000-0000-0000-000000000001'),
('स्वास्थ्य शिविर', '/placeholder.svg?height=300&width=400&text=स्वास्थ्य+शिविर', 'health', '00000000-0000-0000-0000-000000000001');
