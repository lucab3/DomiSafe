# Guía de Deployment - DomiSafe

## 📋 Pasos para Deployar en Vercel

### 1. Preparar el Repositorio

```bash
# Inicializar Git
git init
git add .
git commit -m "Initial commit: DomiSafe app complete"

# Crear repositorio en GitHub y conectar
git branch -M main
git remote add origin https://github.com/lucab3/DomiSafe.git
git push -u origin main
```

### 2. Configurar Supabase

1. **Crear proyecto en [Supabase](https://supabase.com)**
   - Crea una nueva organización si es necesario
   - Crea un nuevo proyecto
   - Anota la URL y las API Keys

2. **Ejecutar el Schema de Base de Datos**
   ```sql
   -- Ve al SQL Editor en Supabase
   -- Copia y pega el contenido de database/schema.sql
   -- Ejecuta el script
   ```

3. **Cargar Datos de Prueba**
   ```sql
   -- En el SQL Editor
   -- Copia y pega el contenido de database/sample-data.sql
   -- Ejecuta el script
   ```

4. **Configurar Authentication (Opcional)**
   - Ve a Authentication > Settings
   - Configura los providers que necesites
   - Ajusta las URL de redirección si es necesario

### 3. Configurar Mapbox (Opcional para funcionalidad de mapas)

1. Crear cuenta en [Mapbox](https://www.mapbox.com)
2. Obtener un Access Token
3. Agregar a las variables de entorno

### 4. Deploy en Vercel

1. **Conectar repositorio en [Vercel](https://vercel.com)**
   - Importar proyecto desde GitHub
   - Seleccionar el repositorio domisafe-app

2. **Configurar Variables de Entorno**
   ```env
   # Supabase
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

   # Backend
   NODE_ENV=production
   JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

   # Frontend
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_mapbox_token_aqui
   ```

3. **Configurar Build Settings**
   - Framework Preset: Next.js
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/.next`
   - Install Command: `npm run install:all`

4. **Deploy**
   - Click "Deploy"
   - Vercel construirá y desplegará automáticamente

### 5. Verificar Deployment

1. **Probar la aplicación**
   - Ve a la URL de Vercel
   - Prueba el registro y login
   - Verifica que las funcionalidades principales funcionen

2. **Usuarios de Prueba**
   ```
   Admin:
   - Email: admin@domisafe.com
   - Password: admin123

   Cliente:
   - Email: maria.garcia@email.com
   - Password: demo123

   Empleada:
   - Email: rosa.martinez@email.com
   - Password: demo123
   ```

## 🔧 Configuración Adicional

### Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### Configurar Alertas y Monitoring

1. En Vercel, activa las notificaciones de deployment
2. Configura alertas para errores en Supabase
3. Considera usar servicios como Sentry para error tracking

### Variables de Entorno de Producción

```env
# Configuración de producción adicional
NEXTAUTH_URL=https://tu-dominio.vercel.app
NEXTAUTH_SECRET=otro_secret_muy_seguro

# URLs de API
NEXT_PUBLIC_API_URL=https://tu-dominio.vercel.app/api

# Configuración de CORS (en backend)
ALLOWED_ORIGINS=https://tu-dominio.vercel.app,https://domisafe.vercel.app
```

## 🚀 Funcionalidades Implementadas

### ✅ Backend (API)
- Sistema de autenticación completo
- CRUD de empleadas y clientes
- Panel de administración
- Sistema de servicios y agendamiento
- Calificaciones y reseñas
- Geolocalización y filtros
- Middleware de seguridad

### ✅ Frontend
- Landing page responsive
- Autenticación de usuarios
- Dashboard de clientes con filtros
- Cards de empleadas con diseño horizontal
- Panel de administrador completo
- Sistema de estadísticas
- Modo mostrar/ocultar empleadas

### ✅ Base de Datos
- Schema completo con relaciones
- Funciones de geolocalización
- Triggers automáticos
- Datos de prueba
- Índices optimizados

## 🔍 Testing

### Funcionalidades a Probar

1. **Registro y Login**
   - Registro de cliente
   - Registro de empleada (queda pendiente)
   - Login con diferentes roles

2. **Dashboard de Cliente**
   - Visualización de empleadas
   - Filtros en tiempo real
   - Geolocalización
   - Favoritos

3. **Panel de Administrador**
   - Estadísticas generales
   - Gestión de empleadas
   - Aprobación de perfiles
   - Modo visibilidad

4. **Sistema de Calificaciones**
   - Dejar reseñas
   - Ver calificaciones
   - Promedios automáticos

## 🛠 Desarrollo Futuro

### Próximas Funcionalidades
- [ ] Chat en tiempo real con WebSockets
- [ ] Notificaciones push
- [ ] Pagos con Stripe
- [ ] App móvil con React Native
- [ ] Sistema de verificación por SMS
- [ ] Integración con WhatsApp
- [ ] Dashboard financiero avanzado

### Mejoras de UX/UI
- [ ] Modo oscuro
- [ ] Animaciones avanzadas
- [ ] PWA (Progressive Web App)
- [ ] Carga lazy de imágenes
- [ ] Infinite scroll

## 📞 Soporte

Si encuentras problemas durante el deployment:

1. Revisa los logs en Vercel
2. Verifica las variables de entorno
3. Comprueba la conexión con Supabase
4. Consulta la documentación de Next.js y Vercel

**¡Tu app DomiSafe está lista para el mundo! 🎉**