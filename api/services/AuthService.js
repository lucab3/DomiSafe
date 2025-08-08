const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  static generateToken(payload) {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await User.validatePassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.is_active) {
      throw new Error(
        user.user_type === 'employee' 
          ? 'Tu cuenta está pendiente de aprobación'
          : 'Tu cuenta está desactivada'
      );
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      name: user.name,
      is_admin: user.is_admin || false
    });

    // Remover password del objeto usuario
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      message: 'Inicio de sesión exitoso'
    };
  }

  static async register(userData) {
    const { user_type, email } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email, user_type);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const newUser = await User.create(userData, user_type);
    
    const token = this.generateToken({
      id: newUser.id,
      email: newUser.email,
      user_type,
      name: newUser.name
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        user_type,
        is_active: newUser.is_active
      },
      token,
      message: user_type === 'employee' 
        ? 'Registro exitoso. Tu perfil será revisado por nuestro equipo.'
        : 'Registro exitoso'
    };
  }
}

module.exports = AuthService;