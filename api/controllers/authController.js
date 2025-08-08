import AuthService from '../services/AuthService.js';

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      const result = await AuthService.login(email, password);
      
      return res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({ error: error.message });
    }
  }

  static async register(req, res) {
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
      console.error('Register error:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  static async verify(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = AuthService.verifyToken(token);
      
      return res.json({
        user: decoded,
        message: 'Token válido'
      });
    } catch (error) {
      console.error('Verify error:', error);
      return res.status(401).json({ error: 'Token inválido' });
    }
  }
}

export default AuthController;