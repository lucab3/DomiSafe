const supabase = require('../config/supabase');

class Service {
  static async findAll(filters = {}) {
    let query = supabase
      .from('services')
      .select(`
        *,
        employee:employees(id, name, phone, photo_url),
        client:clients(id, name, phone, address)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.employee_id) {
      query = query.eq('employee_id', filters.employee_id);
    }

    if (filters.client_id) {
      query = query.eq('client_id', filters.client_id);
    }

    if (filters.date_from) {
      query = query.gte('service_date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('service_date', filters.date_to);
    }

    const { data, error } = await query.order('service_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        employee:employees(id, name, phone, photo_url, services_offered),
        client:clients(id, name, phone, address),
        review:reviews(rating, comment)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(serviceData) {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('services')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findPendingRequests() {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        client:clients(id, name, phone, address, preferences)
      `)
      .eq('status', 'requested')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async assignEmployee(serviceId, employeeId) {
    const { data, error } = await supabase
      .from('services')
      .update({ 
        employee_id: employeeId,
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getStatistics(filters = {}) {
    let query = supabase
      .from('services')
      .select('status, service_date, total_amount, employee_id');

    if (filters.date_from) {
      query = query.gte('service_date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('service_date', filters.date_to);
    }

    const { data, error } = await query;
    
    if (error) throw error;

    const stats = {
      total_services: data.length,
      completed_services: data.filter(s => s.status === 'completed').length,
      total_revenue: data.reduce((sum, s) => sum + (s.total_amount || 0), 0),
      services_by_status: data.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {}),
      services_by_month: data.reduce((acc, s) => {
        const month = new Date(s.service_date).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {})
    };

    return stats;
  }
}

module.exports = Service;