// Helper functions and services - NOT a serverless function
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Auth Helper Functions
const AuthHelpers = {
  async findUserByEmail(email) {
    // Buscar usuario en clientes
    let { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (client) {
      return { ...client, user_type: 'client' };
    }

    // Buscar en empleadas
    let { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();
    
    if (employee) {
      return { ...employee, user_type: 'employee' };
    }

    return null;
  },

  async createUser(userData, userType) {
    const newUserData = {
      email: userData.email,
      password_hash: userData.password, // Sin bcrypt para demo
      name: userData.name,
      phone: userData.phone,
      is_active: userType === 'client',
      created_at: new Date().toISOString(),
      ...userData
    };

    // Eliminar campos que no van en la BD
    delete newUserData.password;
    delete newUserData.confirmPassword;
    delete newUserData.user_type;

    if (userType === 'employee') {
      newUserData.verification_status = 'pending';
      newUserData.average_rating = 5.0;
      newUserData.total_reviews = 0;
    } else {
      newUserData.subscription_type = 'basic';
      newUserData.referral_code = `REF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    }

    const tableName = userType === 'client' ? 'clients' : 'employees';
    const { data: newUser, error } = await supabase
      .from(tableName)
      .insert([newUserData])
      .select()
      .single();

    if (error) throw error;

    return { ...newUser, user_type: userType };
  },

  generateToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
};

// Employee Helper Functions
const EmployeeHelpers = {
  async findAll(filters = {}) {
    const { zone, services, min_rating, latitude, longitude, radius = 10 } = filters;

    let query = supabase
      .from('employees')
      .select(`
        *,
        reviews (
          rating,
          comment,
          created_at
        )
      `)
      .eq('is_active', true)
      .eq('verification_status', 'approved');

    if (zone) {
      query = query.ilike('zone', `%${zone}%`);
    }

    if (services) {
      const serviceArray = services.split(',');
      query = query.contains('services_offered', serviceArray);
    }

    if (min_rating) {
      query = query.gte('average_rating', parseFloat(min_rating));
    }

    const { data: employees, error } = await query.order('average_rating', { ascending: false });
    
    if (error) throw error;

    return employees;
  },

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10; // Redondear a 1 decimal
  },

  processEmployeesWithDistance(employees, userLatitude, userLongitude, radius) {
    let employeesWithDistance = employees.map(emp => ({
      ...emp,
      distance_km: emp.latitude && emp.longitude 
        ? this.calculateDistance(
            parseFloat(userLatitude), 
            parseFloat(userLongitude), 
            parseFloat(emp.latitude), 
            parseFloat(emp.longitude)
          ) 
        : null
    }));

    // Filtrar por radio si se especifica
    if (radius) {
      employeesWithDistance = employeesWithDistance.filter(emp => 
        !emp.distance_km || emp.distance_km <= parseFloat(radius)
      );
    }

    // Ordenar por distancia, luego por rating
    employeesWithDistance.sort((a, b) => {
      if (a.distance_km !== b.distance_km) {
        return (a.distance_km || 999) - (b.distance_km || 999);
      }
      return b.average_rating - a.average_rating;
    });

    return employeesWithDistance;
  }
};

module.exports = {
  AuthHelpers,
  EmployeeHelpers
};