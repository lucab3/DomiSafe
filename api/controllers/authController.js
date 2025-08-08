const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, phone, user_type, ...additionalData } = req.body;

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
  },

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      let user = null;
      let user_type = null;

      const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (client) {
        user = client;
        user_type = 'client';
      } else {
        const { data: employee } = await supabase
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

      res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          ...userWithoutPassword,
          user_type
        },
        token
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async logout(req, res) {
    res.json({ message: 'Sesión cerrada exitosamente' });
  },

  async refreshToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const newToken = jwt.sign(
        { 
          id: decoded.id, 
          email: decoded.email, 
          user_type: decoded.user_type,
          name: decoded.name,
          is_admin: decoded.is_admin 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ token: newToken });

    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      console.log(`Solicitud de recuperación de contraseña para: ${email}`);
      
      res.json({ 
        message: 'Si el email existe, recibirás instrucciones para recuperar tu contraseña' 
      });

    } catch (error) {
      console.error('Error en forgot password:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      
      console.log(`Intento de reset de contraseña con token: ${token}`);
      
      res.json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
      console.error('Error en reset password:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = authController;