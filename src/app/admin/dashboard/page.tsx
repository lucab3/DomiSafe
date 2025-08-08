'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  MapPin,
  Star,
  Settings,
  Bell,
  Search,
  Filter,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  LogOut
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { motion } from 'framer-motion';

interface DashboardStats {
  total_employees: number;
  total_clients: number;
  services_this_week: number;
  pending_approvals: number;
  total_revenue: number;
  completed_services: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmployeesToClients, setShowEmployeesToClients] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    total_employees: 0,
    total_clients: 0,
    services_this_week: 0,
    pending_approvals: 0,
    total_revenue: 0,
    completed_services: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setStats({
        total_employees: 45,
        total_clients: 128,
        services_this_week: 23,
        pending_approvals: 7,
        total_revenue: 125600,
        completed_services: 234
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmployeeVisibility = async () => {
    try {
      setShowEmployeesToClients(!showEmployeesToClients);
      // Aquí iría la llamada a la API para actualizar la configuración
      console.log('Modo empleadas visibles:', !showEmployeesToClients);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const dashboardCards = [
    {
      title: 'Total Empleadas',
      value: stats.total_employees,
      icon: Users,
      color: 'bg-blue-500',
      change: '+3 esta semana'
    },
    {
      title: 'Total Clientes',
      value: stats.total_clients,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '+8 esta semana'
    },
    {
      title: 'Servicios Esta Semana',
      value: stats.services_this_week,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+15% vs anterior'
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: '+12% vs anterior'
    }
  ];

  const tabsData = [
    { id: 'overview', label: 'Resumen', icon: TrendingUp },
    { id: 'employees', label: 'Empleadas', icon: Users },
    { id: 'clients', label: 'Clientes', icon: UserCheck },
    { id: 'services', label: 'Servicios', icon: Calendar },
    { id: 'settings', label: 'Configuración', icon: Settings }
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
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              
              {/* Control de visibilidad de empleadas */}
              <div className="flex items-center space-x-2 ml-6">
                <span className="text-sm text-gray-600">Empleadas visibles a clientes:</span>
                <button
                  onClick={toggleEmployeeVisibility}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    showEmployeesToClients
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {showEmployeesToClients ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Oculto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {stats.pending_approvals > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pending_approvals}
                  </span>
                </div>
              )}
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <span className="text-sm text-gray-600">Admin: {user?.name}</span>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-red-600">
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
        {/* Alert para empleadas pendientes */}
        {stats.pending_approvals > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Tienes {stats.pending_approvals} empleadas pendientes de aprobación
                </span>
              </div>
              <button
                onClick={() => setActiveTab('employees')}
                className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
              >
                Revisar ahora →
              </button>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabsData.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'employees' && stats.pending_approvals > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pending_approvals}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                      <p className="text-xs text-green-600 mt-1">{card.change}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts and Additional Stats */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Servicios por Zona */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios por Zona</h3>
                <div className="space-y-3">
                  {[
                    { zone: 'Palermo', count: 45, percentage: 35 },
                    { zone: 'Recoleta', count: 38, percentage: 30 },
                    { zone: 'Belgrano', count: 25, percentage: 20 },
                    { zone: 'Villa Crespo', count: 19, percentage: 15 }
                  ].map((item) => (
                    <div key={item.zone} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{item.zone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empleadas por Estado */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Empleadas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Activas</span>
                    </div>
                    <span className="text-lg font-bold text-green-800">38</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Pendientes</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-800">{stats.pending_approvals}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Inactivas</span>
                    </div>
                    <span className="text-lg font-bold text-red-800">5</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'employees' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Gestión de Empleadas
              </h3>
              <button className="btn-primary">
                Agregar Empleada
              </button>
            </div>

            {/* Empleadas pendientes de aprobación */}
            {stats.pending_approvals > 0 && (
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Empleadas Pendientes de Aprobación ({stats.pending_approvals})
                </h4>
                
                <div className="space-y-3">
                  {Array.from({ length: stats.pending_approvals }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">Empleada #{i + 1}</h5>
                          <p className="text-sm text-gray-600">Registrada hace 2 días</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="btn-secondary bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                          Aprobar
                        </button>
                        <button className="btn-secondary bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de empleadas activas */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Empleadas Activas</h4>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar empleadas..."
                    className="input-field w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Empleada
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zona
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Mock data */}
                    {[
                      { name: 'Rosa Martínez', zone: 'Palermo', rating: 4.8, status: 'active' },
                      { name: 'Carmen Rodríguez', zone: 'Recoleta', rating: 4.9, status: 'active' },
                      { name: 'Lucía Fernández', zone: 'Villa Crespo', rating: 4.7, status: 'working' }
                    ].map((employee, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              {employee.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.zone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-900">{employee.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {employee.status === 'active' ? 'Disponible' : 'Trabajando'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-2">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Desactivar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Otros tabs se renderizarían aquí con contenido similar */}
        {activeTab !== 'overview' && activeTab !== 'employees' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Settings className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabsData.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">
              Esta sección está en desarrollo y será implementada próximamente.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}