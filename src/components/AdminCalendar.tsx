'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, MapPin, Star } from 'lucide-react';

interface ServiceEvent {
  id: string;
  employee_id?: string;
  employee_name: string;
  employee_photo: string;
  client_name: string;
  service_type: string;
  start_time: string;
  end_time: string;
  address: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  hourly_rate: number;
}

interface AdminCalendarProps {
  onEventClick?: (event: ServiceEvent) => void;
}

export default function AdminCalendar({ onEventClick }: AdminCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');

  // Mock events para demo
  const mockEvents: ServiceEvent[] = [
    {
      id: '1',
      employee_name: 'Rosa Martínez',
      employee_photo: 'https://images.unsplash.com/photo-1494790108755-2616c0763c99?w=400',
      client_name: 'María García',
      service_type: 'Limpieza general',
      start_time: '09:00',
      end_time: '13:00',
      address: 'Av. Santa Fe 1234, Palermo',
      status: 'scheduled',
      hourly_rate: 1200
    },
    {
      id: '2',
      employee_name: 'Carmen Rodríguez',
      employee_photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      client_name: 'Roberto Fernández',
      service_type: 'Cuidado niños',
      start_time: '14:00',
      end_time: '18:00',
      address: 'Av. Alvear 567, Recoleta',
      status: 'in_progress',
      hourly_rate: 1100
    },
    {
      id: '3',
      employee_name: 'Lucía Fernández',
      employee_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      client_name: 'Ana López',
      service_type: 'Cocina y limpieza',
      start_time: '10:00',
      end_time: '14:00',
      address: 'Av. Cabildo 890, Belgrano',
      status: 'completed',
      hourly_rate: 1300
    },
    {
      id: '4',
      employee_name: 'Ana Gómez',
      employee_photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      client_name: 'Carlos Silva',
      service_type: 'Evento familiar',
      start_time: '16:00',
      end_time: '22:00',
      address: 'Av. Corrientes 1234, Centro',
      status: 'scheduled',
      hourly_rate: 1250
    },
    {
      id: '5',
      employee_name: 'Sofía Torres',
      employee_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      client_name: 'Laura Pérez',
      service_type: 'Cuidado niños',
      start_time: '15:00',
      end_time: '20:00',
      address: 'Av. Independencia 567, San Telmo',
      status: 'scheduled',
      hourly_rate: 1150
    }
  ];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programado';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const calculateTotal = (event: ServiceEvent) => {
    const startHour = parseInt(event.start_time.split(':')[0]);
    const endHour = parseInt(event.end_time.split(':')[0]);
    const hours = endHour - startHour;
    return hours * event.hourly_rate;
  };

  const previousPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const getWeekDays = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays();

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {view === 'month' && `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {view === 'week' && `Semana del ${weekDays[0].getDate()} al ${weekDays[6].getDate()} de ${monthNames[currentDate.getMonth()]}`}
            {view === 'day' && `${currentDate.getDate()} de ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 rounded text-sm ${
                  view === 'day' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded text-sm ${
                  view === 'week' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded text-sm ${
                  view === 'month' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mes
              </button>
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={previousPeriod}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPeriod}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {view === 'week' && (
          <div className="grid grid-cols-8 gap-1">
            {/* Time column */}
            <div className="text-center text-sm font-medium text-gray-500 py-2">
              Hora
            </div>
            
            {/* Day headers */}
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="text-center text-sm font-medium text-gray-500 py-2">
                <div>{dayNames[day.getDay()]}</div>
                <div className="text-lg font-bold text-gray-900">{day.getDate()}</div>
              </div>
            ))}

            {/* Time slots */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="text-xs text-gray-500 py-2 pr-2 text-right">
                  {hour}:00
                </div>
                
                {weekDays.map((day, dayIndex) => {
                  // Para demo, mostramos eventos en días específicos
                  const hasEvent = (dayIndex === 1 && hour === 9) || 
                                   (dayIndex === 2 && hour === 14) || 
                                   (dayIndex === 3 && hour === 10) ||
                                   (dayIndex === 4 && hour === 16) ||
                                   (dayIndex === 5 && hour === 15);
                  
                  const event = hasEvent ? mockEvents[dayIndex % mockEvents.length] : null;
                  
                  return (
                    <div 
                      key={`${day.toISOString()}-${hour}`}
                      className="border border-gray-100 min-h-12 p-1 relative"
                    >
                      {event && (
                        <div
                          onClick={() => onEventClick?.(event)}
                          className={`p-2 rounded text-xs cursor-pointer border-l-4 ${getStatusColor(event.status)}`}
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <img 
                              src={event.employee_photo} 
                              alt={event.employee_name}
                              className="w-4 h-4 rounded-full"
                            />
                            <span className="font-medium truncate">{event.employee_name}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {event.service_type}
                          </div>
                          <div className="text-xs opacity-75">
                            {event.start_time} - {event.end_time}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {view === 'day' && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Servicios programados para hoy
            </h3>
            {mockEvents.slice(0, 3).map((event) => (
              <div 
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(event.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={event.employee_photo} 
                      alt={event.employee_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.service_type}</h4>
                      <p className="text-sm text-gray-600">
                        {event.employee_name} → {event.client_name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.start_time} - {event.end_time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.address}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${calculateTotal(event).toLocaleString()}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status).replace('border-', 'border-l-4 border-')}`}>
                      {getStatusText(event.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {mockEvents.filter(e => e.status === 'scheduled').length}
            </div>
            <div className="text-xs text-gray-600">Programados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {mockEvents.filter(e => e.status === 'in_progress').length}
            </div>
            <div className="text-xs text-gray-600">En progreso</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {mockEvents.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ${mockEvents.reduce((total, event) => total + calculateTotal(event), 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total facturado</div>
          </div>
        </div>
      </div>
    </div>
  );
}