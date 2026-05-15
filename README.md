# Pyramid Atlas

Atlas global de piramides con:

- mapa satelital
- filtros por pais
- fichas de cada sitio
- distancias entre ubicaciones
- sincronizacion diaria con Supabase

## Variables

Copiar `.env.example` a `.env.local` y completar:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

## Base de datos

Ejecutar `supabase/schema.sql` en el SQL editor de Supabase.

## Desarrollo

```bash
npm install
npm run dev
```
