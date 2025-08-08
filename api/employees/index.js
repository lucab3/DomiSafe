import EmployeeController from '../controllers/EmployeeController.js';

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
    return await EmployeeController.getEmployees(req, res);
  } catch (error) {
    console.error('Employees API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}