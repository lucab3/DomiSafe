'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Clock, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PendingApproval() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 30 seconds
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 30000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Registro Exitoso!
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            Tu solicitud para unirte como empleada doméstica ha sido recibida exitosamente.
          </p>

          {/* Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-700 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Estado: Pendiente de Aprobación</span>
            </div>
            <p className="text-sm text-yellow-600">
              Nuestro equipo está revisando tu perfil para garantizar la seguridad de todos nuestros usuarios.
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Solicitud recibida</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Verificación de documentos</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Aprobación final</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">¿Qué sigue?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Revisaremos tu información en 24-48 horas</li>
              <li>• Te contactaremos si necesitamos documentación adicional</li>
              <li>• Recibirás un email cuando tu perfil sea aprobado</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-3">
              ¿Tienes preguntas? Contáctanos:
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>support@domisafe.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+54 11 1234-5678</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full btn-primary"
            >
              Ir al Login
            </button>
          </div>

          {/* Auto redirect notice */}
          <p className="text-xs text-gray-500 mt-4">
            Serás redirigido automáticamente al login en 30 segundos
          </p>
        </div>
      </motion.div>
    </div>
  );
}