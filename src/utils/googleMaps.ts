// Google Maps utility functions

export interface PlaceSuggestion {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// Mock Google Places API for development
export const getMockPlaceSuggestions = async (input: string): Promise<PlaceSuggestion[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!input || input.length < 2) {
    return [];
  }

  const mockSuggestions: PlaceSuggestion[] = [
    // Ciudad Autónoma de Buenos Aires
    {
      place_id: 'place_1',
      description: 'Palermo, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Palermo',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Palermo',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_2',
      description: 'Recoleta, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Recoleta',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Recoleta',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_3',
      description: 'Belgrano, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Belgrano',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Belgrano',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_4',
      description: 'Villa Crespo, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Villa Crespo',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Villa Crespo',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_5',
      description: 'San Telmo, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'San Telmo',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'San Telmo',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_6',
      description: 'Puerto Madero, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Puerto Madero',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Puerto Madero',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_7',
      description: 'Caballito, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Caballito',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Caballito',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_8',
      description: 'Núñez, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Núñez',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Núñez',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_9',
      description: 'La Boca, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'La Boca',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'La Boca',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_10',
      description: 'Retiro, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Retiro',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Retiro',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      }
    },
    // Zona Norte - Provincia de Buenos Aires
    {
      place_id: 'place_11',
      description: 'Vicente López, Provincia de Buenos Aires, Argentina',
      main_text: 'Vicente López',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Vicente López',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_12',
      description: 'San Isidro, Provincia de Buenos Aires, Argentina',
      main_text: 'San Isidro',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'San Isidro',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_13',
      description: 'Martinez, Provincia de Buenos Aires, Argentina',
      main_text: 'Martinez',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Martinez',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_14',
      description: 'Tigre, Provincia de Buenos Aires, Argentina',
      main_text: 'Tigre',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Tigre',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_15',
      description: 'San Fernando, Provincia de Buenos Aires, Argentina',
      main_text: 'San Fernando',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'San Fernando',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_16',
      description: 'Pilar, Provincia de Buenos Aires, Argentina',
      main_text: 'Pilar',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Pilar',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_17',
      description: 'Escobar, Provincia de Buenos Aires, Argentina',
      main_text: 'Escobar',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Escobar',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    // Zona Oeste - Provincia de Buenos Aires
    {
      place_id: 'place_18',
      description: 'Morón, Provincia de Buenos Aires, Argentina',
      main_text: 'Morón',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Morón',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_19',
      description: 'Hurlingham, Provincia de Buenos Aires, Argentina',
      main_text: 'Hurlingham',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Hurlingham',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_20',
      description: 'Ituzaingó, Provincia de Buenos Aires, Argentina',
      main_text: 'Ituzaingó',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Ituzaingó',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_21',
      description: 'Ramos Mejía, Provincia de Buenos Aires, Argentina',
      main_text: 'Ramos Mejía',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Ramos Mejía',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_22',
      description: 'Castelar, Provincia de Buenos Aires, Argentina',
      main_text: 'Castelar',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Castelar',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_23',
      description: 'El Palomar, Provincia de Buenos Aires, Argentina',
      main_text: 'El Palomar',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'El Palomar',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    // Zona Sur - Provincia de Buenos Aires
    {
      place_id: 'place_24',
      description: 'Avellaneda, Provincia de Buenos Aires, Argentina',
      main_text: 'Avellaneda',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Avellaneda',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_25',
      description: 'Quilmes, Provincia de Buenos Aires, Argentina',
      main_text: 'Quilmes',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Quilmes',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_26',
      description: 'Lomas de Zamora, Provincia de Buenos Aires, Argentina',
      main_text: 'Lomas de Zamora',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Lomas de Zamora',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_27',
      description: 'Temperley, Provincia de Buenos Aires, Argentina',
      main_text: 'Temperley',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Temperley',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_28',
      description: 'Banfield, Provincia de Buenos Aires, Argentina',
      main_text: 'Banfield',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Banfield',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_29',
      description: 'Lanús, Provincia de Buenos Aires, Argentina',
      main_text: 'Lanús',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Lanús',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    },
    {
      place_id: 'place_30',
      description: 'San Justo, Provincia de Buenos Aires, Argentina',
      main_text: 'San Justo',
      secondary_text: 'Provincia de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'San Justo',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      }
    }
  ];

  // Filter suggestions based on input
  return mockSuggestions.filter(suggestion => 
    suggestion.main_text.toLowerCase().includes(input.toLowerCase()) ||
    suggestion.description.toLowerCase().includes(input.toLowerCase())
  );
};

export const getMockCoordinatesFromPlaceId = async (placeId: string): Promise<Coordinates> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const placeCoordinates: { [key: string]: Coordinates } = {
    // CABA
    'place_1': { lat: -34.5875, lng: -58.3974 }, // Palermo
    'place_2': { lat: -34.5889, lng: -58.3993 }, // Recoleta
    'place_3': { lat: -34.5627, lng: -58.4546 }, // Belgrano
    'place_4': { lat: -34.5998, lng: -58.4314 }, // Villa Crespo
    'place_5': { lat: -34.6214, lng: -58.3731 }, // San Telmo
    'place_6': { lat: -34.6118, lng: -58.3645 }, // Puerto Madero
    'place_7': { lat: -34.6198, lng: -58.4395 }, // Caballito
    'place_8': { lat: -34.5446, lng: -58.4631 }, // Núñez
    'place_9': { lat: -34.6345, lng: -58.3632 }, // La Boca
    'place_10': { lat: -34.5936, lng: -58.3744 }, // Retiro
    // Zona Norte - Provincia
    'place_11': { lat: -34.5267, lng: -58.4794 }, // Vicente López
    'place_12': { lat: -34.4708, lng: -58.5133 }, // San Isidro
    'place_13': { lat: -34.4881, lng: -58.5072 }, // Martinez
    'place_14': { lat: -34.4264, lng: -58.5797 }, // Tigre
    'place_15': { lat: -34.4417, lng: -58.5594 }, // San Fernando
    'place_16': { lat: -34.4588, lng: -58.9142 }, // Pilar
    'place_17': { lat: -34.3483, lng: -58.7944 }, // Escobar
    // Zona Oeste - Provincia
    'place_18': { lat: -34.6534, lng: -58.6198 }, // Morón
    'place_19': { lat: -34.5900, lng: -58.6340 }, // Hurlingham
    'place_20': { lat: -34.6583, lng: -58.6667 }, // Ituzaingó
    'place_21': { lat: -34.6408, lng: -58.5653 }, // Ramos Mejía
    'place_22': { lat: -34.6389, lng: -58.6456 }, // Castelar
    'place_23': { lat: -34.6056, lng: -58.5956 }, // El Palomar
    // Zona Sur - Provincia
    'place_24': { lat: -34.6627, lng: -58.3656 }, // Avellaneda
    'place_25': { lat: -34.7206, lng: -58.2544 }, // Quilmes
    'place_26': { lat: -34.7603, lng: -58.4033 }, // Lomas de Zamora
    'place_27': { lat: -34.7667, lng: -58.3944 }, // Temperley
    'place_28': { lat: -34.7453, lng: -58.3928 }, // Banfield
    'place_29': { lat: -34.7069, lng: -58.3903 }, // Lanús
    'place_30': { lat: -34.6842, lng: -58.5597 }  // San Justo
  };

  return placeCoordinates[placeId] || { lat: -34.6118, lng: -58.3960 }; // Default to Buenos Aires center
};

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

function toRad(deg: number): number {
  return deg * (Math.PI/180);
}

// Mock function to get place details including formatted address
export const getPlaceDetails = async (placeId: string) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Get coordinates and create place details dynamically
  const coordinates = await getMockCoordinatesFromPlaceId(placeId);
  const suggestions = await getMockPlaceSuggestions(''); // Get all suggestions
  const place = suggestions.find(s => s.place_id === placeId);
  
  if (!place) return null;
  
  return {
    formatted_address: place.description,
    geometry: {
      location: coordinates
    },
    name: place.main_text
  };
};