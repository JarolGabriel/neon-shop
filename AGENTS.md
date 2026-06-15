# Neon Shop — Guía para agentes y desarrolladores

## Qué es este proyecto

Neon Shop es una plataforma e-commerce multi-instancia para talleres de letreros de neón LED. Un único repositorio y un único deploy en Vercel sirven a múltiples clientes (tiendas) independientes: cada uno tiene su propio dominio y su propio proyecto Supabase. El código es 100% compartido; la personalización de cada tienda se hace por configuración (variables de entorno + `site_settings`), no por ramas ni forks del código.

---

## Regla de oro — sin hardcodeo de datos de negocio

**Todo dato que varía entre instancias DEBE vivir en `site_settings` (o en variables de entorno cuando corresponda a infraestructura).** Nunca hardcodear en componentes, emails, metadata ni copy de marketing.

### Qué SÍ va en `site_settings`

| Tipo | Keys / ejemplos |
|------|-----------------|
| Identidad UI | `store_name` (navbar, footer, emails transaccionales) |
| SEO / Open Graph | `site_name`, `site_tagline`, `site_description`, `og_image_url` |
| Contacto | `whatsapp_number`, `support_email`, `address`, `business_hours` |
| Redes | `instagram_url`, `facebook_url`, `tiktok_url`, `youtube_url` |
| Políticas | `shipping_info`, `return_policy` |

Leer siempre vía helpers en `src/lib/site-settings-utils.ts` (`getStoreName`, `getSiteMetadata`, `getSupportEmail`, etc.). En servidor: `fetchSiteSettings()`. En cliente: `GET /api/settings` → `getSiteSettings()` en `src/lib/api.ts`.

### Qué NO va en `site_settings`

- Lógica de negocio (precios, carrito, órdenes, auth)
- Colores y tokens del design system (`globals.css`, `DESIGN_SYSTEM.md`)
- Rutas de la app (`/productos`, `/admin`, etc.)
- Estructura de componentes o flujos de checkout

---

## Cómo funciona multi-instancia

```
Dominio del cliente (ej. neonshop.shop)
    → Variables de entorno en Vercel (scope por dominio)
    → Proyecto Supabase de ese cliente
    → Tabla site_settings de ese cliente
    → Tienda personalizada (mismo código, distinta configuración)
```

### Variables que cambian por instancia

| Variable | Motivo |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Cada cliente tiene su Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cada cliente tiene su Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Cada cliente tiene su Supabase |
| `RESEND_FROM_EMAIL` | El remitente debe ser el dominio verificado del cliente |
| `NEXT_PUBLIC_SITE_URL` | URL canónica de esa instancia |
| `ADMIN_EMAILS` | El admin de cada tienda es distinto |

### Variables comunes a todas las instancias

| Variable | Notas |
|----------|--------|
| `RESEND_API_KEY` | Una sola cuenta Resend para todos los deploys |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Solo fallback en desarrollo; en producción el número real va en `site_settings.whatsapp_number` |

---

## Convenciones de código que Cursor debe respetar

1. **Nunca hardcodear** nombre de tienda, teléfono, email ni URLs de redes en código. Usar `site_settings` y los helpers en `site-settings-utils.ts`.

2. **`fetchSiteSettings()`** solo en Server Components y `generateMetadata`. En Client Components usar `GET /api/settings` (nunca importar `supabaseAdmin` en el cliente).

3. **Nuevo dato configurable por instancia:** agregar en este orden:
   - Key en `SITE_SETTING_KEYS` (`src/types/site-settings.ts`)
   - Helper en `site-settings-utils.ts`
   - Campo en Admin → Configuración
   - Migración SQL en `supabase/migrations/`

4. **Design system** (`cyber-yellow`, `neon-pink`, `vite-purple` en `globals.css`) es compartido entre todas las instancias. No añadir colores por cliente en el design system.

5. **`supabaseAdmin`** (service role) solo en API routes y Server Components. Nunca en el browser ni en Client Components.

6. **`proxy.ts`** es el middleware de autenticación admin. Antes de agregar rutas `/api/admin/`, verificar que el matcher las cubra.

---

## Para agregar una nueva instancia (cliente)

Checklist operacional — **no requiere cambios en el repositorio**:

1. Crear proyecto nuevo en Supabase.
2. Ejecutar todas las migraciones en `supabase/migrations/` en orden cronológico.
3. En Vercel, agregar el dominio del cliente al mismo proyecto (o al deploy compartido).
4. Configurar las variables de entorno de esa instancia en Vercel → Settings → Environment Variables, con **scope por dominio**.
5. El cliente entra a `su-dominio.com/admin` y completa **Admin → Configuración** (identidad SEO, marca, WhatsApp, redes, políticas).
6. Listo. El repo y el código no se tocan.

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
