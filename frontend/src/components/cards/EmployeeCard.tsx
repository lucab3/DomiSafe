'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart, 
  MessageCircle, 
  Calendar,
  Shield,
  Globe,
  Award,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Employee {
  id: string;
  name: string;
  photo_url?: string;
  zone: string;
  services_offered: string[];
  languages: string[];
  experience_years: number;
  hourly_rate: number;
  average_rating: number;
  total_reviews: number;
  current_status: string;
  distance_km?: number;
}

interface EmployeeCardProps {
  employee: Employee;
  onContact?: (employeeId: string) => void;
  onFavorite?: (employeeId: string) => void;
  onViewDetails?: (employeeId: string) => void;
}

const serviceLabels: { [key: string]: { label: string; icon: string } } = {
  cleaning: { label: 'Limpieza', icon: '🏠' },
  cooking: { label: 'Cocina', icon: '👩‍🍳' },
  babysitting: { label: 'Niñera', icon: '👶' },
  elderly_care: { label: 'Adultos Mayores', icon: '👵' },
  event: { label: 'Eventos', icon: '🎉' }
};

const statusLabels: { [key: string]: { label: string; color: string } } = {
  available: { label: 'Disponible', color: 'text-green-600 bg-green-100' },
  working: { label: 'Trabajando', color: 'text-yellow-600 bg-yellow-100' },
  unavailable: { label: 'No disponible', color: 'text-red-600 bg-red-100' }
};

export default function EmployeeCard({ 
  employee, 
  onContact, 
  onFavorite, 
  onViewDetails 
}: EmployeeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(employee.id);
  };

  const handleContact = () => {
    onContact?.(employee.id);
  };

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
    onViewDetails?.(employee.id);
  };

  const statusInfo = statusLabels[employee.current_status] || statusLabels.unavailable;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card-hover bg-white border border-gray-200"
    >
      <div className="flex flex-col md:flex-row">
        {/* Foto y estado */}
        <div className="relative flex-shrink-0">
          <div className="w-full md:w-32 h-48 md:h-32 relative">
            {employee.photo_url ? (
              <Image
                src={employee.photo_url}
                alt={employee.name}
                fill
                className="object-cover rounded-lg md:rounded-l-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg md:rounded-l-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {employee.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Badge de estado */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </div>
            
            {/* Badge verificado */}
            <div className="absolute bottom-2 left-2 bg-white rounded-full p-1 shadow-sm">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* Información principal */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {employee.name}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{employee.zone}</span>
                  {employee.distance_km && (
                    <span className="ml-1">({employee.distance_km} km)</span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  <span>{employee.experience_years} años exp.</span>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(employee.average_rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {employee.average_rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({employee.total_reviews} reseñas)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                ${employee.hourly_rate.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">por hora</div>
            </div>
          </div>

          {/* Servicios */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {employee.services_offered.slice(0, 3).map((service) => {
                const serviceInfo = serviceLabels[service] || { label: service, icon: '⭐' };
                return (
                  <span
                    key={service}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                  >
                    <span className="mr-1">{serviceInfo.icon}</span>
                    {serviceInfo.label}
                  </span>
                );
              })}
              {employee.services_offered.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{employee.services_offered.length - 3} más
                </span>
              )}
            </div>
          </div>

          {/* Idiomas */}
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-2" />
              <span>{employee.languages.join(', ')}</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                onClick={handleContact}
                className="btn-primary flex items-center space-x-2"
                disabled={employee.current_status === 'unavailable'}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contactar</span>
              </button>
              
              <button
                onClick={handleViewDetails}
                className="btn-outline flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar</span>
              </button>
            </div>

            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'text-red-600 bg-red-50 hover:bg-red-100'
                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Detalles expandidos */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Todos los servicios:</h4>
                  <ul className="space-y-1">
                    {employee.services_offered.map((service) => {
                      const serviceInfo = serviceLabels[service] || { label: service, icon: '⭐' };
                      return (
                        <li key={service} className="flex items-center">
                          <span className="mr-2">{serviceInfo.icon}</span>
                          {serviceInfo.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Disponibilidad:</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Lunes a Viernes: 9:00 - 17:00</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Sábados: 9:00 - 13:00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Ver Teléfono</span>
                  </button>
                  
                  <button className="btn-outline flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Ver Reseñas</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}