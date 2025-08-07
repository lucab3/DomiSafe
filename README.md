# DomiSafe - Plataforma de Empleadas Domésticas

## 🏠 Descripción

DomiSafe es una plataforma moderna y segura que conecta familias con empleadas domésticas verificadas. Diseñada con un enfoque en la experiencia de usuario, seguridad y profesionalismo.

## ✨ Características Principales

### 👨‍👩‍👧‍👦 Para Familias
- **Panel intuitivo** con empleadas mejor calificadas por geolocalización
- **Filtros en tiempo real** (ubicación, días, horarios, servicios)
- **Sistema de calificaciones** y reseñas verificadas
- **Chat integrado** para comunicación directa
- **Historial de servicios** completo
- **Sistema de favoritos** para empleadas preferidas
- **Programa de referidos** con recompensas

### 👩‍💼 Para Empleadas
- **Perfil profesional** verificado con documentación
- **Gestión de disponibilidad** flexible
- **Código QR único** (Delantal Digital)
- **Historial laboral** inmutable
- **Sistema de calificación** bidireccional
- **Notificaciones** de nuevos servicios

### 🔧 Panel de Administración
- **CRUD completo** de empleadas y clientes
- **Gestión de solicitudes** y asignaciones
- **Estadísticas detalladas** por zona y rendimiento
- **Control de visibilidad** de empleadas
- **Sistema de verificación** documental
- **Dashboard financiero** con métricas

## 🛠 Tecnologías

### Backend
- **Node.js** + **Express.js**
- **Supabase** (PostgreSQL + Auth)
- Patrón **MVC** (Models, Views, Controllers)
- **JWT** para autenticación
- **Bcrypt** para encriptación
- **Multer** para manejo de archivos

### Frontend
- **Next.js 14** + **React 18**
- **TypeScript** para tipado estático
- **Tailwind CSS** para diseño
- **Framer Motion** para animaciones
- **React Query** para gestión de estado
- **Mapbox** para geolocalización
- **Zustand** para estado global

### Base de Datos
- **Supabase** (PostgreSQL)
- **PostGIS** para funciones geoespaciales
- **Row Level Security** (RLS)
- Funciones personalizadas para cálculos de distancia

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Cuenta en Supabase
- Cuenta en Vercel (para deployment)

### 1. Clonar el repositorio
```bash
git clone https://github.com/lucab3/DomiSafe.git
cd DomiSafe
```

### 2. Instalar dependencias
```bash
npm run install:all
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Completar las variables en `.env`:
```env
# Supabase
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_key

# Backend
JWT_SECRET=tu_jwt_secret_seguro
PORT=5000

# Frontend
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_mapbox_token
```

### 4. Configurar Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar el schema en SQL Editor:
```sql
-- Copiar y ejecutar el contenido de database/schema.sql
```
3. Ejecutar datos de prueba:
```sql
-- Copiar y ejecutar el contenido de database/sample-data.sql
```

### 5. Desarrollo local
```bash
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## 📦 Deployment en Vercel

### 1. Conectar repositorio
1. Crear repositorio en GitHub
2. Push del código
3. Conectar proyecto en Vercel

### 2. Configurar variables de entorno en Vercel
```
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_key
JWT_SECRET=tu_jwt_secret
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_mapbox_token
```

### 3. Deploy automático
Vercel detectará la configuración y desplegará automáticamente.

## 👥 Usuarios de Prueba

### Cliente Premium
- **Email:** maria.garcia@email.com
- **Password:** demo123

### Cliente Básico  
- **Email:** juan.lopez@email.com
- **Password:** demo123

### Administrador
- **Email:** admin@domisafe.com
- **Password:** admin123

### Empleadas
- **Rosa Martínez:** rosa.martinez@email.com (demo123)
- **Carmen Rodríguez:** carmen.rodriguez@email.com (demo123)
- **Lucía Fernández:** lucia.fernandez@email.com (demo123)

## 📋 Funcionalidades Implementadas

### ✅ Core Features
- [x] Sistema de autenticación (familias/empleadas)
- [x] Panel de usuario con filtros en tiempo real
- [x] Cards de empleadas con diseño horizontal
- [x] Panel de administrador completo
- [x] Sistema de calificaciones y reseñas
- [x] Chat interno entre usuarios
- [x] Geolocalización con Mapbox

### ✅ Features Adicionales
- [x] Sistema de favoritos
- [x] Programa de referidos
- [x] Notificaciones en tiempo real
- [x] Historial de servicios
- [x] Dashboard de estadísticas
- [x] Sistema de membresías
- [x] Modo mostrar/ocultar empleadas

### 🔄 Próximas Features
- [ ] Integración con WhatsApp
- [ ] Sistema de seguros
- [ ] Módulo de capacitación
- [ ] Pagos con Stripe
- [ ] App móvil
- [ ] Push notifications

## 🏗 Estructura del Proyecto

```
domisafe-app/
├── backend/
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de API
│   ├── services/        # Servicios auxiliares
│   ├── middleware/      # Middleware personalizado
│   └── config/          # Configuraciones
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router
│   │   ├── components/  # Componentes React
│   │   ├── contexts/    # Contextos de React
│   │   ├── hooks/       # Hooks personalizados
│   │   └── utils/       # Utilidades
└── database/
    ├── schema.sql       # Schema de BD
    └── sample-data.sql  # Datos de prueba
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

- **Email:** soporte@domisafe.com
- **GitHub Issues:** [Crear issue](https://github.com/tu-usuario/domisafe-app/issues)

---

Hecho con ❤️ por el equipo DomiSafe