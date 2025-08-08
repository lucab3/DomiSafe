const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Crear nueva solicitud
      const { 
        client_id, 
        employee_id, 
        service_type, 
        preferred_zone, 
        max_hourly_rate,
        preferred_schedule,
        additional_comments,
        request_type = 'direct' // 'direct' para empleada específica, 'general' para solicitar sugerencias
      } = req.body;

      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          client_id,
          employee_id: request_type === 'direct' ? employee_id : null,
          service_type,
          preferred_zone,
          max_hourly_rate,
          preferred_schedule,
          additional_comments,
          request_type,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Si es una solicitud general (sin empleada específica), crear notificación para admin
      if (request_type === 'general') {
        await supabase
          .from('admin_notifications')
          .insert({
            type: 'new_general_request',
            title: 'Nueva solicitud de empleada',
            message: `Cliente solicita empleada en ${preferred_zone}`,
            request_id: data.id,
            is_read: false,
            created_at: new Date().toISOString()
          });
      }

      return res.status(201).json({
        success: true,
        request: data,
        message: request_type === 'direct' 
          ? 'Solicitud enviada a la empleada' 
          : 'Solicitud recibida, te contactaremos con sugerencias'
      });
    }

    if (req.method === 'GET') {
      const { client_id, employee_id, status, admin_view } = req.query;

      let query = supabase.from('service_requests').select(`
        *,
        clients!service_requests_client_id_fkey (
          id, name, email, phone, address
        ),
        employees!service_requests_employee_id_fkey (
          id, name, photo_url, services_offered, hourly_rate, average_rating
        )
      `);

      if (client_id) {
        query = query.eq('client_id', client_id);
      }
      
      if (employee_id) {
        query = query.eq('employee_id', employee_id);
      }
      
      if (status) {
        query = query.eq('status', status);
      }

      // Para vista admin, incluir solicitudes generales pendientes
      if (admin_view === 'true') {
        query = query.or('employee_id.is.null,status.eq.pending');
      }

      query = query.order('created_at', { ascending: false });

      const { data: requests, error } = await query;
      
      if (error) throw error;

      return res.json({
        success: true,
        requests: requests || []
      });
    }

    if (req.method === 'PUT') {
      // Actualizar estado de solicitud
      const { request_id } = req.query;
      const { status, employee_response, assigned_employee_id } = req.body;

      const updateData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (employee_response) {
        updateData.employee_response = employee_response;
        updateData.response_date = new Date().toISOString();
      }

      if (assigned_employee_id) {
        updateData.employee_id = assigned_employee_id;
      }

      const { data, error } = await supabase
        .from('service_requests')
        .update(updateData)
        .eq('id', request_id)
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        request: data,
        message: 'Solicitud actualizada exitosamente'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Requests API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error.message 
    });
  }
}