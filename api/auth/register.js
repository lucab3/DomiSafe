const { AuthHelpers } = require('../_helpers');

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
    const { email, password, name, phone, user_type, ...additionalData } = req.body;

    if (!email || !password || !name || !phone || !user_type) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await AuthHelpers.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const userData = {
      email,
      password,
      name,
      phone,
      ...additionalData
    };

    const newUser = await AuthHelpers.createUser(userData, user_type);
    
    const token = AuthHelpers.generateToken({
      id: newUser.id,
      email: newUser.email,
      user_type,
      name: newUser.name
    });

    return res.status(201).json({
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
    console.error('Register API Error:', error);
    return res.status(400).json({ error: error.message });
  }
}