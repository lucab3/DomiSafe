const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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

    // Aplicar filtros
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

    // Si hay ubicación, calcular distancia
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

      // Filtrar por radio si se especifica
      if (radius) {
        employeesWithDistance = employeesWithDistance.filter(emp => 
          !emp.distance_km || emp.distance_km <= parseFloat(radius)
        );
      }

      // Ordenar por distancia y rating
      employeesWithDistance.sort((a, b) => {
        if (a.distance_km !== b.distance_km) {
          return (a.distance_km || 999) - (b.distance_km || 999);
        }
        return b.average_rating - a.average_rating;
      });
    }

    res.json({
      employees: employeesWithDistance,
      count: employeesWithDistance.length,
      filters_applied: Object.keys(req.query).filter(key => req.query[key] !== undefined)
    });

  } catch (error) {
    console.error('Error obteniendo empleadas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

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