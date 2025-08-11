# Integración con OpenStreetMap (OSM)

## Descripción

La aplicación ahora utiliza **OpenStreetMap** con **Nominatim** como servicio de geocodificación y búsqueda de direcciones. Esta es una alternativa **completamente gratuita** a Google Maps API.

## Características

### ✅ Ventajas de OSM + Nominatim:
- **100% Gratuito** - Sin costos por uso
- **Sin límites de API key** - No necesita configuración adicional
- **Datos abiertos** - Basado en OpenStreetMap
- **Cobertura global** - Incluye Argentina y Buenos Aires

### ⚠️ Limitaciones:
- **Menor precisión** que Google Maps para direcciones específicas
- **Menos comercios** indexados comparado con Google
- **Velocidad** puede ser más lenta en algunos casos
- **Dependiente de la comunidad** para actualizaciones de datos

## Configuración Actual

### Endpoints implementados:

1. **`/api/places/autocomplete`**
   - Autocompletado de direcciones usando Nominatim
   - Búsqueda centrada en Buenos Aires y alrededores
   - Filtros por país (Argentina) y área metropolitana

2. **`/api/places/details`**
   - Obtención de detalles de lugares
   - Coordenadas exactas
   - Direcciones formateadas

### Configuración de búsqueda:

```javascript
// Parámetros optimizados para Buenos Aires
const nominatimUrl = `https://nominatim.openstreetmap.org/search?` +
  `q=${input + ', Buenos Aires, Argentina'}` +
  `&format=json` +
  `&addressdetails=1` +
  `&limit=10` +
  `&countrycodes=ar` +
  `&accept-language=es` +
  `&bounded=1` +
  `&viewbox=-59.0,-35.5,-57.5,-33.5`; // Área metropolitana de Buenos Aires
```

## Funcionamiento

### 1. Autocompletado
- El usuario escribe en el campo de búsqueda
- Se envía la consulta a Nominatim después de 300ms (debounce)
- Los resultados se filtran y formatean para mostrar:
  - **Texto principal**: Calle, barrio o localidad
  - **Texto secundario**: Contexto geográfico

### 2. Selección de lugar
- Al seleccionar una sugerencia, se obtienen las coordenadas
- Si están disponibles en la respuesta inicial, se usan directamente
- Si no, se hace una consulta adicional al endpoint de detalles

### 3. Fallback system
- Si OSM no está disponible o falla, automáticamente usa datos mock
- Garantiza que la aplicación siempre funcione

## Uso en Componentes

### AutocompleteInput
```typescript
import { getPlaceSuggestions, getPlaceDetails } from '@/utils/googleMaps';

// Obtener sugerencias
const suggestions = await getPlaceSuggestions(input);

// Obtener detalles (con datos OSM si están disponibles)
const details = await getPlaceDetails(place_id, suggestion);
```

### LocationInput
```typescript
const handlePlaceSelect = (place: PlaceSuggestion, coordinates: Coordinates) => {
  // Las coordenadas vienen directamente de OSM
  onLocationSelect({
    address: place.description,
    lat: coordinates.lat,
    lng: coordinates.lng
  });
};
```

## Mejoras Futuras

### Posibles optimizaciones:
1. **Cache local** de resultados frecuentes
2. **Geocodificación inversa** mejorada
3. **Validación de direcciones** más robusta
4. **Integración con mapas offline**

### Alternativas si se necesita más precisión:
1. **Mapbox Geocoding** (50,000 consultas gratis/mes)
2. **HERE API** (25,000 consultas gratis/mes)
3. **Combinación híbrida** OSM + otro servicio

## Monitoreo

### Logs importantes:
- Errores de Nominatim se registran en console.error
- Fallbacks a datos mock se registran en console.warn
- Estadísticas de uso disponibles en logs del servidor

### Headers requeridos:
```javascript
headers: {
  'User-Agent': 'EmpleadasDomesticasApp/1.0'
}
```

## Términos de Uso

### Nominatim Usage Policy:
- **Máximo 1 consulta por segundo** por IP
- **User-Agent obligatorio** (ya implementado)
- **No hacer scraping** masivo
- **Uso justo** - respeta los límites de la comunidad

## Testing

Para probar la integración:

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Ve a cualquier página que use LocationInput o AutocompleteInput

3. Prueba buscar:
   - "Palermo" → Debería mostrar barrios de Buenos Aires
   - "Av. Corrientes" → Debería mostrar la avenida
   - "Recoleta" → Debería mostrar el barrio

4. Verifica en Network tab que las consultas van a:
   - `/api/places/autocomplete`
   - `nominatim.openstreetmap.org`