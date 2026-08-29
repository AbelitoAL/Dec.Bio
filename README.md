# Dossier — sitio profesional editable

Tarjeta profesional digital de una sola página (Perfil, Trayectoria, Servicios,
Preguntas frecuentes, Contacto) con un panel de administración en `/admin`
para editar todos los textos sin tocar código.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · pensado para desplegar en Vercel.

## Abrir el proyecto en VS Code

```bash
code "C:\Users\Hp\Desktop\COSITAS\DERECHO\PROGRAMAS\BIOGRAFIA\web"
```

(o `Archivo → Abrir carpeta…` y selecciona esa carpeta `web`).

## Puesta en marcha local

1. Instala dependencias (ya están instaladas si acabas de recibir este proyecto):

   ```bash
   npm install
   ```

2. Crea tu archivo de entorno local a partir del ejemplo y define una contraseña de administrador:

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` y cambia `ADMIN_PASSWORD` por una contraseña real. `.env.local` nunca se sube a git.

3. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) para el sitio público y
   [http://localhost:3000/admin](http://localhost:3000/admin) para el panel de edición.

## Cómo editar el contenido

Todo el texto del sitio vive en [`content/site-content.json`](content/site-content.json),
tipado en [`lib/content.ts`](lib/content.ts). Hay dos formas de editarlo:

- **Desde `/admin`** (recomendado): inicia sesión con `ADMIN_PASSWORD`, cambia los
  campos que quieras (nombre, bio, estudios, servicios, preguntas, contacto…) y
  pulsa **Guardar cambios**. En desarrollo (`npm run dev`) o en un servidor propio
  (`npm run build && npm run start`) esto escribe directamente el archivo JSON.
- **A mano**: edita `content/site-content.json` directamente en VS Code y guarda.

Los textos entre `[corchetes]` son marcadores de ejemplo — reemplázalos por los datos reales.

### ⚠️ Importante sobre Vercel y la edición en producción

Vercel ejecuta cada request en una función serverless con **sistema de archivos
de solo lectura** (fuera de `/tmp`, que no persiste entre invocaciones). Eso
significa que:

- El sitio público en Vercel **sí** lee `content/site-content.json` con normalidad.
- Si entras a `/admin` ya desplegado en Vercel y pulsas **Guardar**, el panel
  te avisará de que no pudo escribir en el servidor.
- En ese caso usa el botón **Exportar JSON** del panel, reemplaza
  `content/site-content.json` en tu proyecto local con ese archivo, haz commit
  y vuelve a desplegar (`git push`, o `vercel --prod`).
- Si quieres que **Guardar** funcione en vivo también en producción, conecta
  una base de datos (por ejemplo Vercel KV o Postgres) y cambia
  `lib/content.ts` para leer/escribir ahí en lugar del archivo JSON — el resto
  de la app (API routes, formulario de admin) no necesita cambios.

Editar en local y desplegar es, con diferencia, la ruta más simple si no
necesitas que terceros editen el sitio sin tu ayuda.

## Panel de administración — cómo funciona

- `ADMIN_PASSWORD` protege `/admin`. Al iniciar sesión se guarda una cookie
  `httpOnly` firmada (HMAC) con expiración de 8 horas — ver [`lib/auth.ts`](lib/auth.ts).
- `GET /api/content` es público (es el mismo contenido que ya se ve en el sitio).
- `PUT /api/content` requiere la cookie de sesión válida.
- El formulario de `/admin` incluye **Exportar JSON** (descarga el contenido
  actual) e **Importar JSON** (carga un archivo para seguir editando antes de guardar).

## Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub (o similar).
2. En [vercel.com](https://vercel.com), importa el repositorio (framework
   detectado automáticamente: Next.js).
3. En **Project Settings → Environment Variables**, añade `ADMIN_PASSWORD`
   (y opcionalmente `ADMIN_SECRET`).
4. Despliega. El dominio que te da Vercel (o uno propio que conectes) ya sirve el sitio.

También puedes usar la CLI (`npm i -g vercel`, luego `vercel` desde esta carpeta) si prefieres la terminal.

## Estructura del proyecto

```
web/
  app/
    page.tsx              → sitio público (lee content/site-content.json en cada request)
    layout.tsx             → fuentes, tema, metadata
    admin/page.tsx          → panel de edición (cliente: login + formulario)
    api/content/route.ts    → GET público / PUT protegido para leer-escribir el contenido
    api/admin/{login,logout,me}/route.ts → autenticación del panel
  components/
    sections/               → Hero, Perfil, Trayectoria, Servicios, FAQ, Contacto, Footer
    admin/                  → LoginForm, EditorForm y sus campos reutilizables
    nav-rail.tsx, theme-toggle.tsx, reveal.tsx, theme-provider.tsx
  content/site-content.json → todo el texto del sitio (fuente de verdad)
  lib/content.ts             → tipos + lectura/escritura del JSON
  lib/auth.ts                → contraseña + cookie de sesión firmada
```

## Personalizar el diseño

Los colores, tipografías y radios viven como tokens CSS en
[`app/globals.css`](app/globals.css) (`:root` = tema claro, `.dark` = tema
oscuro, ambos alimentan las utilidades `bg-*`/`text-*`/`border-*` de Tailwind
vía `@theme`). Cambia esos valores para adaptar la paleta sin tocar componentes.
