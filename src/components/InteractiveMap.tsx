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
        className="relative cursor-crosshair overflow-hidden"
        style={{ height }}
        onClick={handleMapClick}
      >
        {/* Fondo tipo mapa de Buenos Aires */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), 
                             url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#f3f4f6'
          }}
        />
        
        {/* Simulación de área metropolitana de Buenos Aires */}
        <div className="absolute inset-0">
          {/* Rio de la Plata (arriba) */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-blue-300 to-blue-200 opacity-60" />
          
          {/* Calles principales */}
          <div className="absolute top-20 left-0 right-0 h-1 bg-yellow-400 opacity-70" /> {/* Av. del Libertador */}
          <div className="absolute top-32 left-0 right-0 h-1 bg-yellow-400 opacity-70" /> {/* Av. Santa Fe */}
          <div className="absolute top-44 left-0 right-0 h-1 bg-yellow-400 opacity-70" /> {/* Av. Corrientes */}
          <div className="absolute top-56 left-0 right-0 h-1 bg-yellow-400 opacity-70" /> {/* Av. Rivadavia */}
          
          {/* Calles verticales */}
          <div className="absolute top-16 bottom-0 left-1/6 w-0.5 bg-gray-500 opacity-40" />
          <div className="absolute top-16 bottom-0 left-2/6 w-1 bg-yellow-400 opacity-70" /> {/* Av. 9 de Julio */}
          <div className="absolute top-16 bottom-0 left-3/6 w-0.5 bg-gray-500 opacity-40" />
          <div className="absolute top-16 bottom-0 left-4/6 w-0.5 bg-gray-500 opacity-40" />
          <div className="absolute top-16 bottom-0 left-5/6 w-0.5 bg-gray-500 opacity-40" />
          
          {/* Zonas identificables */}
          {/* Puerto Madero */}
          <div className="absolute top-44 left-2/6 w-8 h-8 bg-blue-100 opacity-50 rounded" />
          
          {/* Parque 3 de Febrero (Palermo) */}
          <div className="absolute top-28 left-1/6 w-12 h-6 bg-green-300 opacity-60 rounded" />
          
          {/* Plaza San Martin */}
          <div className="absolute top-36 left-2/6 w-4 h-4 bg-green-300 opacity-60 rounded-full" />
          
          {/* Retiro (estación) */}
          <div className="absolute top-24 left-2/6 w-3 h-3 bg-red-400 opacity-70 rounded" />
        </div>
        
        {/* Grid sutil */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-gray-300" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-gray-300" style={{ left: `${i * 10}%` }} />
          ))}
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