const { executeRoute } = require('./routes/routes');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const route = pathname.replace('/api', '');

  try {
    // Manejar rutas con parámetros dinámicos
    const params = {};
    let matchedRoute = route;

    // Detectar rutas con parámetros como /employees/:id
    const routeSegments = route.split('/');
    if (routeSegments.length === 3 && routeSegments[1] === 'employees' && routeSegments[2]) {
      // Ruta: /employees/:id
      params.id = routeSegments[2];
      matchedRoute = '/employees/:id';
    } else if (route.includes('/employees/') && route.includes('/status')) {
      // Ruta: /employees/:id/status
      const id = route.split('/')[2];
      params.id = id;
      matchedRoute = '/employees/:id/status';
    }

    return await executeRoute(req, res, matchedRoute, params);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}