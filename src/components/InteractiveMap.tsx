'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Minus } from 'lucide-react';

interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface InteractiveMapProps {
  onLocationSelect?: (location: MapLocation) => void;
  initialLocation?: MapLocation;
  height?: string;
  showEmployees?: boolean;
}

export default function InteractiveMap({ 
  onLocationSelect, 
  initialLocation,
  height = "400px",
  showEmployees = false
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    initialLocation || null
  );
  const [zoom, setZoom] = useState(13);

  // Mock employee locations para demo
  const employeeLocations = [
    { id: '1', name: 'Rosa Martínez', lat: -34.5755, lng: -58.4201, zone: 'Palermo' },
    { id: '2', name: 'Carmen Rodríguez', lat: -34.5881, lng: -58.3959, zone: 'Recoleta' },
    { id: '3', name: 'Lucía Fernández', lat: -34.5989, lng: -58.4389, zone: 'Villa Crespo' },
    { id: '4', name: 'Ana Gómez', lat: -34.5627, lng: -58.4581, zone: 'Belgrano' },
  ];

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simular conversión de coordenadas de píxeles a lat/lng
    // En una implementación real, esto sería manejado por la API del mapa
    const lat = -34.6 + (y / rect.height - 0.5) * 0.2;
    const lng = -58.4 + (x / rect.width - 0.5) * 0.3;
    
    const newLocation = { lat, lng, address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}` };
    setSelectedLocation(newLocation);
    onLocationSelect?.(newLocation);
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const zoomOut = () => setZoom(prev => Math.max(prev - 1, 8));

  const getEmployeePosition = (employee: any) => {
    // Convertir lat/lng a posición en el contenedor
    const x = ((employee.lng + 58.4) / 0.3 + 0.5) * 100;
    const y = ((employee.lat + 34.6) / 0.2 + 0.5) * 100;
    return { x: `${Math.max(5, Math.min(95, x))}%`, y: `${Math.max(5, Math.min(95, y))}%` };
  };

  const getSelectedPosition = () => {
    if (!selectedLocation) return null;
    const x = ((selectedLocation.lng + 58.4) / 0.3 + 0.5) * 100;
    const y = ((selectedLocation.lat + 34.6) / 0.2 + 0.5) * 100;
    return { x: `${Math.max(5, Math.min(95, x))}%`, y: `${Math.max(5, Math.min(95, y))}%` };
  };

  const selectedPos = getSelectedPosition();

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <div 
        className="relative bg-gradient-to-br from-green-200 via-blue-200 to-blue-300 cursor-crosshair"
        style={{ height }}
        onClick={handleMapClick}
      >
        {/* Simulación de calles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-400 opacity-50" />
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 opacity-50" />
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-400 opacity-50" />
          <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-gray-400 opacity-50" />
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400 opacity-50" />
          <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-gray-400 opacity-50" />
        </div>

        {/* Marcadores de empleadas */}
        {showEmployees && employeeLocations.map((employee) => {
          const position = getEmployeePosition(employee);
          return (
            <div
              key={employee.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: position.x, top: position.y }}
            >
              <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {employee.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Marcador de ubicación seleccionada */}
        {selectedPos && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: selectedPos.x, top: selectedPos.y }}
          >
            <MapPin className="w-8 h-8 text-red-600 drop-shadow-lg" />
          </div>
        )}

        {/* Controles de zoom */}
        <div className="absolute top-4 right-4 flex flex-col space-y-1">
          <button
            onClick={zoomIn}
            className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Indicador de zoom */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          Zoom: {zoom}
        </div>
      </div>

      {/* Información de ubicación seleccionada */}
      {selectedLocation && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Ubicación seleccionada</div>
              <div className="text-xs text-gray-600">
                {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm">
        {showEmployees ? (
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span>Empleadas disponibles</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-red-600" />
              <span>Tu ubicación</span>
            </div>
          </div>
        ) : (
          <span>Haz clic para seleccionar ubicación</span>
        )}
      </div>
    </div>
  );
}