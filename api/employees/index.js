const EmployeeService = require('../services/EmployeeService');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filters = {
      zone: req.query.zone,
      services: req.query.services,
      min_rating: req.query.min_rating,
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      radius: req.query.radius || 10
    };

    const result = await EmployeeService.getEmployees(filters);
    
    return res.json(result);
  } catch (error) {
    console.error('Employees API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}