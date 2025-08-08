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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await AuthHelpers.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Para demo: comparación simple sin bcrypt
    if (password !== 'password123') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        error: user.user_type === 'employee' 
          ? 'Tu cuenta está pendiente de aprobación'
          : 'Tu cuenta está desactivada' 
      });
    }

    const token = AuthHelpers.generateToken({
      id: user.id, 
      email: user.email, 
      user_type: user.user_type,
      name: user.name,
      is_admin: user.is_admin || false
    });

    const { password_hash, ...userWithoutPassword } = user;

    return res.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}