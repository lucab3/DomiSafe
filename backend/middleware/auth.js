const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const tableName = decoded.user_type === 'client' ? 'clients' : 'employees';
    const { data: user, error } = await supabase
      .from(tableName)
      .select('id, email, name, is_active, is_admin')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Cuenta desactivada' });
    }

    req.user = {
      ...user,
      user_type: decoded.user_type
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = auth;