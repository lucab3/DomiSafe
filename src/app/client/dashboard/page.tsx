'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock, 
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Shield,
  LogOut,
  Bell,
  Settings
} from 'lucide-react';
import EmployeeCard from '@/components/cards/EmployeeCard';
import FilterPanel from '@/components/FilterPanel';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LocationInput from '@/components/LocationInput';
import InteractiveMap from '@/components/InteractiveMap';
import { motion } from 'framer-motion';
import { calculateDistance } from '@/utils/googleMaps';

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
  latitude?: number;
  longitude?: number;
}

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showEmployees, setShowEmployees] = useState(true);
  const [requestForm, setRequestForm] = useState({
    service_description: '',
    additional_comments: ''
  });

  const [filters, setFilters] = useState({
    zone: '',
    services: [] as string[],
    min_rating: 0,
    max_rate: 0,
    languages: [] as string[],
    availability: '',
    distance: 20
  });

  // Mock data - en producción esto vendría de la API
  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'Rosa Martínez',
      photo_url: 'https://images.unsplash.com/photo-1494790108755-2616c0763c99?w=400',
      zone: 'Palermo',
      services_offered: ['cleaning', 'cooking'],
      languages: ['Español', 'Inglés'],
      experience_years: 8,
      hourly_rate: 1200,
      average_rating: 4.8,
      total_reviews: 24,
      current_status: 'available',
      latitude: -34.5875,
      longitude: -58.3974,
      distance_km: 2.5
    },
    {
      id: '2',
      name: 'Carmen Rodríguez',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      zone: 'Recoleta',
      services_offered: ['cleaning', 'babysitting'],
      languages: ['Español'],
      experience_years: 12,
      hourly_rate: 1100,
      average_rating: 4.9,
      total_reviews: 31,
      current_status: 'available',
      latitude: -34.5889,
      longitude: -58.3993,
      distance_km: 3.8
    },
    {
      id: '3',
      name: 'Lucía Fernández',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      zone: 'Villa Crespo',
      services_offered: ['cooking', 'elderly_care'],
      languages: ['Español', 'Italiano'],
      experience_years: 5,
      hourly_rate: 1300,
      average_rating: 4.7,
      total_reviews: 18,
      current_status: 'available',
      latitude: -34.5998,
      longitude: -58.4314,
      distance_km: 5.2
    },
    {
      id: '4',
      name: 'Ana Gómez',
      photo_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      zone: 'Belgrano',
      services_offered: ['cleaning', 'cooking', 'event'],
      languages: ['Español', 'Portugués'],
      experience_years: 10,
      hourly_rate: 1250,
      average_rating: 4.6,
      total_reviews: 22,
      current_status: 'working',
      latitude: -34.5627,
      longitude: -58.4546,
      distance_km: 7.1
    },
    {
      id: '5',
      name: 'Sofía Torres',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      zone: 'San Telmo',
      services_offered: ['babysitting', 'cleaning'],
      languages: ['Español', 'Inglés', 'Francés'],
      experience_years: 3,
      hourly_rate: 1150,
      average_rating: 5.0,
      total_reviews: 15,
      current_status: 'available',
      latitude: -34.6214,
      longitude: -58.3731,
      distance_km: 8.9
    }
  ];

  useEffect(() => {
    loadSettings();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, filters]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      // Primero cargar configuración
      const settingsResponse = await fetch('/api/admin/settings');
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json();
        setShowEmployees(settingsData.show_employees_to_clients);
        
        // Solo cargar empleadas si están visibles
        if (settingsData.show_employees_to_clients) {
          await loadEmployees();
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // En caso de error, mostrar empleadas por defecto
      await loadEmployees();
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  };

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setUserLocation({ lat: location.lat, lng: location.lng });
    // Update filters to trigger re-filtering
    setFilters(prev => ({ ...prev, zone: location.address.split(',')[0] }));
  };

  const handleRequestEmployee = async (employeeId: string) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: user?.id,
          employee_id: employeeId,
          service_type: employee?.services_offered.join(', ') || 'Servicios generales',
          preferred_zone: employee?.zone,
          request_type: 'direct',
          additional_comments: `Solicitud directa para ${employee?.name}`
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`¡Solicitud enviada a ${employee?.name}! Te contactarán pronto.`);
      } else {
        throw new Error(data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error al enviar la solicitud. Intenta nuevamente.');
    }
  };

  const handleFavoriteEmployee = (employeeId: string) => {
    // TODO: Implementar funcionalidad de favoritos
    console.log('Added to favorites:', employeeId);
  };

  const handleViewEmployeeDetails = (employeeId: string) => {
    // TODO: Implementar vista de detalles de empleada
    console.log('View details:', employeeId);
  };

  const handleGeneralRequest = async () => {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: user?.id,
          service_type: requestForm.service_description,
          preferred_zone: filters.zone,
          max_hourly_rate: filters.max_rate,
          preferred_schedule: filters.availability,
          additional_comments: requestForm.additional_comments,
          request_type: 'general'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('¡Solicitud enviada! Te contactaremos pronto con sugerencias de empleadas.');
        // Limpiar formulario
        setRequestForm({
          service_description: '',
          additional_comments: ''
        });
        setFilters({
          zone: '',
          services: [],
          min_rating: 0,
          max_rate: 0,
          languages: [],
          availability: '',
          distance: 20
        });
      } else {
        throw new Error(data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      console.error('Error sending general request:', error);
      alert('Error al enviar la solicitud. Intenta nuevamente.');
    }
  };

  const applyFilters = () => {
    let filtered = employees.map(emp => {
      // Calculate real distance if user location is available
      if (userLocation && emp.latitude && emp.longitude) {
        const distance = calculateDistance(
          { lat: userLocation.lat, lng: userLocation.lng },
          { lat: emp.latitude, lng: emp.longitude }
        );
        return { ...emp, distance_km: distance };
      }
      return emp;
    });

    // Filtro por búsqueda de texto
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.services_offered.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por distancia
    if (filters.distance > 0) {
      filtered = filtered.filter(emp => (emp.distance_km || 0) <= filters.distance);
    }

    // Filtros adicionales
    if (filters.zone) {
      filtered = filtered.filter(emp => emp.zone.toLowerCase().includes(filters.zone.toLowerCase()));
    }

    if (filters.services.length > 0) {
      filtered = filtered.filter(emp => 
        filters.services.some(service => emp.services_offered.includes(service))
      );
    }

    if (filters.min_rating > 0) {
      filtered = filtered.filter(emp => emp.average_rating >= filters.min_rating);
    }

    if (filters.max_rate > 0) {
      filtered = filtered.filter(emp => emp.hourly_rate <= filters.max_rate);
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter(emp => 
        filters.languages.some(lang => emp.languages.includes(lang))
      );
    }

    // Ordenar por distancia primero, luego por rating
    filtered.sort((a, b) => {
      // Si tenemos ubicación del usuario, ordenar por distancia primero
      if (userLocation) {
        const distanceA = a.distance_km || 999;
        const distanceB = b.distance_km || 999;
        if (distanceA !== distanceB) {
          return distanceA - distanceB;
        }
      }
      // Luego por rating
      return b.average_rating - a.average_rating;
    });

    setFilteredEmployees(filtered);
  };

  const stats = [
    {
      title: 'Empleadas Cerca de Ti',
      value: filteredEmployees.filter(e => (e.distance_km || 0) <= 5).length,
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      title: 'Disponibles Ahora',
      value: filteredEmployees.filter(e => e.current_status === 'available').length,
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Mejor Calificadas',
      value: filteredEmployees.filter(e => e.average_rating >= 4.5).length,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      title: 'Servicios Activos',
      value: 2, // Mock data
      icon: Users,
      color: 'text-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">DomiSafe</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">Bienvenido, {user?.name}</span>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Encuentra tu empleada doméstica ideal
          </h2>
          <p className="text-gray-600">
            Empleadas verificadas y calificadas cerca de tu ubicación
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, zona o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline flex items-center space-x-2 ${
                showFilters ? 'bg-primary-50 border-primary-300' : ''
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>

            {userLocation && (
              <button className="btn-secondary flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Cerca de mí</span>
              </button>
            )}
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </motion.div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredEmployees.length} empleadas encontradas
          </h3>
          
          <select className="input-field w-auto">
            <option>Mejor calificadas</option>
            <option>Más cerca</option>
            <option>Precio: menor a mayor</option>
            <option>Precio: mayor a menor</option>
            <option>Más experiencia</option>
          </select>
        </div>

        {/* Main Content - Conditional */}
        {!showEmployees ? (
          /* Formulario de Solicitud cuando empleadas están ocultas */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Solicita tu Empleada Ideal
              </h3>
              <p className="text-gray-600 mb-8">
                Completa este formulario y nuestro equipo te sugerirá las mejores empleadas según tus necesidades
              </p>
              
              <form className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-field">Zona preferida</label>
                    <LocationInput
                      placeholder="Ej. Palermo, Recoleta..."
                      onLocationSelect={(location) => {
                        setFilters({...filters, zone: location.address});
                        setUserLocation({lat: location.lat, lng: location.lng});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label-field">Precio máximo por hora</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Ej. 1500"
                      value={filters.max_rate || ''}
                      onChange={(e) => setFilters({...filters, max_rate: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="label-field">
                    Distancia máxima: {filters.distance}km
                    {userLocation && <span className="text-green-600 ml-2">📍 Ubicación detectada</span>}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.distance}
                    onChange={(e) => setFilters({...filters, distance: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1km</span>
                    <span>25km</span>
                    <span>50km+</span>
                  </div>
                </div>
                
                <div>
                  <label className="label-field">Servicios necesarios</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Describe qué servicios necesitas..."
                    value={requestForm.service_description}
                    onChange={(e) => setRequestForm({...requestForm, service_description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="label-field">Horarios preferidos</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ej. Lunes a Viernes 9:00-17:00"
                    value={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="label-field">Comentarios adicionales</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Cualquier preferencia especial..."
                    value={requestForm.additional_comments}
                    onChange={(e) => setRequestForm({...requestForm, additional_comments: e.target.value})}
                  />
                </div>
                
                <button
                  type="button"
                  className="w-full btn-primary py-4 text-lg font-semibold"
                  onClick={handleGeneralRequest}
                >
                  Solicitar Empleadas
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* Lista de empleadas cuando están visibles */
          <>
            {/* Mapa Interactivo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Empleadas cerca de ti
              </h3>
              <InteractiveMap
                showEmployees={true}
                initialLocation={userLocation || undefined}
                onLocationSelect={(location) => {
                  setUserLocation(location);
                  // Recargar empleadas cercanas
                }}
              />
              <div className="mt-4 text-sm text-gray-600">
                * Las ubicaciones mostradas son aproximadas para proteger la privacidad
              </div>
            </motion.div>

            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron empleadas</h3>
                <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EmployeeCard 
                      employee={employee} 
                      onRequest={handleRequestEmployee}
                      onFavorite={handleFavoriteEmployee}
                      onViewDetails={handleViewEmployeeDetails}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}