const AuthService = require('../services/AuthService');

module.exports = async function handler(req, res) {
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

    const userData = {
      email,
      password,
      name,
      phone,
      user_type,
      ...additionalData
    };

    const result = await AuthService.register(userData);
    
    return res.status(201).json(result);
  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(400).json({ error: error.message });
  }
}