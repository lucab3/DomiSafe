const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, phone, user_type, ...additionalData } = req.body;

    // Validaciones básicas
    if (!email || !password || !name || !phone || !user_type) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = user_type === 'client' 
      ? await supabase.from('clients').select('email').eq('email', email).single()
      : await supabase.from('employees').select('email').eq('email', email).single();

    if (existingUser.data) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userData = {
      email,
      password_hash: hashedPassword,
      name,
      phone,
      is_active: user_type === 'client',
      created_at: new Date().toISOString(),
      ...additionalData
    };

    if (user_type === 'employee') {
      userData.verification_status = 'pending';
      userData.average_rating = 5.0;
      userData.total_reviews = 0;
    } else {
      userData.subscription_type = 'basic';
      userData.referral_code = `REF${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    }

    const tableName = user_type === 'client' ? 'clients' : 'employees';
    const { data: newUser, error } = await supabase
      .from(tableName)
      .insert([userData])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        user_type,
        name: newUser.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: user_type === 'employee' 
        ? 'Registro exitoso. Tu perfil será revisado por nuestro equipo.'
        : 'Registro exitoso',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        user_type,
        is_active: newUser.is_active
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}