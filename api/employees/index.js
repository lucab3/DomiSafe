const { EmployeeHelpers } = require('../_helpers');

export default async function handler(req, res) {
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

    const employees = await EmployeeHelpers.findAll(filters);

    let result = employees;
    if (filters.latitude && filters.longitude) {
      result = EmployeeHelpers.processEmployeesWithDistance(
        employees, 
        filters.latitude, 
        filters.longitude, 
        filters.radius
      );
    }

    return res.json({
      employees: result,
      count: result.length,
      filters_applied: Object.keys(req.query).filter(key => req.query[key] !== undefined)
    });
  } catch (error) {
    console.error('Employees API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}