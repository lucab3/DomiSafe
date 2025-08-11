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
    const { place_id, osm_id, osm_type, lat, lon } = req.query;

    if (!place_id) {
      return res.status(400).json({
        success: false,
        error: 'place_id is required'
      });
    }

    // Handle OSM place_ids (from our autocomplete)
    if (place_id.startsWith('osm_')) {
      // If we have coordinates from the autocomplete request, use them directly
      if (lat && lon) {
        const place = {
          formatted_address: req.query.description || 'Buenos Aires, Argentina',
          geometry: {
            location: {
              lat: parseFloat(lat),
              lng: parseFloat(lon)
            }
          },
          name: req.query.main_text || 'Ubicación'
        };

        return res.json({
          success: true,
          place
        });
      }

      // Otherwise, try to get details from OSM if we have osm_id
      if (osm_id && osm_type) {
        const nominatimUrl = `https://nominatim.openstreetmap.org/lookup?` +
          `osm_ids=${osm_type[0].toUpperCase()}${osm_id}` +
          `&format=json` +
          `&addressdetails=1` +
          `&accept-language=es`;

        const response = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'EmpleadasDomesticasApp/1.0'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const result = data[0];
            const place = {
              formatted_address: result.display_name,
              geometry: {
                location: {
                  lat: parseFloat(result.lat),
                  lng: parseFloat(result.lon)
                }
              },
              name: result.address?.road || result.address?.neighbourhood || result.display_name.split(',')[0]
            };

            return res.json({
              success: true,
              place
            });
          }
        }
      }
    }

    // For other place_ids or if OSM lookup fails, try reverse geocoding
    if (lat && lon) {
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?` +
        `format=json` +
        `&lat=${lat}` +
        `&lon=${lon}` +
        `&addressdetails=1` +
        `&accept-language=es`;

      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'EmpleadasDomesticasApp/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const place = {
          formatted_address: data.display_name || 'Buenos Aires, Argentina',
          geometry: {
            location: {
              lat: parseFloat(lat),
              lng: parseFloat(lon)
            }
          },
          name: data.address?.road || data.address?.neighbourhood || 'Ubicación'
        };

        return res.json({
          success: true,
          place
        });
      }
    }

    // If all else fails, return null to trigger fallback
    return res.json({
      success: true,
      place: null
    });

  } catch (error) {
    console.error('Places details API error:', error);
    
    return res.json({
      success: true,
      place: null
    });
  }
}