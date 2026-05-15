# BinniBus Oaxaca

Mapa web de rutas BinniBus con:

- visualizacion de rutas publicadas
- filtros por tipo de ruta
- panel de corredores activos
- soporte para posiciones de unidades en tiempo real
- respaldo opcional con Supabase

## Variables

Copiar `.env.example` a `.env.local` y completar:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `BINNIBUS_REALTIME_URL`

## Base de datos

Ejecutar `supabase/schema.sql` en el SQL editor de Supabase.

La app funciona con datos locales si Supabase no esta configurado.

## Tiempo real

`BINNIBUS_REALTIME_URL` debe devolver un arreglo JSON con:

```json
[
  {
    "id": "unidad-1",
    "routeId": "rt-01",
    "latitude": 17.061,
    "longitude": -96.725,
    "updatedAt": "2026-05-15T12:00:00.000Z"
  }
]
```

## Desarrollo

```bash
npm install
npm run dev
```
