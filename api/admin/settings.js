const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Obtener configuración actual
      const { data: setting, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'show_employees_to_clients')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      const showEmployees = setting?.value === 'true' || setting?.value === true;

      return res.json({
        show_employees_to_clients: showEmployees
      });
    }

    if (req.method === 'PUT') {
      // Actualizar configuración
      const { show_employees_to_clients } = req.body;

      // Actualizar o insertar la configuración
      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'show_employees_to_clients',
          value: show_employees_to_clients.toString(),
          description: 'Mostrar empleadas disponibles a los clientes',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({
        show_employees_to_clients: show_employees_to_clients,
        message: 'Configuración actualizada exitosamente'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Admin settings error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}