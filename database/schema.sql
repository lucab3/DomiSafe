-- DomiSafe Database Schema
-- Ejecutar este script en Supabase SQL Editor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Tabla de clientes/familias
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    subscription_type VARCHAR(20) DEFAULT 'basic' CHECK (subscription_type IN ('basic', 'premium', 'vip')),
    subscription_end_date TIMESTAMP,
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES clients(id),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empleadas domésticas
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    dni VARCHAR(20),
    address TEXT,
    zone VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    photo_url TEXT,
    services_offered TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] DEFAULT '{"Español"}',
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    average_rating DECIMAL(3, 2) DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    availability JSONB DEFAULT '{}',
    documents JSONB DEFAULT '{}',
    emergency_contact JSONB DEFAULT '{}',
    qr_code TEXT,
    current_status VARCHAR(20) DEFAULT 'available' CHECK (current_status IN ('available', 'working', 'unavailable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('cleaning', 'cooking', 'babysitting', 'elderly_care', 'event', 'other')),
    service_date TIMESTAMP NOT NULL,
    duration_hours DECIMAL(3, 1) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (duration_hours * hourly_rate) STORED,
    commission_amount DECIMAL(10, 2) GENERATED ALWAYS AS (duration_hours * hourly_rate * 0.20) STORED,
    status VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    special_requests TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reseñas/calificaciones
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(service_id, client_id)
);

-- Tabla de mensajes/chat
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('client', 'employee')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de favoritos
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(client_id, employee_id)
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('client', 'employee')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de referidos
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    referred_email VARCHAR(255) NOT NULL,
    referral_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    reward_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabla de configuración del sistema
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES clients(id)
);

-- Función para calcular distancia entre dos puntos
CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
RETURNS float AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * 
            cos(radians(lat2)) * 
            cos(radians(lon2) - radians(lon1)) + 
            sin(radians(lat1)) * 
            sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Función para buscar empleadas cerca de una ubicación
CREATE OR REPLACE FUNCTION employees_near_location(lat float, lng float, radius_km float DEFAULT 10)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    phone VARCHAR,
    zone VARCHAR,
    photo_url TEXT,
    services_offered TEXT[],
    languages TEXT[],
    experience_years INTEGER,
    hourly_rate DECIMAL,
    average_rating DECIMAL,
    total_reviews INTEGER,
    current_status VARCHAR,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.name,
        e.phone,
        e.zone,
        e.photo_url,
        e.services_offered,
        e.languages,
        e.experience_years,
        e.hourly_rate,
        e.average_rating,
        e.total_reviews,
        e.current_status,
        ROUND(calculate_distance(lat, lng, e.latitude::float, e.longitude::float)::numeric, 2) as distance_km
    FROM employees e
    WHERE 
        e.is_active = true 
        AND e.verification_status = 'approved'
        AND e.latitude IS NOT NULL 
        AND e.longitude IS NOT NULL
        AND calculate_distance(lat, lng, e.latitude::float, e.longitude::float) <= radius_km
    ORDER BY distance_km ASC, e.average_rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas relevantes
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Función para actualizar rating promedio de empleada
CREATE OR REPLACE FUNCTION update_employee_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE employees
    SET 
        average_rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE employee_id = COALESCE(NEW.employee_id, OLD.employee_id)
            AND is_visible = true
        ), 5.0),
        total_reviews = COALESCE((
            SELECT COUNT(*)
            FROM reviews
            WHERE employee_id = COALESCE(NEW.employee_id, OLD.employee_id)
            AND is_visible = true
        ), 0)
    WHERE id = COALESCE(NEW.employee_id, OLD.employee_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar rating cuando se inserta/actualiza/elimina una reseña
CREATE TRIGGER update_employee_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE PROCEDURE update_employee_rating();

-- Insertar configuraciones del sistema por defecto
INSERT INTO system_settings (key, value, description) VALUES
    ('show_employees_to_clients', 'true', 'Mostrar empleadas disponibles a los clientes'),
    ('allow_client_reviews', 'true', 'Permitir reseñas de clientes'),
    ('max_employees_per_zone', '50', 'Máximo de empleadas por zona'),
    ('commission_rate', '0.20', 'Tasa de comisión de la plataforma'),
    ('referral_reward', '500', 'Recompensa por referido (en pesos)'),
    ('app_maintenance_mode', 'false', 'Modo mantenimiento de la aplicación');

-- Índices para optimizar consultas
CREATE INDEX idx_employees_location ON employees(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_employees_zone ON employees(zone);
CREATE INDEX idx_employees_rating ON employees(average_rating DESC);
CREATE INDEX idx_services_date ON services(service_date);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_employee ON services(employee_id);
CREATE INDEX idx_services_client ON services(client_id);
CREATE INDEX idx_reviews_employee ON reviews(employee_id);
CREATE INDEX idx_reviews_visible ON reviews(is_visible);
CREATE INDEX idx_notifications_user ON notifications(user_id, user_type);
CREATE INDEX idx_messages_service ON messages(service_id);

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Las políticas específicas se configurarán según los requerimientos de autenticación