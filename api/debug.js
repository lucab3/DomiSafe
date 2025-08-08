const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email } = req.query;

    if (!email) {
      return res.json({ error: 'Provide email parameter' });
    }

    // Buscar en clients
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    // Buscar en employees  
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    return res.json({
      email,
      client: {
        data: client,
        error: clientError?.message || null
      },
      employee: {
        data: employee,
        error: employeeError?.message || null
      },
      environment: {
        supabaseUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
        jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
      }
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
}