// Helper functions and services - NOT a serverless function
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock data storage
let mockUsers = [];
let mockEmployeeRegistrations = [];

// Auth Helper Functions
const AuthHelpers = {
  async findUserByEmail(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check in mock users
    const existingUser = mockUsers.find(user => user.email === email);
    return existingUser || null;
  },

  async createUser(userData, userType) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUserData = {
      id: `${userType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: userData.email,
      password_hash: userData.password, // Sin bcrypt para demo
      name: userData.name,
      phone: userData.phone,
      user_type: userType,
      is_active: userType === 'client',
      created_at: new Date().toISOString(),
      ...userData
    };

    // Clean up fields that shouldn't be stored
    delete newUserData.password;
    delete newUserData.confirmPassword;

    if (userType === 'employee') {
      newUserData.verification_status = 'pending';
      newUserData.average_rating = 5.0;
      newUserData.total_reviews = 0;
      
      // Store employee registration for admin review
      mockEmployeeRegistrations.push({
        id: newUserData.id,
        ...newUserData,
        registration_date: new Date().toISOString(),
        status: 'pending'
      });
    } else {
      newUserData.subscription_type = 'basic';
      newUserData.referral_code = `REF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    }

    // Add to mock storage
    mockUsers.push(newUserData);

    return newUserData;
  },

  async getEmployeeRegistrations() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockEmployeeRegistrations;
  },

  async updateEmployeeRegistration(employeeId, status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const registrationIndex = mockEmployeeRegistrations.findIndex(reg => reg.id === employeeId);
    if (registrationIndex !== -1) {
      mockEmployeeRegistrations[registrationIndex].status = status;
      mockEmployeeRegistrations[registrationIndex].reviewed_at = new Date().toISOString();
      
      // Update user status
      const userIndex = mockUsers.findIndex(user => user.id === employeeId);
      if (userIndex !== -1) {
        mockUsers[userIndex].verification_status = status;
        mockUsers[userIndex].is_active = status === 'approved';
      }
      
      return mockEmployeeRegistrations[registrationIndex];
    }
    
    throw new Error('Employee registration not found');
  },

  generateToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'demo-secret-key',
      { expiresIn: '7d' }
    );
  }
};

// Mock employees data for demo
const mockEmployees = [
  {
    id: 'emp_1',
    name: 'Rosa Martínez',
    email: 'rosa@example.com',
    phone: '+54 11 1234-5678',
    zone: 'Palermo',
    services_offered: ['cleaning', 'cooking'],
    languages: ['Español', 'Inglés'],
    experience_years: 8,
    hourly_rate: 1200,
    average_rating: 4.8,
    total_reviews: 24,
    is_active: true,
    verification_status: 'approved',
    latitude: -34.5875,
    longitude: -58.3974
  }
];

// Employee Helper Functions
const EmployeeHelpers = {
  async findAll(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { zone, services, min_rating } = filters;
    
    let employees = [...mockEmployees].filter(emp => 
      emp.is_active && emp.verification_status === 'approved'
    );

    if (zone) {
      employees = employees.filter(emp => 
        emp.zone.toLowerCase().includes(zone.toLowerCase())
      );
    }

    if (services) {
      const serviceArray = services.split(',');
      employees = employees.filter(emp =>
        serviceArray.some(service => emp.services_offered.includes(service))
      );
    }

    if (min_rating) {
      employees = employees.filter(emp => 
        emp.average_rating >= parseFloat(min_rating)
      );
    }

    return employees.sort((a, b) => b.average_rating - a.average_rating);
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