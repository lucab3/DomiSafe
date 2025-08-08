const AuthController = require('../controllers/AuthController');
const EmployeeController = require('../controllers/EmployeeController');

// Definir todas las rutas de la aplicación
const routes = {
  // AUTH ROUTES
  'POST /auth/login': AuthController.login,
  'POST /auth/register': AuthController.register,
  'GET /auth/verify': AuthController.verify,
  'POST /auth/verify': AuthController.verify,

  // EMPLOYEE ROUTES
  'GET /employees': EmployeeController.getEmployees,
  'GET /employees/:id': EmployeeController.getEmployee,
  'PUT /employees/:id/status': EmployeeController.toggleEmployeeStatus,
  'GET /employees/nearby': EmployeeController.getNearbyEmployees,
};

// Función helper para ejecutar rutas
async function executeRoute(req, res, route, params = {}) {
  const method = req.method;
  const routeKey = `${method} ${route}`;
  
  if (routes[routeKey]) {
    // Agregar parámetros de la URL al req.params
    req.params = { ...req.params, ...params };
    
    return await routes[routeKey](req, res);
  }
  
  return res.status(404).json({ error: 'Route not found' });
}

module.exports = {
  routes,
  executeRoute
};