const { validationResult } = require('express-validator');
const Service = require('../models/Service');

const serviceController = {
  async getAllServices(req, res) {
    try {
      const filters = {
        status: req.query.status,
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };

      if (req.user.user_type === 'client') {
        filters.client_id = req.user.id;
      } else if (req.user.user_type === 'employee') {
        filters.employee_id = req.user.id;
      }

      const services = await Service.findAll(filters);

      res.json({
        services,
        count: services.length,
        user_type: req.user.user_type
      });

    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);

      if (!service) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      if (req.user.user_type === 'client' && service.client_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes acceso a este servicio' });
      }

      if (req.user.user_type === 'employee' && service.employee_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes acceso a este servicio' });
      }

      res.json({ service });

    } catch (error) {
      console.error('Error obteniendo servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      if (req.user.user_type === 'employee' && service.employee_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para actualizar este servicio' });
      }

      const updatedService = await Service.updateStatus(id, status);

      res.json({
        message: `Servicio marcado como ${status} exitosamente`,
        service: updatedService
      });

    } catch (error) {
      console.error('Error actualizando estado del servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async assignEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { employee_id } = req.body;

      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      if (service.status !== 'requested') {
        return res.status(400).json({ error: 'Solo se pueden asignar servicios solicitados' });
      }

      const updatedService = await Service.assignEmployee(id, employee_id);

      res.json({
        message: 'Empleada asignada exitosamente',
        service: updatedService
      });

    } catch (error) {
      console.error('Error asignando empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getStatistics(req, res) {
    try {
      const filters = {
        date_from: req.query.date_from,
        date_to: req.query.date_to
      };

      const stats = await Service.getStatistics(filters);

      res.json({ statistics: stats });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getChatMessages(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`Obteniendo mensajes para servicio ${id}`);

      res.json({
        messages: [
          {
            id: '1',
            sender_id: req.user.id,
            sender_type: req.user.user_type,
            message: 'Mensaje de prueba',
            created_at: new Date().toISOString(),
            is_read: true
          }
        ]
      });

    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async sendMessage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { message } = req.body;

      console.log(`Usuario ${req.user.id} envió mensaje al servicio ${id}: ${message}`);

      res.json({
        message: 'Mensaje enviado exitosamente',
        chat_message: {
          id: Date.now().toString(),
          sender_id: req.user.id,
          sender_type: req.user.user_type,
          message,
          created_at: new Date().toISOString(),
          is_read: false
        }
      });

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = serviceController;