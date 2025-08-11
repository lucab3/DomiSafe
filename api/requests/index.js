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
      // Crear nueva solicitud (simulado para demo)
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

      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Crear objeto de solicitud simulado
      const newRequest = {
        id: `req_${Date.now()}`,
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
      };

      return res.status(201).json({
        success: true,
        request: newRequest,
        message: request_type === 'direct' 
          ? 'Solicitud enviada a la empleada exitosamente' 
          : 'Solicitud recibida exitosamente, te contactaremos pronto con sugerencias de empleadas'
      });
    }

    if (req.method === 'GET') {
      const { client_id, employee_id, status, admin_view } = req.query;

      // Mock data para demo
      const mockRequests = [
        {
          id: '1',
          client_id: 'client_1',
          employee_id: null,
          service_type: 'Limpieza general y cocina',
          preferred_zone: 'Palermo, Ciudad Autónoma de Buenos Aires',
          max_hourly_rate: 1500,
          preferred_schedule: 'Lunes a Viernes 9:00-13:00',
          additional_comments: 'Necesito ayuda con limpieza profunda y preparación de comidas. Tengo mascota (perro pequeño).',
          request_type: 'general',
          status: 'pending',
          created_at: new Date().toISOString(),
          clients: {
            id: 'client_1',
            name: 'María García',
            email: 'maria.garcia@email.com',
            phone: '+54 11 4567-8901',
            address: 'Av. Santa Fe 1234, Palermo'
          }
        },
        {
          id: '2',
          client_id: 'client_2',
          employee_id: null,
          service_type: 'Cuidado de adultos mayores',
          preferred_zone: 'Recoleta, Ciudad Autónoma de Buenos Aires',
          max_hourly_rate: 2000,
          preferred_schedule: 'Lunes a Sábado 8:00-16:00',
          additional_comments: 'Para acompañar a mi madre de 78 años. Necesita ayuda con medicación y movilidad.',
          request_type: 'general',
          status: 'pending',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Ayer
          clients: {
            id: 'client_2',
            name: 'Roberto Fernández',
            email: 'roberto.fernandez@email.com',
            phone: '+54 11 5678-9012',
            address: 'Av. Alvear 567, Recoleta'
          }
        },
        {
          id: '3',
          client_id: 'client_3',
          employee_id: 'emp_1',
          service_type: 'Niñera y limpieza',
          preferred_zone: 'Belgrano, Ciudad Autónoma de Buenos Aires',
          max_hourly_rate: 1800,
          preferred_schedule: 'Martes y Jueves 14:00-18:00',
          additional_comments: 'Para cuidar dos niños de 5 y 8 años después del colegio.',
          request_type: 'direct',
          status: 'confirmed',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
          clients: {
            id: 'client_3',
            name: 'Ana López',
            email: 'ana.lopez@email.com',
            phone: '+54 11 6789-0123',
            address: 'Av. Cabildo 890, Belgrano'
          },
          employees: {
            id: 'emp_1',
            name: 'Rosa Martínez',
            photo_url: 'https://images.unsplash.com/photo-1494790108755-2616c0763c99?w=400',
            services_offered: ['cleaning', 'babysitting'],
            hourly_rate: 1200,
            average_rating: 4.8
          }
        }
      ];

      let filteredRequests = mockRequests;

      if (client_id) {
        filteredRequests = filteredRequests.filter(req => req.client_id === client_id);
      }
      
      if (employee_id) {
        filteredRequests = filteredRequests.filter(req => req.employee_id === employee_id);
      }
      
      if (status) {
        filteredRequests = filteredRequests.filter(req => req.status === status);
      }

      // Para vista admin, incluir solicitudes generales pendientes
      if (admin_view === 'true') {
        filteredRequests = filteredRequests.filter(req => 
          req.employee_id === null || req.status === 'pending'
        );
      }

      return res.json({
        success: true,
        requests: filteredRequests
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

      // Simular actualización exitosa
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedRequest = {
        id: request_id,
        ...updateData,
        client_name: 'Cliente Demo',
        service_type: 'Servicio actualizado'
      };

      return res.json({
        success: true,
        request: updatedRequest,
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