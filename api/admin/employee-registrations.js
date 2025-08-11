const { AuthHelpers } = require('../_helpers');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get all employee registrations pending approval
      const registrations = await AuthHelpers.getEmployeeRegistrations();
      
      return res.json({
        success: true,
        registrations: registrations
      });
    }

    if (req.method === 'PUT') {
      // Update employee registration status
      const { employee_id, status } = req.body;
      
      if (!employee_id || !status) {
        return res.status(400).json({ error: 'Employee ID and status are required' });
      }

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Status must be approved or rejected' });
      }

      const updatedRegistration = await AuthHelpers.updateEmployeeRegistration(employee_id, status);
      
      return res.json({
        success: true,
        registration: updatedRegistration,
        message: `Employee ${status} successfully`
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Employee registrations API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}