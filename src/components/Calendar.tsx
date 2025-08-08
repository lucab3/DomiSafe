'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  client: string;
  time: string;
  duration: string;
  address: string;
  status: 'confirmed' | 'pending' | 'completed';
  type: 'cleaning' | 'cooking' | 'babysitting' | 'elderly_care';
}

interface CalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export default function Calendar({ events = [], onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  // Mock events para demo
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Limpieza general',
      client: 'María García',
      time: '09:00',
      duration: '4h',
      address: 'Av. Santa Fe 1234',
      status: 'confirmed',
      type: 'cleaning'
    },
    {
      id: '2',
      title: 'Cocina y limpieza',
      client: 'Roberto Fernández',
      time: '14:00',
      duration: '3h',
      address: 'Av. Alvear 567',
      status: 'pending',
      type: 'cooking'
    },
    {
      id: '3',
      title: 'Cuidado niños',
      client: 'Ana López',
      time: '16:00',
      duration: '2h',
      address: 'Av. Cabildo 890',
      status: 'confirmed',
      type: 'babysitting'
    }
  ];

  const allEvents = [...events, ...mockEvents];

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false, isToday: false });
    }
    
    // Días del mes actual
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      days.push({ date, isCurrentMonth: true, isToday });
    }
    
    // Días del siguiente mes para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }
    
    return days;
  };

  const getEventsForDay = (date: Date) => {
    return allEvents.filter(event => {
      // Para demo, asignamos eventos a días específicos
      const eventDay = date.getDate();
      if (eventDay === 15 || eventDay === 18 || eventDay === 22) {
        return true;
      }
      return false;
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cleaning':
        return '🏠';
      case 'cooking':
        return '👩‍🍳';
      case 'babysitting':
        return '👶';
      case 'elderly_care':
        return '👵';
      default:
        return '⭐';
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
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
            </div>
            
            <div className="flex space-x-1">
              <button
                onClick={previousMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const eventsForDay = getEventsForDay(day.date);
            
            return (
              <div
                key={index}
                className={`min-h-24 p-1 border border-gray-100 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${day.isToday ? 'text-blue-600' : ''}`}>
                  {day.date.getDate()}
                </div>
                
                {/* Events */}
                <div className="space-y-1">
                  {eventsForDay.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getStatusColor(event.status)}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{getTypeIcon(event.type)}</span>
                        <span className="truncate">{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's events */}
      <div className="border-t border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Servicios de hoy</h3>
        <div className="space-y-2">
          {allEvents.filter((_, index) => index < 2).map((event) => (
            <div 
              key={event.id} 
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={() => onEventClick?.(event)}
            >
              <div className="text-xl">{getTypeIcon(event.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                    {event.status === 'confirmed' ? 'Confirmado' : 
                     event.status === 'pending' ? 'Pendiente' : 'Completado'}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {event.client}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time} ({event.duration})
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {event.address}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}