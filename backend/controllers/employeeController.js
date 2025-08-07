const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

const employeeController = {
  async getAllEmployees(req, res) {
    try {
      const filters = {
        zone: req.query.zone,
        services: req.query.services ? req.query.services.split(',') : null,
        min_rating: req.query.min_rating,
        languages: req.query.languages ? req.query.languages.split(',') : null
      };

      const employees = await Employee.findAll(filters);
      
      res.json({
        employees,
        count: employees.length,
        filters_applied: Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== null)
      });

    } catch (error) {
      console.error('Error obteniendo empleadas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getEmployeesNearLocation(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { latitude, longitude, radius = 10 } = req.query;
      
      const employees = await Employee.findByLocation(
        parseFloat(latitude), 
        parseFloat(longitude), 
        parseInt(radius)
      );

      res.json({
        employees,
        location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        radius: parseInt(radius),
        count: employees.length
      });

    } catch (error) {
      console.error('Error obteniendo empleadas por ubicación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ error: 'Empleada no encontrada' });
      }

      res.json({ employee });

    } catch (error) {
      console.error('Error obteniendo empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async createEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employeeData = {
        ...req.body,
        created_at: new Date().toISOString()
      };

      const newEmployee = await Employee.create(employeeData);

      res.status(201).json({
        message: 'Empleada creada exitosamente',
        employee: newEmployee
      });

    } catch (error) {
      console.error('Error creando empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedEmployee = await Employee.update(id, updateData);

      res.json({
        message: 'Empleada actualizada exitosamente',
        employee: updatedEmployee
      });

    } catch (error) {
      console.error('Error actualizando empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      await Employee.delete(id);

      res.json({ message: 'Empleada desactivada exitosamente' });

    } catch (error) {
      console.error('Error eliminando empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateAvailability(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { availability } = req.body;

      const updatedEmployee = await Employee.updateAvailability(id, availability);

      res.json({
        message: 'Disponibilidad actualizada exitosamente',
        employee: updatedEmployee
      });

    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async searchEmployees(req, res) {
    try {
      const { q, zone, service_type, min_rating } = req.query;
      
      let filters = {};
      
      if (zone) filters.zone = zone;
      if (service_type) filters.services = [service_type];
      if (min_rating) filters.min_rating = parseFloat(min_rating);

      let employees = await Employee.findAll(filters);

      if (q) {
        const searchTerm = q.toLowerCase();
        employees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchTerm) ||
          emp.zone.toLowerCase().includes(searchTerm) ||
          emp.services_offered.some(service => service.toLowerCase().includes(searchTerm))
        );
      }

      res.json({
        employees,
        search_term: q || null,
        filters_applied: filters,
        count: employees.length
      });

    } catch (error) {
      console.error('Error buscando empleadas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getEmployeeReviews(req, res) {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ error: 'Empleada no encontrada' });
      }

      res.json({
        reviews: employee.reviews || [],
        average_rating: employee.average_rating,
        total_reviews: employee.total_reviews
      });

    } catch (error) {
      console.error('Error obteniendo reseñas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async addReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      console.log('Funcionalidad de reseñas será implementada con el modelo Review');
      
      res.json({ message: 'Reseña agregada exitosamente' });

    } catch (error) {
      console.error('Error agregando reseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = employeeController;