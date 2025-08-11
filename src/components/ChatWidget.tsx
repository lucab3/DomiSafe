'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, UserCheck, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'admin' | 'client';
  message: string;
  timestamp: string;
  sender_name: string;
}

interface ChatWidgetProps {
  requestId: string;
  clientName: string;
  onClose: () => void;
}

export default function ChatWidget({ requestId, clientName, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages para demo
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'client',
      sender_name: clientName,
      message: 'Hola, necesito ayuda para encontrar una empleada para limpieza y cocina.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // Hace 2 horas
    },
    {
      id: '2',
      sender: 'admin',
      sender_name: 'Soporte DomiSafe',
      message: 'Hola! Claro, estaré encantado de ayudarte. Veo que necesitas servicios de limpieza y cocina en la zona de Palermo.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString() // Hace 1h55m
    },
    {
      id: '3',
      sender: 'admin',
      sender_name: 'Soporte DomiSafe',
      message: 'Tengo 3 empleadas perfectas para tus necesidades. Te voy a enviar sus perfiles.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString() // Hace 1h54m
    },
    {
      id: '4',
      sender: 'client',
      sender_name: clientName,
      message: 'Perfecto! Me interesan especialmente las que hablen inglés también.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // Hace 1 hora
    },
    {
      id: '5',
      sender: 'admin',
      sender_name: 'Soporte DomiSafe',
      message: 'Excelente, Rosa Martínez y Carmen Rodríguez hablan inglés además del español. ¿Te gustaría coordinar una entrevista?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // Hace 30 min
    }
  ];

  useEffect(() => {
    // Cargar mensajes iniciales
    setMessages(mockMessages);
  }, [requestId]);

  useEffect(() => {
    // Scroll al final cuando se agregan nuevos mensajes
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'admin',
      sender_name: 'Soporte DomiSafe',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Enviar mensaje al backend
    // await sendMessageToAPI(requestId, message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) {
      return 'Ahora';
    } else if (diffMins < 60) {
      return `Hace ${diffMins}m`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours}h`;
    } else {
      return date.toLocaleDateString('es-AR', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Chat con {clientName}</h3>
                <p className="text-sm opacity-90">Solicitud #{requestId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'admin'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  {msg.sender === 'client' ? (
                    <User className="w-3 h-3 opacity-70" />
                  ) : (
                    <UserCheck className="w-3 h-3 opacity-70" />
                  )}
                  <span className="text-xs opacity-70">{msg.sender_name}</span>
                </div>
                <p className="text-sm">{msg.message}</p>
                <div className="flex items-center justify-end mt-1">
                  <Clock className="w-3 h-3 opacity-50 mr-1" />
                  <span className="text-xs opacity-50">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribir mensaje..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Presiona Enter para enviar, Shift + Enter para nueva línea
          </div>
        </div>
      </div>
    </div>
  );
}