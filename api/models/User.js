import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class User {
  static async findByEmail(email, userType = null) {
    if (userType === 'client') {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();
      
      return data ? { ...data, user_type: 'client' } : null;
    }
    
    if (userType === 'employee') {
      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .single();
      
      return data ? { ...data, user_type: 'employee' } : null;
    }

    // Buscar en ambas tablas si no se especifica tipo
    let { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (client) {
      return { ...client, user_type: 'client' };
    }

    let { data: employee } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (employee) {
      return { ...employee, user_type: 'employee' };
    }

    return null;
  }

  static async create(userData, userType) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const newUserData = {
      email: userData.email,
      password_hash: hashedPassword,
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
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;