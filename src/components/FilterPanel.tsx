'use client';

import { useState } from 'react';
import { X, MapPin, Star, DollarSign, Globe, Clock, Users } from 'lucide-react';
import LocationInput from './LocationInput';

interface Filters {
  zone: string;
  services: string[];
  min_rating: number;
  max_rate: number;
  languages: string[];
  availability: string;
  distance: number;
}

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose?: () => void;
}

const serviceOptions = [
  { id: 'cleaning', label: 'Limpieza del Hogar', icon: '🏠' },
  { id: 'cooking', label: 'Cocina', icon: '👩‍🍳' },
  { id: 'babysitting', label: 'Cuidado de Niños', icon: '👶' },
  { id: 'elderly_care', label: 'Cuidado de Adultos Mayores', icon: '👵' },
  { id: 'event', label: 'Eventos Especiales', icon: '🎉' }
];

const languageOptions = [
  'Español',
  'Inglés',
  'Portugués',
  'Italiano',
  'Francés'
];

const availabilityOptions = [
  { id: 'morning', label: 'Mañana (8:00 - 12:00)' },
  { id: 'afternoon', label: 'Tarde (12:00 - 18:00)' },
  { id: 'evening', label: 'Noche (18:00 - 22:00)' },
  { id: 'weekend', label: 'Fines de semana' },
  { id: 'flexible', label: 'Horario flexible' }
];

export default function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleServiceToggle = (serviceId: string) => {
    const newServices = filters.services.includes(serviceId)
      ? filters.services.filter(s => s !== serviceId)
      : [...filters.services, serviceId];
    
    handleFilterChange('services', newServices);
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    
    handleFilterChange('languages', newLanguages);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      zone: '',
      services: [],
      min_rating: 0,
      max_rate: 0,
      languages: [],
      availability: '',
      distance: 20
    });
  };

  const activeFiltersCount = 
    (filters.zone ? 1 : 0) +
    filters.services.length +
    (filters.min_rating > 0 ? 1 : 0) +
    (filters.max_rate > 0 ? 1 : 0) +
    filters.languages.length +
    (filters.availability ? 1 : 0) +
    (filters.distance !== 20 ? 1 : 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              {activeFiltersCount} activos
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar todo
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ubicación y Distancia */}
        <div className="space-y-4">
          <div>
            <label className="label-field">
              <MapPin className="w-4 h-4 inline mr-2" />
              Zona preferida
            </label>
            <LocationInput
              placeholder="Buscar zona o barrio..."
              onLocationSelect={(location) => {
                handleFilterChange('zone', location.address.split(',')[0]);
              }}
            />
            {filters.zone && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  {filters.zone}
                  <button
                    onClick={() => handleFilterChange('zone', '')}
                    className="ml-2 hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="label-field">Distancia máxima: {filters.distance} km</label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.distance}
              onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          <div>
            <label className="label-field">
              <Star className="w-4 h-4 inline mr-2" />
              Calificación mínima
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('min_rating', filters.min_rating === rating ? 0 : rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                    filters.min_rating >= rating
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${filters.min_rating >= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                  <span className="text-sm">{rating}+</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Servicios y Disponibilidad */}
        <div className="space-y-4">
          <div>
            <label className="label-field">
              <Users className="w-4 h-4 inline mr-2" />
              Servicios
            </label>
            <div className="space-y-2">
              {serviceOptions.map(service => (
                <label
                  key={service.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    filters.services.includes(service.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="sr-only"
                  />
                  <span className="text-xl mr-3">{service.icon}</span>
                  <span className="text-sm font-medium">{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label-field">
              <Clock className="w-4 h-4 inline mr-2" />
              Disponibilidad
            </label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="input-field"
            >
              <option value="">Cualquier horario</option>
              {availabilityOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Precio e Idiomas */}
        <div className="space-y-4">
          <div>
            <label className="label-field">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Precio máximo por hora
            </label>
            <input
              type="number"
              placeholder="Ej: 1500"
              value={filters.max_rate || ''}
              onChange={(e) => handleFilterChange('max_rate', parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
              step="100"
            />
            <div className="text-xs text-gray-500 mt-1">
              Rango típico: $800 - $2000 por hora
            </div>
          </div>

          <div>
            <label className="label-field">
              <Globe className="w-4 h-4 inline mr-2" />
              Idiomas
            </label>
            <div className="space-y-2">
              {languageOptions.map(language => (
                <label
                  key={language}
                  className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                    filters.languages.includes(language)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{language}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Filters Button - Solo en móvil */}
      <div className="mt-6 lg:hidden">
        <button
          onClick={onClose}
          className="btn-primary w-full"
        >
          Aplicar Filtros ({activeFiltersCount})
        </button>
      </div>
    </div>
  );
}