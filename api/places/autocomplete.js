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
    const { input } = req.query;

    if (!input || input.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    // Use OpenStreetMap Nominatim API (free!)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(input + ', Buenos Aires, Argentina')}` +
      `&format=json` +
      `&addressdetails=1` +
      `&limit=10` +
      `&countrycodes=ar` +
      `&accept-language=es` +
      `&bounded=1` +
      `&viewbox=-59.0,-35.5,-57.5,-33.5`; // Bounding box around Buenos Aires area

    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'EmpleadasDomesticasApp/1.0'
      }
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const data = await response.json();

    // Transform Nominatim response to our format
    const suggestions = data.map((place, index) => {
      // Create structured addressing
      const address = place.address || {};
      const mainParts = [];
      const secondaryParts = [];

      // Primary address components
      if (address.house_number && address.road) {
        mainParts.push(`${address.road} ${address.house_number}`);
      } else if (address.road) {
        mainParts.push(address.road);
      } else if (address.neighbourhood || address.suburb) {
        mainParts.push(address.neighbourhood || address.suburb);
      } else if (address.city_district) {
        mainParts.push(address.city_district);
      }

      // Secondary components
      if (address.neighbourhood && !mainParts.includes(address.neighbourhood)) {
        secondaryParts.push(address.neighbourhood);
      }
      if (address.suburb && !mainParts.includes(address.suburb)) {
        secondaryParts.push(address.suburb);
      }
      if (address.city_district && !mainParts.includes(address.city_district)) {
        secondaryParts.push(address.city_district);
      }
      if (address.city && address.city !== 'Buenos Aires') {
        secondaryParts.push(address.city);
      } else if (address.state && address.state !== 'Buenos Aires') {
        secondaryParts.push(address.state);
      }

      const mainText = mainParts.length > 0 ? mainParts[0] : place.display_name.split(',')[0];
      const secondaryText = secondaryParts.length > 0 
        ? secondaryParts.slice(0, 2).join(', ') 
        : 'Buenos Aires, Argentina';

      return {
        place_id: `osm_${place.place_id || index}`,
        description: place.display_name,
        main_text: mainText,
        secondary_text: secondaryText,
        structured_formatting: {
          main_text: mainText,
          secondary_text: secondaryText
        },
        // Store OSM specific data for details retrieval
        osm_id: place.osm_id,
        osm_type: place.osm_type,
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon)
      };
    });

    return res.json({
      success: true,
      suggestions: suggestions.slice(0, 8) // Limit to 8 results
    });

  } catch (error) {
    console.error('Places autocomplete API error:', error);
    
    // Return empty array to trigger fallback to mock data
    return res.json({
      success: true,
      suggestions: []
    });
  }
}