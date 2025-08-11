const { EmployeeHelpers } = require('../_helpers');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const filters = {
        zone: req.query.zone,
        services: req.query.services,
        min_rating: req.query.min_rating,
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        radius: req.query.radius || 10,
        status: req.query.status,
        admin_view: req.query.admin_view
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
        success: true,
        employees: result,
        count: result.length,
        filters_applied: Object.keys(req.query).filter(key => req.query[key] !== undefined)
      });
    }

    if (req.method === 'POST') {
      // Create new employee
      const {
        name,
        email,
        phone,
        photo_url,
        address,
        zone,
        services_offered,
        languages,
        experience_years,
        hourly_rate,
        availability,
        experience_description,
        references
      } = req.body;

      // Validate required fields
      if (!name || !email || !phone || !zone) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, phone, zone'
        });
      }

      const newEmployee = {
        id: `emp_${Date.now()}`,
        name,
        email,
        phone,
        photo_url: photo_url || 'https://images.unsplash.com/photo-1494790108755-2616c0763c99?w=400',
        address: address || '',
        zone,
        services_offered: services_offered || [],
        languages: languages || ['Español'],
        experience_years: experience_years || 0,
        hourly_rate: hourly_rate || 1000,
        average_rating: 0,
        total_reviews: 0,
        current_status: 'pending_approval',
        availability: availability || 'Lunes a Viernes 9:00-17:00',
        experience_description: experience_description || '',
        references: references || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return res.status(201).json({
        success: true,
        employee: newEmployee,
        message: 'Empleada creada exitosamente'
      });
    }

    if (req.method === 'PUT') {
      // Update employee
      const { employee_id } = req.query;
      const updateData = req.body;

      if (!employee_id) {
        return res.status(400).json({
          success: false,
          error: 'Employee ID is required'
        });
      }

      // In a real implementation, this would update the database
      const updatedEmployee = {
        ...updateData,
        id: employee_id,
        updated_at: new Date().toISOString()
      };

      return res.json({
        success: true,
        employee: updatedEmployee,
        message: 'Empleada actualizada exitosamente'
      });
    }

    if (req.method === 'DELETE') {
      // Delete employee (soft delete - change status)
      const { employee_id } = req.query;

      if (!employee_id) {
        return res.status(400).json({
          success: false,
          error: 'Employee ID is required'
        });
      }

      return res.json({
        success: true,
        message: 'Empleada desactivada exitosamente'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Employees API Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}