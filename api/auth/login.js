const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario en clientes
    let { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    let user = null;
    let user_type = null;

    if (client) {
      user = client;
      user_type = 'client';
    } else {
      // Buscar en empleadas
      let { data: employee } = await supabase
        .from('employees')
        .select('*')
        .eq('email', email)
        .single();
      
      if (employee) {
        user = employee;
        user_type = 'employee';
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        error: user_type === 'employee' 
          ? 'Tu cuenta está pendiente de aprobación'
          : 'Tu cuenta está desactivada' 
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        user_type,
        name: user.name,
        is_admin: user.is_admin || false
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    return res.json({
      message: 'Inicio de sesión exitoso',
      user: {
        ...userWithoutPassword,
        user_type
      },
      token
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}