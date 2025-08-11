'use client';

import { useState, useEffect } from 'react';
import { MapPin, User, Clock, Phone, Star } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'working' | 'offline';
  current_service?: {
    client_name: string;
    address: string;
    end_time: string;
  };
  phone: string;
  rating: number;
  zone: string;
}

interface AdminMapProps {
  onEmployeeClick?: (employee: Employee) => void;
}

export default function AdminMap({ onEmployeeClick }: AdminMapProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -34.6118, lng: -58.3960 }); // Buenos Aires

  // Mock employees data with real Buenos Aires coordinates
  const mockEmployees: Employee[] = [
    {
      id: 'emp_1',
      name: 'Rosa Martínez',
      photo_url: 'https://images.unsplash.com/photo-1494790108755-2616c0763c99?w=400',
      latitude: -34.5875,
      longitude: -58.3974, // Palermo
      status: 'working',
      current_service: {
        client_name: 'María García',
        address: 'Av. Santa Fe 1234',
        end_time: '17:00'
      },
      phone: '+54 11 1234-5678',
      rating: 4.8,
      zone: 'Palermo'
    },
    {
      id: 'emp_2',
      name: 'Carmen Rodríguez',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      latitude: -34.5889,
      longitude: -58.3993, // Recoleta
      status: 'available',
      phone: '+54 11 2345-6789',
      rating: 4.9,
      zone: 'Recoleta'
    },
    {
      id: 'emp_3',
      name: 'Lucía Fernández',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      latitude: -34.5627,
      longitude: -58.4546, // Belgrano
      status: 'working',
      current_service: {
        client_name: 'Ana López',
        address: 'Av. Cabildo 890',
        end_time: '16:00'
      },
      phone: '+54 11 3456-7890',
      rating: 4.7,
      zone: 'Belgrano'
    },
    {
      id: 'emp_4',
      name: 'Ana Gómez',
      photo_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      latitude: -34.6037,
      longitude: -58.3816, // Centro
      status: 'available',
      phone: '+54 11 4567-8901',
      rating: 4.6,
      zone: 'Centro'
    },
    {
      id: 'emp_5',
      name: 'Sofía Torres',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      latitude: -34.6214,
      longitude: -58.3731, // San Telmo
      status: 'offline',
      phone: '+54 11 5678-9012',
      rating: 4.5,
      zone: 'San Telmo'
    }
  ];

  useEffect(() => {
    // Simulate loading employees from API
    setEmployees(mockEmployees);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'working':
        return 'bg-blue-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'working':
        return 'Trabajando';
      case 'offline':
        return 'Desconectada';
      default:
        return 'Desconocido';
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    onEmployeeClick?.(employee);
  };

  const zoomToEmployee = (employee: Employee) => {
    setMapCenter({ lat: employee.latitude, lng: employee.longitude });
    setSelectedEmployee(employee);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Empleadas en Tiempo Real
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Trabajando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Desconectada</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Map Area */}
        <div className="flex-1 relative bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Mapa de Google integrado</p>
              <p className="text-sm text-gray-500">
                Coordenadas: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Simulated employee markers */}
          <div className="absolute inset-0">
            {employees.map((employee, index) => (
              <div
                key={employee.id}
                className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(employee.status)} hover:scale-110 transition-transform`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + (index % 3) * 20}%`
                }}
                onClick={() => handleEmployeeClick(employee)}
              >
                <img 
                  src={employee.photo_url} 
                  alt={employee.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Employee List Sidebar */}
        <div className="w-80 border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Empleadas Activas ({employees.length})</h4>
          </div>
          
          <div className="space-y-2 p-2">
            {employees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => zoomToEmployee(employee)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedEmployee?.id === employee.id 
                    ? 'bg-primary-50 border-primary-200 border' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={employee.photo_url} 
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(employee.status)}`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 text-sm truncate">
                      {employee.name}
                    </h5>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{employee.zone}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{employee.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(employee.status)}`}></div>
                      <span className="text-gray-600">{getStatusText(employee.status)}</span>
                    </div>
                    
                    {employee.current_service && (
                      <div className="mt-1 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{employee.current_service.client_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Termina a las {employee.current_service.end_time}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Employee Details */}
      {selectedEmployee && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedEmployee.photo_url} 
                alt={selectedEmployee.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{selectedEmployee.name}</h4>
                <p className="text-sm text-gray-600">{selectedEmployee.zone}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedEmployee.status)}`}></div>
                  <span className="text-gray-700">{getStatusText(selectedEmployee.status)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
                <Phone className="w-3 h-3" />
                <span>Llamar</span>
              </button>
              <button 
                onClick={() => onEmployeeClick?.(selectedEmployee)}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm hover:bg-primary-200"
              >
                Ver Perfil
              </button>
            </div>
          </div>
          
          {selectedEmployee.current_service && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
              <h5 className="font-medium text-gray-900 text-sm mb-2">Servicio Actual</h5>
              <div className="space-y-1 text-xs text-gray-600">
                <div><strong>Cliente:</strong> {selectedEmployee.current_service.client_name}</div>
                <div><strong>Dirección:</strong> {selectedEmployee.current_service.address}</div>
                <div><strong>Termina:</strong> {selectedEmployee.current_service.end_time}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}