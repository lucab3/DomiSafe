'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AutocompleteInput from './AutocompleteInput';
import { 
  Shield, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  Heart,
  Smartphone,
  Search,
  Calendar,
  MessageCircle,
  TrendingUp
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Empleadas Verificadas',
    description: 'Todas nuestras empleadas pasan por un riguroso proceso de verificación documental y referencias.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: MapPin,
    title: 'Búsqueda por Ubicación',
    description: 'Encuentra empleadas cerca de ti con nuestro sistema de geolocalización inteligente.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Star,
    title: 'Sistema de Calificaciones',
    description: 'Reseñas reales de familias que han usado nuestros servicios para tu tranquilidad.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Clock,
    title: 'Disponibilidad 24/7',
    description: 'Agenda servicios cuando los necesites, con empleadas disponibles todos los días.',
    color: 'from-purple-500 to-purple-600'
  }
];

const stats = [
  { number: '500+', label: 'Empleadas Verificadas' },
  { number: '2,000+', label: 'Familias Satisfechas' },
  { number: '4.9', label: 'Calificación Promedio' },
  { number: '98%', label: 'Tasa de Satisfacción' }
];

const services = [
  { name: 'Limpieza del Hogar', icon: '🏠', price: 'Desde $1,200/h' },
  { name: 'Cuidado de Niños', icon: '👶', price: 'Desde $1,100/h' },
  { name: 'Cocina', icon: '👩‍🍳', price: 'Desde $1,300/h' },
  { name: 'Cuidado de Adultos Mayores', icon: '👵', price: 'Desde $1,400/h' },
  { name: 'Eventos Especiales', icon: '🎉', price: 'Desde $1,500/h' },
  { name: 'Servicios Personalizados', icon: '⭐', price: 'Consultar precio' }
];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLocationSelect = (place: any, coordinates: { lat: number; lng: number }) => {
    setSelectedLocation(coordinates);
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      // Redirigir a la página de búsqueda con parámetros
      const params = new URLSearchParams({
        location: searchLocation,
        ...(selectedLocation && {
          lat: selectedLocation.lat.toString(),
          lng: selectedLocation.lng.toString()
        })
      });
      router.push(`/auth/register?type=client&${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">DomiSafe</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#servicios" className="text-gray-600 hover:text-primary-600 transition-colors">Servicios</a>
              <a href="#como-funciona" className="text-gray-600 hover:text-primary-600 transition-colors">Cómo Funciona</a>
              <a href="#testimonios" className="text-gray-600 hover:text-primary-600 transition-colors">Testimonios</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="btn-secondary">
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Tu <span className="text-gradient">Hogar</span> en 
              <br />Buenas Manos
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conectamos familias con empleadas domésticas verificadas y confiables. 
              Encuentra el servicio perfecto para tu hogar con total seguridad y tranquilidad.
            </p>
            
            {/* Buscador principal */}
            <div className="max-w-2xl mx-auto mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Encuentra empleadas cerca de ti
                  </h3>
                  <p className="text-sm text-gray-600">
                    Ingresa tu ubicación para ver empleadas disponibles
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <AutocompleteInput
                      value={searchLocation}
                      onChange={setSearchLocation}
                      onPlaceSelect={handleLocationSelect}
                      placeholder="¿Dónde necesitas el servicio? Ej: Palermo, Buenos Aires"
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={!searchLocation.trim()}
                    className="btn-primary px-8 py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buscar Empleadas
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    ✓ Empleadas verificadas • ✓ Precios transparentes • ✓ Disponibilidad inmediata
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register?type=client" className="btn-primary text-lg px-8 py-4">
                Soy una Familia
              </Link>
              <Link href="/auth/register?type=employee" className="btn-outline text-lg px-8 py-4">
                Soy Empleada Doméstica
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary-600">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir <span className="text-gradient">DomiSafe</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una plataforma segura, moderna y fácil de usar para conectar familias con empleadas domésticas profesionales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center group hover:shadow-xl"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios domésticos para satisfacer todas tus necesidades.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card group cursor-pointer hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-primary-600 font-medium">{service.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cómo Funciona</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proceso simple y seguro en solo 3 pasos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Busca y Filtra',
                description: 'Encuentra empleadas verificadas cerca de ti usando nuestros filtros inteligentes.',
                icon: Search
              },
              {
                step: '2',
                title: 'Agenda tu Servicio',
                description: 'Selecciona fechas, horarios y especifica tus necesidades particulares.',
                icon: Calendar
              },
              {
                step: '3',
                title: 'Disfruta del Servicio',
                description: 'Relájate mientras nuestras profesionales se ocupan de tu hogar.',
                icon: Heart
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para encontrar tu empleada doméstica ideal?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de familias que ya confían en DomiSafe para el cuidado de su hogar.
            </p>
            <Link href="/auth/register" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
              Comenzar Ahora - Es Gratis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DomiSafe</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma de confianza que conecta familias con empleadas domésticas verificadas.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-sm">ig</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-sm">tw</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Limpieza</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cuidado de Niños</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cocina</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Adultos Mayores</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DomiSafe. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}