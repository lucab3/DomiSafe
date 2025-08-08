'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationInputProps {
  onLocationSelect?: (location: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationInput({ 
  onLocationSelect, 
  placeholder = "Buscar dirección...",
  className = ""
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions para demo (CABA + Provincia de Buenos Aires)
  const mockSuggestions = [
    // Ciudad Autónoma de Buenos Aires
    { 
      description: 'Palermo, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '1',
      structured_formatting: {
        main_text: 'Palermo',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5755, lng: -58.4201 } }
    },
    { 
      description: 'Recoleta, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '2',
      structured_formatting: {
        main_text: 'Recoleta',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5881, lng: -58.3959 } }
    },
    { 
      description: 'Belgrano, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '3',
      structured_formatting: {
        main_text: 'Belgrano',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5627, lng: -58.4581 } }
    },
    { 
      description: 'Villa Crespo, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '4',
      structured_formatting: {
        main_text: 'Villa Crespo',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5989, lng: -58.4389 } }
    },
    { 
      description: 'San Telmo, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '5',
      structured_formatting: {
        main_text: 'San Telmo',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6211, lng: -58.3731 } }
    },
    { 
      description: 'Puerto Madero, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '6',
      structured_formatting: {
        main_text: 'Puerto Madero',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6118, lng: -58.3645 } }
    },
    { 
      description: 'Caballito, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '7',
      structured_formatting: {
        main_text: 'Caballito',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6198, lng: -58.4395 } }
    },
    { 
      description: 'Núñez, Ciudad Autónoma de Buenos Aires, Argentina',
      place_id: '8',
      structured_formatting: {
        main_text: 'Núñez',
        secondary_text: 'Ciudad Autónoma de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5446, lng: -58.4631 } }
    },
    // Zona Norte - Provincia de Buenos Aires
    { 
      description: 'Vicente López, Provincia de Buenos Aires, Argentina',
      place_id: '9',
      structured_formatting: {
        main_text: 'Vicente López',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5267, lng: -58.4794 } }
    },
    { 
      description: 'San Isidro, Provincia de Buenos Aires, Argentina',
      place_id: '10',
      structured_formatting: {
        main_text: 'San Isidro',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.4708, lng: -58.5133 } }
    },
    { 
      description: 'Martinez, Provincia de Buenos Aires, Argentina',
      place_id: '11',
      structured_formatting: {
        main_text: 'Martinez',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.4881, lng: -58.5072 } }
    },
    { 
      description: 'Tigre, Provincia de Buenos Aires, Argentina',
      place_id: '12',
      structured_formatting: {
        main_text: 'Tigre',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.4264, lng: -58.5797 } }
    },
    { 
      description: 'San Fernando, Provincia de Buenos Aires, Argentina',
      place_id: '13',
      structured_formatting: {
        main_text: 'San Fernando',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.4417, lng: -58.5594 } }
    },
    { 
      description: 'Pilar, Provincia de Buenos Aires, Argentina',
      place_id: '14',
      structured_formatting: {
        main_text: 'Pilar',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.4588, lng: -58.9142 } }
    },
    { 
      description: 'Escobar, Provincia de Buenos Aires, Argentina',
      place_id: '15',
      structured_formatting: {
        main_text: 'Escobar',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.3483, lng: -58.7944 } }
    },
    // Zona Oeste - Provincia de Buenos Aires
    { 
      description: 'Morón, Provincia de Buenos Aires, Argentina',
      place_id: '16',
      structured_formatting: {
        main_text: 'Morón',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6534, lng: -58.6198 } }
    },
    { 
      description: 'Hurlingham, Provincia de Buenos Aires, Argentina',
      place_id: '17',
      structured_formatting: {
        main_text: 'Hurlingham',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.5900, lng: -58.6340 } }
    },
    { 
      description: 'Ituzaingó, Provincia de Buenos Aires, Argentina',
      place_id: '18',
      structured_formatting: {
        main_text: 'Ituzaingó',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6583, lng: -58.6667 } }
    },
    { 
      description: 'Ramos Mejía, Provincia de Buenos Aires, Argentina',
      place_id: '19',
      structured_formatting: {
        main_text: 'Ramos Mejía',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6408, lng: -58.5653 } }
    },
    // Zona Sur - Provincia de Buenos Aires
    { 
      description: 'Avellaneda, Provincia de Buenos Aires, Argentina',
      place_id: '20',
      structured_formatting: {
        main_text: 'Avellaneda',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6627, lng: -58.3656 } }
    },
    { 
      description: 'Quilmes, Provincia de Buenos Aires, Argentina',
      place_id: '21',
      structured_formatting: {
        main_text: 'Quilmes',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.7206, lng: -58.2544 } }
    },
    { 
      description: 'Lomas de Zamora, Provincia de Buenos Aires, Argentina',
      place_id: '22',
      structured_formatting: {
        main_text: 'Lomas de Zamora',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.7603, lng: -58.4033 } }
    },
    { 
      description: 'Temperley, Provincia de Buenos Aires, Argentina',
      place_id: '23',
      structured_formatting: {
        main_text: 'Temperley',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.7667, lng: -58.3944 } }
    },
    { 
      description: 'Banfield, Provincia de Buenos Aires, Argentina',
      place_id: '24',
      structured_formatting: {
        main_text: 'Banfield',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.7453, lng: -58.3928 } }
    },
    { 
      description: 'Lanús, Provincia de Buenos Aires, Argentina',
      place_id: '25',
      structured_formatting: {
        main_text: 'Lanús',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.7069, lng: -58.3903 } }
    },
    { 
      description: 'San Justo, Provincia de Buenos Aires, Argentina',
      place_id: '26',
      structured_formatting: {
        main_text: 'San Justo',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6842, lng: -58.5597 } }
    },
    { 
      description: 'La Matanza, Provincia de Buenos Aires, Argentina',
      place_id: '27',
      structured_formatting: {
        main_text: 'La Matanza',
        secondary_text: 'Provincia de Buenos Aires, Argentina'
      },
      geometry: { location: { lat: -34.6700, lng: -58.6250 } }
    }
  ];

  useEffect(() => {
    if (inputValue.length > 2) {
      setIsLoading(true);
      
      // Simular búsqueda con delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.description.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(suggestion.description);
    setSuggestions([]);
    
    if (onLocationSelect) {
      onLocationSelect({
        address: suggestion.description,
        lat: suggestion.geometry.location.lat,
        lng: suggestion.geometry.location.lng
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Mock reverse geocoding
          setInputValue('Tu ubicación actual');
          setIsLoading(false);
          
          if (onLocationSelect) {
            onLocationSelect({
              address: 'Tu ubicación actual',
              lat,
              lng
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          alert('No se pudo obtener tu ubicación');
        }
      );
    } else {
      alert('La geolocalización no está soportada en este navegador');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="input-field pl-10 pr-12"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800 transition-colors"
          title="Usar mi ubicación actual"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-600">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}