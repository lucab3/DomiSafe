const EmployeeService = require('../services/EmployeeService');

class EmployeeController {
  static async getEmployees(req, res) {
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
      console.error('Get employees error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getEmployee(req, res) {
    try {
      const { id } = req.params;
      
      const employee = await EmployeeService.getEmployeeById(id);
      
      if (!employee) {
        return res.status(404).json({ error: 'Empleada no encontrada' });
      }
      
      return res.json({ employee });
    } catch (error) {
      console.error('Get employee error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async toggleEmployeeStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      
      const employee = await EmployeeService.toggleEmployeeStatus(id, is_active);
      
      return res.json({
        employee,
        message: `Empleada ${is_active ? 'activada' : 'desactivada'} exitosamente`
      });
    } catch (error) {
      console.error('Toggle employee status error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getNearbyEmployees(req, res) {
    try {
      const { latitude, longitude, radius = 10 } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
      }

      const employees = await EmployeeService.getNearbyEmployees(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(radius)
      );

      return res.json({
        employees,
        count: employees.length
      });
    } catch (error) {
      console.error('Get nearby employees error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = EmployeeController;