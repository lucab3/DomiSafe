const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Función auxiliar para calcular distancia
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10; // Redondear a 1 decimal
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { zone, services, min_rating, latitude, longitude, radius = 10 } = req.query;

    let query = supabase
      .from('employees')
      .select(`
        *,
        reviews (
          rating,
          comment,
          created_at
        )
      `)
      .eq('is_active', true)
      .eq('verification_status', 'approved');

    if (zone) {
      query = query.ilike('zone', `%${zone}%`);
    }

    if (services) {
      const serviceArray = services.split(',');
      query = query.contains('services_offered', serviceArray);
    }

    if (min_rating) {
      query = query.gte('average_rating', parseFloat(min_rating));
    }

    const { data: employees, error } = await query.order('average_rating', { ascending: false });
    
    if (error) throw error;

    let employeesWithDistance = employees;
    if (latitude && longitude) {
      employeesWithDistance = employees.map(emp => ({
        ...emp,
        distance_km: emp.latitude && emp.longitude 
          ? calculateDistance(
              parseFloat(latitude), 
              parseFloat(longitude), 
              parseFloat(emp.latitude), 
              parseFloat(emp.longitude)
            ) 
          : null
      }));

      if (radius) {
        employeesWithDistance = employeesWithDistance.filter(emp => 
          !emp.distance_km || emp.distance_km <= parseFloat(radius)
        );
      }

      employeesWithDistance.sort((a, b) => {
        if (a.distance_km !== b.distance_km) {
          return (a.distance_km || 999) - (b.distance_km || 999);
        }
        return b.average_rating - a.average_rating;
      });
    }

    return res.json({
      employees: employeesWithDistance,
      count: employeesWithDistance.length,
      filters_applied: Object.keys(req.query).filter(key => req.query[key] !== undefined)
    });
  } catch (error) {
    console.error('Employees API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}