# Configuración de Google Maps API

## Pasos para configurar Google Maps API

### 1. Crear un proyecto en Google Cloud Platform

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el ID del proyecto

### 2. Habilitar las APIs necesarias

En la consola de Google Cloud, habilita las siguientes APIs:

- **Places API** - Para búsqueda de direcciones y autocompletado
- **Geocoding API** - Para obtener coordenadas de direcciones
- **Maps JavaScript API** - Para mostrar mapas (si necesario)

### 3. Crear una API Key

1. Ve a "Credenciales" en el menú lateral
2. Haz clic en "Crear credenciales" > "Clave de API"
3. Copia la clave generada

### 4. Configurar restricciones (Recomendado)

Para mayor seguridad, configura restricciones:

#### Restricciones de aplicación:
- **Para desarrollo local**: Restricciones de IP (agrega tu IP)
- **Para producción**: Restricciones de referencia HTTP (agrega tus dominios)

#### Restricciones de API:
Limita la clave solo a las APIs que necesitas:
- Places API
- Geocoding API

### 5. Configurar variables de entorno

Crea un archivo `.env.local` (para Next.js) o `.env` en la raíz del proyecto:

```bash
# Para el backend (API endpoints)
GOOGLE_MAPS_API_KEY=tu_clave_de_api_aqui

# Para el frontend (si necesitas)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_clave_de_api_aqui
```

### 6. Verificar la configuración

La aplicación intentará usar la Google Maps API automáticamente. Si no encuentra la clave o hay algún error, volverá a usar datos mock como respaldo.

## Configuración específica para Buenos Aires

Los endpoints están configurados para funcionar optimamente en Buenos Aires y alrededores:

- **Componentes**: Restringido a Argentina (`country:ar`)
- **Ubicación**: Centrado en Buenos Aires (-34.6118,-58.3960)
- **Radio**: 50km desde el centro
- **Tipos**: Enfocado en direcciones (`address`)
- **Idioma**: Español (`language=es`)

## Costos

- Google Places API tiene una cuota gratuita mensual
- Consulta los precios actuales en [Google Cloud Pricing](https://cloud.google.com/maps-platform/pricing)
- Configura límites de uso para controlar costos

## Solución de problemas

### Error: "API key not found"
- Verifica que `GOOGLE_MAPS_API_KEY` esté en tu archivo `.env`
- Reinicia el servidor después de agregar la variable

### Error: "This API project is not authorized"
- Asegúrate de que las APIs estén habilitadas en Google Cloud Console
- Verifica que la clave de API tenga permisos para las APIs necesarias

### Sin resultados o respuesta vacía
- Verifica las restricciones de la API key
- Revisa los logs del servidor para errores específicos
- La aplicación usará datos mock como respaldo automáticamente