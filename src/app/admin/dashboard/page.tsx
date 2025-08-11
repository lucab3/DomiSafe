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
import ChatWidget from '@/components/ChatWidget';
import AdminCalendar from '@/components/AdminCalendar';
import AdminMap from '@/components/AdminMap';
import { motion } from 'framer-motion';

interface DashboardStats {
  total_employees: number;
  total_clients: number;
  services_this_week: number;
  pending_approvals: number;
  total_revenue: number;
  completed_services: number;
}

interface EmployeeRegistration {
  id: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: any;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmployeesToClients, setShowEmployeesToClients] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [employeeRegistrations, setEmployeeRegistrations] = useState<EmployeeRegistration[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    photo_url: '',
    address: '',
    zone: '',
    services_offered: [] as string[],
    languages: ['Español'],
    experience_years: 0,
    hourly_rate: 1000,
    availability: 'Lunes a Viernes 9:00-17:00',
    experience_description: '',
    references: ''
  });
  const [showChat, setShowChat] = useState(false);
  const [chatRequest, setChatRequest] = useState<any>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    client_name: '',
    employee_id: '',
    service_type: '',
    service_date: '',
    start_time: '',
    end_time: '',
    address: '',
    hourly_rate: 1200,
    status: 'scheduled'
  });
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
    loadSettings();
    loadPendingRequests();
    loadEmployeeRegistrations();
    loadEmployees();
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

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setShowEmployeesToClients(data.show_employees_to_clients);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await fetch('/api/requests?admin_view=true&status=pending');
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadEmployeeRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/employee-registrations');
      if (response.ok) {
        const data = await response.json();
        setEmployeeRegistrations(data.registrations || []);
        
        // Update pending approvals count
        const pendingCount = data.registrations?.filter((reg: EmployeeRegistration) => reg.status === 'pending').length || 0;
        setStats(prev => ({ ...prev, pending_approvals: pendingCount }));
      }
    } catch (error) {
      console.error('Error loading employee registrations:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await fetch('/api/employees?admin_view=true');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const openEmployeeModal = (employee: any = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setEmployeeForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        photo_url: employee.photo_url || '',
        address: employee.address || '',
        zone: employee.zone || '',
        services_offered: employee.services_offered || [],
        languages: employee.languages || ['Español'],
        experience_years: employee.experience_years || 0,
        hourly_rate: employee.hourly_rate || 1000,
        availability: employee.availability || 'Lunes a Viernes 9:00-17:00',
        experience_description: employee.experience_description || '',
        references: employee.references || ''
      });
    } else {
      setEditingEmployee(null);
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        photo_url: '',
        address: '',
        zone: '',
        services_offered: [],
        languages: ['Español'],
        experience_years: 0,
        hourly_rate: 1000,
        availability: 'Lunes a Viernes 9:00-17:00',
        experience_description: '',
        references: ''
      });
    }
    setShowEmployeeModal(true);
  };

  const handleSaveEmployee = async () => {
    try {
      const url = editingEmployee 
        ? `/api/employees?employee_id=${editingEmployee.id}`
        : '/api/employees';
      
      const method = editingEmployee ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeForm),
      });

      if (response.ok) {
        await loadEmployees();
        setShowEmployeeModal(false);
        alert(editingEmployee ? 'Empleada actualizada exitosamente' : 'Empleada creada exitosamente');
      } else {
        throw new Error('Error al guardar empleada');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error al guardar empleada');
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('¿Estás seguro de que deseas desactivar esta empleada?')) {
      return;
    }

    try {
      const response = await fetch(`/api/employees?employee_id=${employeeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadEmployees();
        alert('Empleada desactivada exitosamente');
      } else {
        throw new Error('Error al desactivar empleada');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error al desactivar empleada');
    }
  };

  const openChat = (request: any) => {
    setChatRequest(request);
    setShowChat(true);
  };

  const assignEmployeeToRequest = async (requestId: string, employeeId: string) => {
    try {
      const response = await fetch(`/api/requests?request_id=${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'assigned',
          assigned_employee_id: employeeId
        }),
      });

      if (response.ok) {
        await loadPendingRequests(); // Recargar solicitudes
        alert('Empleada asignada exitosamente');
      }
    } catch (error) {
      console.error('Error assigning employee:', error);
      alert('Error al asignar empleada');
    }
  };

  const handleEmployeeRegistrationDecision = async (employeeId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/employee-registrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: employeeId,
          status
        }),
      });

      if (response.ok) {
        alert(`Empleada ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);
        await loadEmployeeRegistrations(); // Recargar registros
      } else {
        alert('Error al procesar la decisión');
      }
    } catch (error) {
      console.error('Error processing employee registration:', error);
      alert('Error al procesar la decisión');
    }
  };

  const toggleEmployeeVisibility = async () => {
    try {
      const newValue = !showEmployeesToClients;
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          show_employees_to_clients: newValue
        }),
      });

      if (response.ok) {
        setShowEmployeesToClients(newValue);
        console.log('Configuración actualizada - Empleadas visibles:', newValue);
      } else {
        throw new Error('Error al actualizar configuración');
      }
    } catch (error) {
      console.error('Error toggling employee visibility:', error);
    }
  };

  const openServiceModal = (service: any = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        client_name: service.client_name || '',
        employee_id: service.employee_id || '',
        service_type: service.service_type || '',
        service_date: service.service_date || '',
        start_time: service.start_time || '',
        end_time: service.end_time || '',
        address: service.address || '',
        hourly_rate: service.hourly_rate || 1200,
        status: service.status || 'scheduled'
      });
    } else {
      setEditingService(null);
      setServiceForm({
        client_name: '',
        employee_id: '',
        service_type: '',
        service_date: '',
        start_time: '',
        end_time: '',
        address: '',
        hourly_rate: 1200,
        status: 'scheduled'
      });
    }
    setShowServiceModal(true);
  };

  const handleSaveService = async () => {
    try {
      const url = editingService 
        ? `/api/services?service_id=${editingService.id}`
        : '/api/services';
      
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceForm),
      });

      if (response.ok) {
        setShowServiceModal(false);
        alert(editingService ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente');
      } else {
        throw new Error('Error al guardar servicio');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error al guardar servicio');
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
    { id: 'requests', label: 'Solicitudes', icon: Bell },
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
                  {tab.id === 'requests' && pendingRequests.length > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {pendingRequests.length}
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

            {/* Mapa de empleadas en tiempo real */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AdminMap 
                onEmployeeClick={(employee) => {
                  alert(`Empleada: ${employee.name}\nEstado: ${employee.status}\nZona: ${employee.zone}`);
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Employee Registrations */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Registros de Empleadas ({employeeRegistrations.filter(reg => reg.status === 'pending').length} pendientes)
                </h3>
                <button 
                  onClick={loadEmployeeRegistrations}
                  className="btn-secondary"
                >
                  Actualizar
                </button>
              </div>

              {employeeRegistrations.filter(reg => reg.status === 'pending').length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No hay registros pendientes
                  </h4>
                  <p className="text-gray-600">Todas las empleadas han sido procesadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {employeeRegistrations.filter(reg => reg.status === 'pending').map((registration) => (
                    <div key={registration.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{registration.name}</h4>
                              <p className="text-sm text-gray-600">{registration.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Teléfono:</span> {registration.phone}
                            </div>
                            <div>
                              <span className="font-medium">Zona:</span> {registration.zone}
                            </div>
                            <div>
                              <span className="font-medium">Experiencia:</span> {registration.experience_years} años
                            </div>
                            <div>
                              <span className="font-medium">Tarifa:</span> ${registration.hourly_rate}/hora
                            </div>
                          </div>

                          <div className="mt-3">
                            <span className="font-medium text-sm text-gray-900">Servicios:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {registration.services_offered?.map((service: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEmployeeRegistrationDecision(registration.id, 'approved')}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleEmployeeRegistrationDecision(registration.id, 'rejected')}
                            className="btn-outline text-sm px-3 py-1 border-red-300 text-red-700 hover:bg-red-50"
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Requests */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Solicitudes de Clientes ({pendingRequests.length})
                </h3>
                <button 
                  onClick={loadPendingRequests}
                  className="btn-secondary"
                >
                  Actualizar
                </button>
              </div>

            {pendingRequests.length === 0 ? (
              <div className="card text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No hay solicitudes pendientes
                </h4>
                <p className="text-gray-600">
                  Cuando los clientes envíen solicitudes aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request: any) => (
                  <div key={request.id} className="card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {request.clients?.name || 'Cliente'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {request.clients?.email} • {new Date(request.created_at).toLocaleDateString('es-AR')}
                          </p>
                          <p className="text-xs text-gray-500">
                            📱 {request.clients?.phone} • 📍 {request.clients?.address}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {request.status === 'pending' ? 'Pendiente' : 'Confirmado'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">#{request.id}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Detalles de la solicitud</h5>
                        <div className="space-y-2 text-sm">
                          <div><strong>Zona preferida:</strong> {request.preferred_zone || 'No especificada'}</div>
                          <div><strong>Precio máximo:</strong> ${request.max_hourly_rate || 'Sin límite'}</div>
                          <div><strong>Horarios:</strong> {request.preferred_schedule || 'Flexible'}</div>
                          <div><strong>Servicios:</strong> {request.service_type}</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Comentarios adicionales</h5>
                        <p className="text-sm text-gray-600">
                          {request.additional_comments || 'Sin comentarios adicionales'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-medium text-gray-900 mb-3">Empleadas sugeridas</h5>
                      <div className="grid md:grid-cols-3 gap-3 mb-4">
                        {['Rosa Martínez', 'Carmen Rodríguez', 'Lucía Fernández'].map((name, index) => (
                          <button
                            key={index}
                            onClick={() => assignEmployeeToRequest(request.id, `emp_${index}`)}
                            className="p-3 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors text-left"
                          >
                            <div className="font-medium text-gray-900">{name}</div>
                            <div className="text-sm text-gray-600">Zona: {['Palermo', 'Recoleta', 'Villa Crespo'][index]}</div>
                            <div className="text-sm text-gray-600">⭐ {[4.8, 4.9, 4.7][index]}</div>
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => openChat(request)}
                          className="btn-primary"
                        >
                          💬 Chat con Cliente
                        </button>
                        <button className="btn-outline">
                          Rechazar Solicitud
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <button 
                onClick={() => openEmployeeModal()}
                className="btn-primary"
              >
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
                    {employees.slice(0, 10).map((employee, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={employee.photo_url} 
                              alt={employee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.zone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-900">{employee.average_rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            employee.current_status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : employee.current_status === 'working'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {employee.current_status === 'active' ? 'Disponible' : 
                             employee.current_status === 'working' ? 'Trabajando' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => openEmployeeModal(employee)}
                            className="text-primary-600 hover:text-primary-900 mr-2"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
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

        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Calendario de Servicios
              </h3>
              <button 
                onClick={() => openServiceModal()}
                className="btn-primary"
              >
                Programar Servicio
              </button>
            </div>
            
            <AdminCalendar 
              onEventClick={(event) => {
                openServiceModal({
                  id: event.id,
                  client_name: event.client_name,
                  employee_id: event.employee_id || 'emp_1',
                  service_type: event.service_type,
                  service_date: '2025-08-11',
                  start_time: event.start_time,
                  end_time: event.end_time,
                  address: event.address,
                  hourly_rate: event.hourly_rate,
                  status: event.status
                });
              }}
            />
          </motion.div>
        )}

        {/* Otros tabs se renderizarían aquí con contenido similar */}
        {activeTab !== 'overview' && activeTab !== 'employees' && activeTab !== 'requests' && activeTab !== 'services' && (
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

      {/* Modal de empleada */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingEmployee ? 'Editar Empleada' : 'Nueva Empleada'}
                </h2>
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona *
                  </label>
                  <input
                    type="text"
                    value={employeeForm.zone}
                    onChange={(e) => setEmployeeForm({...employeeForm, zone: e.target.value})}
                    className="input-field"
                    placeholder="Ej: Palermo"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={employeeForm.address}
                    onChange={(e) => setEmployeeForm({...employeeForm, address: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de foto
                  </label>
                  <input
                    type="url"
                    value={employeeForm.photo_url}
                    onChange={(e) => setEmployeeForm({...employeeForm, photo_url: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa por hora ($)
                  </label>
                  <input
                    type="number"
                    value={employeeForm.hourly_rate}
                    onChange={(e) => setEmployeeForm({...employeeForm, hourly_rate: parseInt(e.target.value) || 0})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Años de experiencia
                  </label>
                  <input
                    type="number"
                    value={employeeForm.experience_years}
                    onChange={(e) => setEmployeeForm({...employeeForm, experience_years: parseInt(e.target.value) || 0})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disponibilidad
                  </label>
                  <input
                    type="text"
                    value={employeeForm.availability}
                    onChange={(e) => setEmployeeForm({...employeeForm, availability: e.target.value})}
                    className="input-field"
                    placeholder="Ej: Lunes a Viernes 9:00-17:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servicios ofrecidos
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['cleaning', 'cooking', 'babysitting', 'elderly_care', 'event'].map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={employeeForm.services_offered.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEmployeeForm({...employeeForm, services_offered: [...employeeForm.services_offered, service]});
                            } else {
                              setEmployeeForm({...employeeForm, services_offered: employeeForm.services_offered.filter(s => s !== service)});
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {service === 'cleaning' ? 'Limpieza' :
                           service === 'cooking' ? 'Cocina' :
                           service === 'babysitting' ? 'Niñera' :
                           service === 'elderly_care' ? 'Adultos mayores' :
                           'Eventos'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idiomas
                  </label>
                  <input
                    type="text"
                    value={employeeForm.languages.join(', ')}
                    onChange={(e) => setEmployeeForm({...employeeForm, languages: e.target.value.split(', ').filter(lang => lang.trim())})}
                    className="input-field"
                    placeholder="Español, Inglés, Italiano"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de experiencia
                  </label>
                  <textarea
                    rows={3}
                    value={employeeForm.experience_description}
                    onChange={(e) => setEmployeeForm({...employeeForm, experience_description: e.target.value})}
                    className="input-field"
                    placeholder="Describe la experiencia y especialidades..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencias
                  </label>
                  <textarea
                    rows={2}
                    value={employeeForm.references}
                    onChange={(e) => setEmployeeForm({...employeeForm, references: e.target.value})}
                    className="input-field"
                    placeholder="Referencias de trabajos anteriores..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveEmployee}
                  className="btn-primary"
                >
                  {editingEmployee ? 'Actualizar' : 'Crear'} Empleada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de servicio */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingService ? 'Editar Servicio' : 'Programar Nuevo Servicio'}
                </h2>
                <button
                  onClick={() => setShowServiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del cliente *
                  </label>
                  <input
                    type="text"
                    value={serviceForm.client_name}
                    onChange={(e) => setServiceForm({...serviceForm, client_name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empleada *
                  </label>
                  <select
                    value={serviceForm.employee_id}
                    onChange={(e) => setServiceForm({...serviceForm, employee_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccionar empleada</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de servicio *
                  </label>
                  <select
                    value={serviceForm.service_type}
                    onChange={(e) => setServiceForm({...serviceForm, service_type: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Seleccionar servicio</option>
                    <option value="Limpieza general">Limpieza general</option>
                    <option value="Cocina">Cocina</option>
                    <option value="Cuidado niños">Cuidado niños</option>
                    <option value="Cuidado adultos mayores">Cuidado adultos mayores</option>
                    <option value="Evento familiar">Evento familiar</option>
                    <option value="Cocina y limpieza">Cocina y limpieza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del servicio *
                  </label>
                  <input
                    type="date"
                    value={serviceForm.service_date}
                    onChange={(e) => setServiceForm({...serviceForm, service_date: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de inicio *
                  </label>
                  <input
                    type="time"
                    value={serviceForm.start_time}
                    onChange={(e) => setServiceForm({...serviceForm, start_time: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de fin *
                  </label>
                  <input
                    type="time"
                    value={serviceForm.end_time}
                    onChange={(e) => setServiceForm({...serviceForm, end_time: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección del servicio *
                  </label>
                  <input
                    type="text"
                    value={serviceForm.address}
                    onChange={(e) => setServiceForm({...serviceForm, address: e.target.value})}
                    className="input-field"
                    placeholder="Dirección completa donde se realizará el servicio"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarifa por hora ($)
                  </label>
                  <input
                    type="number"
                    value={serviceForm.hourly_rate}
                    onChange={(e) => setServiceForm({...serviceForm, hourly_rate: parseInt(e.target.value) || 0})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del servicio
                  </label>
                  <select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({...serviceForm, status: e.target.value})}
                    className="input-field"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="in_progress">En progreso</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveService}
                  className="btn-primary"
                >
                  {editingService ? 'Actualizar' : 'Crear'} Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {showChat && chatRequest && (
        <ChatWidget
          requestId={chatRequest.id}
          clientName={chatRequest.clients?.name || 'Cliente'}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}