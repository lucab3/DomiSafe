'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign,
  Bell,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

interface Service {
  id: string;
  client_name: string;
  service_type: string;
  service_date: string;
  duration_hours: number;
  total_amount: number;
  status: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
}

interface Stats {
  total_services: number;
  average_rating: number;
  total_earnings: number;
  pending_requests: number;
}

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_services: 0,
    average_rating: 0,
    total_earnings: 0,
    pending_requests: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Datos de ejemplo para la demo
      setServices([
        {
          id: '1',
          client_name: 'María García',
          service_type: 'Limpieza general',
          service_date: '2025-08-10T09:00:00',
          duration_hours: 4,
          total_amount: 4800,
          status: 'confirmed',
          address: 'Av. Corrientes 1234, CABA'
        },
        {
          id: '2',
          client_name: 'Juan López',
          service_type: 'Cocina',
          service_date: '2025-08-09T14:00:00',
          duration_hours: 3,
          total_amount: 3600,
          status: 'requested',
          address: 'Av. Santa Fe 2345, CABA'
        }
      ]);

      setStats({
        total_services: 24,
        average_rating: 4.8, // Valor fijo para demo
        total_earnings: 28500,
        pending_requests: 3
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceAction = (serviceId: string, action: 'accept' | 'reject') => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, status: action === 'accept' ? 'confirmed' : 'cancelled' }
        : service
    ));
  };

  const getStatusBadge = (status: Service['status']) => {
    const statusConfig = {
      requested: { color: 'bg-yellow-100 text-yellow-800', text: 'Solicitado' },
      confirmed: { color: 'bg-green-100 text-green-800', text: 'Confirmado' },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: 'En progreso' },
      completed: { color: 'bg-gray-100 text-gray-800', text: 'Completado' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelado' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gradient">DomiSafe</h1>
              <span className="ml-4 text-gray-600">Panel Empleada</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">¡Hola, {user?.name}!</h2>
          <p className="text-gray-600">Gestiona tus servicios y revisa tu actividad</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Servicios totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_services}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Calificación</p>
                <p className="text-2xl font-bold text-gray-900">{stats.average_rating.toFixed(1)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ganancias totales</p>
                <p className="text-2xl font-bold text-gray-900">${stats.total_earnings.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Solicitudes pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_requests}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Section */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Servicios Recientes</h3>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{service.client_name}</h4>
                      {getStatusBadge(service.status)}
                    </div>
                    <p className="text-gray-600 mb-2">{service.service_type}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(service.service_date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration_hours}h
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {service.address}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${service.total_amount}
                      </div>
                    </div>
                  </div>

                  {service.status === 'requested' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleServiceAction(service.id, 'accept')}
                        className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleServiceAction(service.id, 'reject')}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </button>
                    </div>
                  )}

                  {service.status === 'confirmed' && (
                    <button className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ml-4">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Chat
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}