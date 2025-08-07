'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<'client' | 'employee'>(
    (searchParams.get('type') as 'client' | 'employee') || 'client'
  );
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    zone: '',
    experience_years: '',
    services_offered: [] as string[],
    hourly_rate: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { register } = useAuth();

  const serviceOptions = [
    { id: 'cleaning', label: 'Limpieza del Hogar', icon: '🏠' },
    { id: 'cooking', label: 'Cocina', icon: '👩‍🍳' },
    { id: 'babysitting', label: 'Cuidado de Niños', icon: '👶' },
    { id: 'elderly_care', label: 'Cuidado de Adultos Mayores', icon: '👵' },
    { id: 'event', label: 'Eventos Especiales', icon: '🎉' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(serviceId)
        ? prev.services_offered.filter(s => s !== serviceId)
        : [...prev.services_offered, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validaciones
    const newErrors = [];
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Las contraseñas no coinciden');
    }
    if (formData.password.length < 6) {
      newErrors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (userType === 'employee' && formData.services_offered.length === 0) {
      newErrors.push('Debes seleccionar al menos un servicio');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        user_type: userType,
        ...(userType === 'employee' && {
          experience_years: parseInt(formData.experience_years) || 0,
          hourly_rate: parseFloat(formData.hourly_rate) || 0
        })
      };

      delete userData.confirmPassword;
      await register(userData);
    } catch (error: any) {
      setErrors([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">DomiSafe</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-gray-600">
            {userType === 'client' ? 'Encuentra empleadas domésticas confiables' : 'Ofrece tus servicios profesionales'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          {/* Selector de tipo de usuario */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                  userType === 'client'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍👩‍👧‍👦 Soy una Familia
              </button>
              <button
                type="button"
                onClick={() => setUserType('employee')}
                className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-colors ${
                  userType === 'employee'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👩‍💼 Soy Empleada Doméstica
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600 text-sm">{error}</p>
                ))}
              </div>
            )}

            {/* Información básica */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label className="label-field">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="+54 11 1234-5678"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-field">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label-field">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="label-field">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Campos específicos para empleadas */}
            {userType === 'employee' && (
              <>
                <div>
                  <label className="label-field">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Zona de Trabajo
                  </label>
                  <input
                    type="text"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ej: Palermo, Recoleta, Belgrano"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Años de Experiencia</label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="0"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="label-field">Tarifa por Hora (ARS)</label>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="1200"
                      min="0"
                      step="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Servicios que Ofreces</label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {serviceOptions.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.services_offered.includes(service.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services_offered.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="sr-only"
                        />
                        <span className="text-2xl mr-3">{service.icon}</span>
                        <span className="text-sm font-medium">{service.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                userType === 'client' ? 'Crear Cuenta' : 'Solicitar Registro'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/auth/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          {userType === 'employee' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Tu perfil será revisado por nuestro equipo antes de ser activado. 
                Recibirás un email cuando tu cuenta sea aprobada.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}