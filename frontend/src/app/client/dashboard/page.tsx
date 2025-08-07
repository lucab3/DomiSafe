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
  Shield
} from 'lucide-react';
import EmployeeCard from '@/components/cards/EmployeeCard';
import FilterPanel from '@/components/FilterPanel';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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

export default function ClientDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

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
      distance_km: 8.9
    }
  ];

  useEffect(() => {
    loadEmployees();
    getUserLocation();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchTerm, filters]);

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
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

  const applyFilters = () => {
    let filtered = employees;

    // Filtro por búsqueda de texto
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.services_offered.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
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

    // Ordenar por rating y distancia
    filtered.sort((a, b) => {
      if (a.average_rating !== b.average_rating) {
        return b.average_rating - a.average_rating;
      }
      return (a.distance_km || 0) - (b.distance_km || 0);
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
              <span className="text-sm text-gray-600">Bienvenido, {user?.name}</span>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
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

        {/* Employee Grid */}
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
                <EmployeeCard employee={employee} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}