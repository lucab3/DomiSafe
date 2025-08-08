const adminAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!req.user.is_admin) {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador' });
    }

    next();
  } catch (error) {
    console.error('Error en middleware de admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = adminAuth;