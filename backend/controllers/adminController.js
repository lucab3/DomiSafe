const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const Service = require('../models/Service');
const supabase = require('../config/supabase');

const adminController = {
  async getDashboard(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const [employeesTotal, clientsTotal, servicesThisWeek, pendingEmployees] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('clients').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('services').select('id', { count: 'exact' }).gte('created_at', lastWeek),
        supabase.from('employees').select('id', { count: 'exact' }).eq('verification_status', 'pending')
      ]);

      const stats = await Service.getStatistics({ date_from: lastWeek });

      res.json({
        dashboard: {
          total_employees: employeesTotal.count || 0,
          total_clients: clientsTotal.count || 0,
          services_this_week: servicesThisWeek.count || 0,
          pending_approvals: pendingEmployees.count || 0,
          total_revenue: stats.total_revenue || 0,
          completed_services: stats.completed_services || 0,
          services_by_status: stats.services_by_status || {}
        },
        updated_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error obteniendo dashboard:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getAllEmployees(req, res) {
    try {
      const { status, zone } = req.query;
      
      let query = supabase
        .from('employees')
        .select(`
          *,
          services(count),
          reviews(rating)
        `)
        .order('created_at', { ascending: false });

      if (status === 'pending') {
        query = query.eq('verification_status', 'pending');
      } else if (status === 'active') {
        query = query.eq('is_active', true).eq('verification_status', 'approved');
      } else if (status === 'inactive') {
        query = query.eq('is_active', false);
      }

      if (zone) {
        query = query.ilike('zone', `%${zone}%`);
      }

      const { data: employees, error } = await query;
      
      if (error) throw error;

      res.json({
        employees: employees || [],
        count: employees?.length || 0
      });

    } catch (error) {
      console.error('Error obteniendo empleadas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getPendingEmployees(req, res) {
    try {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;

      res.json({
        employees: employees || [],
        count: employees?.length || 0
      });

    } catch (error) {
      console.error('Error obteniendo empleadas pendientes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async approveEmployee(req, res) {
    try {
      const { id } = req.params;

      const { data: employee, error } = await supabase
        .from('employees')
        .update({ 
          verification_status: 'approved',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: 'Empleada aprobada exitosamente',
        employee
      });

    } catch (error) {
      console.error('Error aprobando empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async rejectEmployee(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { reason } = req.body;

      const { data: employee, error } = await supabase
        .from('employees')
        .update({ 
          verification_status: 'rejected',
          is_active: false,
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: 'Empleada rechazada',
        employee
      });

    } catch (error) {
      console.error('Error rechazando empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateEmployeeStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const isActive = status === 'active';

      const { data: employee, error } = await supabase
        .from('employees')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: `Empleada ${isActive ? 'activada' : 'desactivada'} exitosamente`,
        employee
      });

    } catch (error) {
      console.error('Error actualizando estado de empleada:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getAllClients(req, res) {
    try {
      const { subscription } = req.query;

      let query = supabase
        .from('clients')
        .select(`
          *,
          services(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (subscription) {
        query = query.eq('subscription_type', subscription);
      }

      const { data: clients, error } = await query;
      
      if (error) throw error;

      res.json({
        clients: clients || [],
        count: clients?.length || 0
      });

    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getServiceRequests(req, res) {
    try {
      const requests = await Service.findPendingRequests();

      res.json({
        requests,
        count: requests.length
      });

    } catch (error) {
      console.error('Error obteniendo solicitudes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async assignServiceToEmployee(req, res) {
    try {
      const { id } = req.params;
      const { employee_id } = req.body;

      const updatedService = await Service.assignEmployee(id, employee_id);

      res.json({
        message: 'Servicio asignado exitosamente',
        service: updatedService
      });

    } catch (error) {
      console.error('Error asignando servicio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getStatistics(req, res) {
    try {
      const { period = 'monthly', date_from, date_to } = req.query;
      
      const filters = {};
      if (date_from) filters.date_from = date_from;
      if (date_to) filters.date_to = date_to;

      const stats = await Service.getStatistics(filters);

      const { data: zoneStats, error: zoneError } = await supabase
        .from('employees')
        .select('zone')
        .eq('is_active', true);

      if (zoneError) throw zoneError;

      const zoneDistribution = (zoneStats || []).reduce((acc, emp) => {
        acc[emp.zone] = (acc[emp.zone] || 0) + 1;
        return acc;
      }, {});

      res.json({
        statistics: {
          ...stats,
          zone_distribution: zoneDistribution,
          period
        }
      });

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getZoneStatistics(req, res) {
    try {
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('zone, is_active')
        .eq('verification_status', 'approved');

      const { data: services, error: servError } = await supabase
        .from('services')
        .select(`
          *,
          employee:employees(zone)
        `)
        .eq('status', 'completed');

      if (empError || servError) throw empError || servError;

      const zoneStats = {};

      (employees || []).forEach(emp => {
        if (!zoneStats[emp.zone]) {
          zoneStats[emp.zone] = {
            total_employees: 0,
            active_employees: 0,
            completed_services: 0,
            total_revenue: 0
          };
        }
        zoneStats[emp.zone].total_employees++;
        if (emp.is_active) zoneStats[emp.zone].active_employees++;
      });

      (services || []).forEach(service => {
        if (service.employee?.zone) {
          const zone = service.employee.zone;
          if (zoneStats[zone]) {
            zoneStats[zone].completed_services++;
            zoneStats[zone].total_revenue += parseFloat(service.total_amount || 0);
          }
        }
      });

      res.json({ zone_statistics: zoneStats });

    } catch (error) {
      console.error('Error obteniendo estadísticas por zona:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getAllReviews(req, res) {
    try {
      const { min_rating, status } = req.query;

      let query = supabase
        .from('reviews')
        .select(`
          *,
          employee:employees(name),
          client:clients(name)
        `)
        .order('created_at', { ascending: false });

      if (min_rating) {
        query = query.gte('rating', parseInt(min_rating));
      }

      if (status === 'active') {
        query = query.eq('is_visible', true);
      } else if (status === 'hidden') {
        query = query.eq('is_visible', false);
      }

      const { data: reviews, error } = await query;
      
      if (error) throw error;

      res.json({
        reviews: reviews || [],
        count: reviews?.length || 0
      });

    } catch (error) {
      console.error('Error obteniendo reseñas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async toggleReviewVisibility(req, res) {
    try {
      const { id } = req.params;

      const { data: review } = await supabase
        .from('reviews')
        .select('is_visible')
        .eq('id', id)
        .single();

      if (!review) {
        return res.status(404).json({ error: 'Reseña no encontrada' });
      }

      const { data: updatedReview, error } = await supabase
        .from('reviews')
        .update({ is_visible: !review.is_visible })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: `Reseña ${updatedReview.is_visible ? 'mostrada' : 'ocultada'} exitosamente`,
        review: updatedReview
      });

    } catch (error) {
      console.error('Error actualizando visibilidad de reseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getSettings(req, res) {
    try {
      const { data: settings, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      const settingsObj = (settings || []).reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      res.json({ settings: settingsObj });

    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async updateSettings(req, res) {
    try {
      const settings = req.body;

      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: typeof value === 'boolean' ? value.toString() : value,
        updated_at: new Date().toISOString(),
        updated_by: req.user.id
      }));

      for (const update of updates) {
        await supabase
          .from('system_settings')
          .upsert(update, { 
            onConflict: 'key',
            ignoreDuplicates: false 
          });
      }

      res.json({
        message: 'Configuración actualizada exitosamente',
        settings
      });

    } catch (error) {
      console.error('Error actualizando configuración:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getRevenueStatistics(req, res) {
    try {
      const { period = 'monthly', date_from, date_to } = req.query;

      let query = supabase
        .from('services')
        .select('total_amount, commission_amount, service_date, status')
        .eq('status', 'completed');

      if (date_from) query = query.gte('service_date', date_from);
      if (date_to) query = query.lte('service_date', date_to);

      const { data: services, error } = await query;
      
      if (error) throw error;

      const revenue = {
        total_gross: 0,
        total_commission: 0,
        total_net: 0,
        services_count: services?.length || 0,
        by_period: {}
      };

      (services || []).forEach(service => {
        const amount = parseFloat(service.total_amount || 0);
        const commission = parseFloat(service.commission_amount || 0);
        
        revenue.total_gross += amount;
        revenue.total_commission += commission;
        revenue.total_net += commission;

        const date = new Date(service.service_date);
        let periodKey;
        
        if (period === 'daily') {
          periodKey = date.toISOString().split('T')[0];
        } else if (period === 'weekly') {
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          periodKey = weekStart.toISOString().split('T')[0];
        } else {
          periodKey = date.toISOString().slice(0, 7);
        }

        if (!revenue.by_period[periodKey]) {
          revenue.by_period[periodKey] = {
            gross: 0,
            commission: 0,
            services: 0
          };
        }
        
        revenue.by_period[periodKey].gross += amount;
        revenue.by_period[periodKey].commission += commission;
        revenue.by_period[periodKey].services += 1;
      });

      res.json({ revenue });

    } catch (error) {
      console.error('Error obteniendo estadísticas de ingresos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async sendBroadcastNotification(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, message, target } = req.body;

      console.log(`Enviando notificación broadcast:`);
      console.log(`Título: ${title}`);
      console.log(`Mensaje: ${message}`);
      console.log(`Objetivo: ${target}`);

      res.json({
        message: 'Notificación enviada exitosamente',
        sent_to: target,
        notification: { title, message }
      });

    } catch (error) {
      console.error('Error enviando notificación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = adminController;