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
      description: 'Barracas, Ciudad Autónoma de Buenos Aires, Argentina',
      main_text: 'Barracas',
      secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina',
      structured_formatting: {
        main_text: 'Barracas',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
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
    'place_1': { lat: -34.5875, lng: -58.3974 }, // Palermo
    'place_2': { lat: -34.5889, lng: -58.3993 }, // Recoleta
    'place_3': { lat: -34.5627, lng: -58.4546 }, // Belgrano
    'place_4': { lat: -34.5998, lng: -58.4314 }, // Villa Crespo
    'place_5': { lat: -34.6214, lng: -58.3731 }, // San Telmo
    'place_6': { lat: -34.6403, lng: -58.3816 }  // Barracas
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
  
  const placeDetails: { [key: string]: any } = {
    'place_1': {
      formatted_address: 'Palermo, Ciudad Autónoma de Buenos Aires, Argentina',
      geometry: {
        location: { lat: -34.5875, lng: -58.3974 }
      },
      name: 'Palermo'
    },
    'place_2': {
      formatted_address: 'Recoleta, Ciudad Autónoma de Buenos Aires, Argentina',
      geometry: {
        location: { lat: -34.5889, lng: -58.3993 }
      },
      name: 'Recoleta'
    },
    'place_3': {
      formatted_address: 'Belgrano, Ciudad Autónoma de Buenos Aires, Argentina',
      geometry: {
        location: { lat: -34.5627, lng: -58.4546 }
      },
      name: 'Belgrano'
    },
    'place_4': {
      formatted_address: 'Villa Crespo, Ciudad Autónoma de Buenos Aires, Argentina',
      geometry: {
        location: { lat: -34.5998, lng: -58.4314 }
      },
      name: 'Villa Crespo'
    },
    'place_5': {
      formatted_address: 'San Telmo, Ciudad Autónoma de Buenos Aires, Argentina',
      geometry: {
        location: { lat: -34.6214, lng: -58.3731 }
      },
      name: 'San Telmo'
    },
    'place_6': {
      formatted_address: 'Barracas, Ciudad Autónoma de Buenos Aires, Argentina',
      geometry: {
        location: { lat: -34.6403, lng: -58.3816 }
      },
      name: 'Barracas'
    }
  };

  return placeDetails[placeId] || null;
};