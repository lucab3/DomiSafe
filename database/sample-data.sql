-- Datos de prueba para DomiSafe
-- Ejecutar después de crear el schema

-- Insertar clientes de prueba
INSERT INTO clients (id, email, password_hash, name, phone, address, latitude, longitude, subscription_type, referral_code) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'maria.garcia@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'María García', '+541123456789', 'Av. Corrientes 1234, CABA', -34.603851, -58.381775, 'premium', 'REFMAR001'),
    ('550e8400-e29b-41d4-a716-446655440002', 'juan.lopez@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Juan López', '+541134567890', 'Av. Santa Fe 2345, CABA', -34.595149, -58.392167, 'basic', 'REFJUA002'),
    ('550e8400-e29b-41d4-a716-446655440003', 'admin@domisafe.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Administrador DomiSafe', '+541145678901', 'Av. Cabildo 3456, CABA', -34.563389, -58.453167, 'vip', 'REFADM003');

-- Marcar el admin como administrador
UPDATE clients SET is_admin = true WHERE email = 'admin@domisafe.com';

-- Insertar empleadas de prueba
INSERT INTO employees (id, email, password_hash, name, phone, date_of_birth, zone, latitude, longitude, photo_url, services_offered, languages, experience_years, hourly_rate, is_active, verification_status, average_rating, total_reviews, availability, current_status) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'rosa.martinez@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Rosa Martínez', '+541156789012', '1985-03-15', 'Palermo', -34.588516, -58.425945, 'https://images.unsplash.com/photo-1494790108755-2616c0763c99?w=400', '{"cleaning", "cooking"}', '{"Español", "Inglés"}', 8, 1200.00, true, 'approved', 4.8, 24, '{"monday": ["09:00-17:00"], "tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"]}', 'available'),
    
    ('660e8400-e29b-41d4-a716-446655440002', 'carmen.rodriguez@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Carmen Rodríguez', '+541167890123', '1978-07-22', 'Recoleta', -34.587776, -58.392759, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', '{"cleaning", "babysitting"}', '{"Español"}', 12, 1100.00, true, 'approved', 4.9, 31, '{"monday": ["08:00-16:00"], "tuesday": ["08:00-16:00"], "wednesday": ["08:00-16:00"], "thursday": ["08:00-16:00"], "friday": ["08:00-16:00"], "saturday": ["09:00-13:00"]}', 'available'),
    
    ('660e8400-e29b-41d4-a716-446655440003', 'lucia.fernandez@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Lucía Fernández', '+541178901234', '1990-11-08', 'Villa Crespo', -34.598678, -58.437917, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', '{"cooking", "elderly_care"}', '{"Español", "Italiano"}', 5, 1300.00, true, 'approved', 4.7, 18, '{"monday": ["10:00-18:00"], "tuesday": ["10:00-18:00"], "wednesday": ["10:00-18:00"], "thursday": ["10:00-18:00"], "friday": ["10:00-18:00"]}', 'available'),
    
    ('660e8400-e29b-41d4-a716-446655440004', 'ana.gomez@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Ana Gómez', '+541189012345', '1982-01-30', 'Belgrano', -34.563389, -58.453167, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', '{"cleaning", "cooking", "event"}', '{"Español", "Portugués"}', 10, 1250.00, true, 'approved', 4.6, 22, '{"tuesday": ["09:00-17:00"], "wednesday": ["09:00-17:00"], "thursday": ["09:00-17:00"], "friday": ["09:00-17:00"], "saturday": ["08:00-14:00"]}', 'working'),
    
    ('660e8400-e29b-41d4-a716-446655440005', 'sofia.torres@email.com', '$2b$12$LQv3c1yqBw2x9a9bG3fELefXXXXXXXXXXXXXXXXXXXXX', 'Sofía Torres', '+541190123456', '1993-05-12', 'San Telmo', -34.615851, -58.372775, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', '{"babysitting", "cleaning"}', '{"Español", "Inglés", "Francés"}', 3, 1150.00, true, 'approved', 5.0, 15, '{"monday": ["14:00-20:00"], "tuesday": ["14:00-20:00"], "wednesday": ["14:00-20:00"], "thursday": ["14:00-20:00"], "friday": ["14:00-20:00"], "saturday": ["09:00-15:00"]}', 'available');

-- Insertar servicios de prueba
INSERT INTO services (id, client_id, employee_id, service_type, service_date, duration_hours, hourly_rate, status, special_requests) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'cleaning', '2024-01-15 09:00:00', 4.0, 1200.00, 'completed', 'Limpieza profunda de cocina y baños'),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'babysitting', '2024-01-20 16:00:00', 6.0, 1100.00, 'completed', 'Cuidado de niña de 5 años'),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 'cooking', '2024-02-01 10:00:00', 3.0, 1250.00, 'confirmed', 'Preparar almuerzo para 6 personas'),
    ('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', null, 'cleaning', '2024-02-15 14:00:00', 4.0, 1200.00, 'requested', 'Limpieza general del hogar');

-- Insertar reseñas de prueba
INSERT INTO reviews (id, service_id, employee_id, client_id, rating, comment, is_visible) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 5, 'Excelente trabajo, muy profesional y puntual. Rosa dejó la casa impecable.', true),
    ('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 5, 'Carmen es fantástica con los niños. Mi hija la adora y siempre quiere que vuelva.', true);

-- Insertar favoritos de prueba
INSERT INTO favorites (client_id, employee_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003'),
    ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002');

-- Insertar mensajes de prueba
INSERT INTO messages (service_id, sender_id, sender_type, message, is_read) VALUES
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'client', 'Hola Ana, ¿podrías llegar 30 minutos antes?', true),
    ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', 'employee', 'Por supuesto, no hay problema. Nos vemos a las 9:30.', true),
    ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'client', 'Perfecto, muchas gracias!', false);

-- Insertar notificaciones de prueba
INSERT INTO notifications (user_id, user_type, title, message, type, is_read) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'client', 'Servicio confirmado', 'Tu servicio con Ana Gómez ha sido confirmado para el 1 de febrero.', 'service_confirmed', true),
    ('660e8400-e29b-41d4-a716-446655440004', 'employee', 'Nuevo servicio asignado', 'Tienes un nuevo servicio asignado para el 1 de febrero.', 'service_assigned', false),
    ('550e8400-e29b-41d4-a716-446655440002', 'client', 'Solicitud pendiente', 'Tu solicitud de servicio está pendiente de asignación.', 'service_pending', false);

-- Insertar un referido de prueba
INSERT INTO referrals (referrer_id, referred_email, referral_code, status, reward_amount) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'amiga@email.com', 'REFMAR001', 'pending', 500.00);