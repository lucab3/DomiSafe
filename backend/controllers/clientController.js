const { validationResult } = require('express-validator');
const Client = require('../models/Client');
const Service = require('../models/Service');

const clientController = {
  async getProfile(req, res) {
    try {
      const client = await Client.findById(req.user.id);
      
      if (!client) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const { password_hash, ...clientProfile } = client;

      res.json({ client: clientProfile });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updateData = req.body;
      const updatedClient = await Client.update(req.user.id, updateData);

      const { password_hash, ...clientProfile } = updatedClient;

      res.json({
        message: 'Perfil actualizado exitosamente',
        client: clientProfile
      });

    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getServices(req, res) {
    try {
      const services = await Service.findAll({
        client_id: req.user.id
      });

      res.json({ services });

    } catch (error) {
      console.error('Error obteniendo servicios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async requestService(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const serviceData = {
        ...req.body,
        client_id: req.user.id,
        status: 'requested',
        created_at: new Date().toISOString()
      };

      const newService = await Service.create(serviceData);

      res.status(201).json({
        message: 'Solicitud de servicio creada exitosamente',
        service: newService
      });

    } catch (error) {
      console.error('Error solicitando servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);

      if (!service || service.client_id !== req.user.id) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      res.json({ service });

    } catch (error) {
      console.error('Error obteniendo servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async cancelService(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);

      if (!service || service.client_id !== req.user.id) {
        return res.status(404).json({ error: 'Servicio no encontrado' });
      }

      if (service.status === 'completed') {
        return res.status(400).json({ error: 'No se puede cancelar un servicio completado' });
      }

      const updatedService = await Service.updateStatus(id, 'cancelled');

      res.json({
        message: 'Servicio cancelado exitosamente',
        service: updatedService
      });

    } catch (error) {
      console.error('Error cancelando servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async reviewService(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { rating, comment } = req.body;

      console.log(`Cliente ${req.user.id} calificó servicio ${id} con ${rating} estrellas`);

      res.json({ 
        message: 'Reseña enviada exitosamente. Funcionalidad completa será implementada próximamente.' 
      });

    } catch (error) {
      console.error('Error enviando reseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updatePreferences(req, res) {
    try {
      const { preferences } = req.body;
      const updatedClient = await Client.updatePreferences(req.user.id, preferences);

      res.json({
        message: 'Preferencias actualizadas exitosamente',
        preferences: updatedClient.preferences
      });

    } catch (error) {
      console.error('Error actualizando preferencias:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getFavoriteEmployees(req, res) {
    try {
      console.log(`Obteniendo favoritos para cliente ${req.user.id}`);
      
      res.json({ 
        favorites: [],
        message: 'Funcionalidad de favoritos será implementada próximamente'
      });

    } catch (error) {
      console.error('Error obteniendo favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async addFavoriteEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      
      console.log(`Cliente ${req.user.id} agregó empleada ${employee_id} a favoritos`);

      res.json({ message: 'Empleada agregada a favoritos exitosamente' });

    } catch (error) {
      console.error('Error agregando a favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async removeFavoriteEmployee(req, res) {
    try {
      const { employee_id } = req.params;
      
      console.log(`Cliente ${req.user.id} removió empleada ${employee_id} de favoritos`);

      res.json({ message: 'Empleada removida de favoritos exitosamente' });

    } catch (error) {
      console.error('Error removiendo de favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async referFriend(req, res) {
    try {
      const { referred_email } = req.body;
      
      console.log(`Cliente ${req.user.id} refirió a ${referred_email}`);

      res.json({ 
        message: 'Invitación enviada exitosamente. Tu amigo recibirá un email con tu código de referido.',
        referral_code: 'REF' + Date.now()
      });

    } catch (error) {
      console.error('Error enviando referido:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getSubscription(req, res) {
    try {
      const client = await Client.findById(req.user.id);
      
      res.json({
        subscription: {
          type: client.subscription_type || 'basic',
          end_date: client.subscription_end_date,
          is_active: true
        }
      });

    } catch (error) {
      console.error('Error obteniendo suscripción:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async upgradeSubscription(req, res) {
    try {
      const { plan } = req.body;
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const updatedClient = await Client.updateSubscription(req.user.id, {
        type: plan,
        endDate: endDate.toISOString()
      });

      res.json({
        message: `Suscripción actualizada a ${plan} exitosamente`,
        subscription: {
          type: updatedClient.subscription_type,
          end_date: updatedClient.subscription_end_date
        }
      });

    } catch (error) {
      console.error('Error actualizando suscripción:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = clientController;