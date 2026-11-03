# ACEG Comunicaciones

Propuesta navegable de renovacion. React, TypeScript, Vite y Lucide.

## Desarrollo

`pnpm install`, `pnpm dev`, `pnpm build`.

## GitHub Pages

El workflow `.github/workflows/pages.yml` publica `main` automaticamente.
En el repositorio, configurar Settings > Pages > Source: GitHub Actions.
No requiere claves de despliegue ni tokens personales en el codigo.
El workflow obtiene la URL y el prefijo del repositorio desde GitHub Pages.

Para probar una publicacion bajo un subdirectorio:
`BASE_PATH=/aceg/ SITE_URL=https://usuario.github.io/aceg/ pnpm build`.
`pnpm test` verifica las entradas HTML, sitemap y metadatos para dominio propio
y repositorio. El build genera una entrada por ruta, mas `404.html`.
La configuracion local por defecto conserva la vista privada de Sites.

## Contenido

Productos, industrias, portfolio y perspectivas: `src/data/content.ts`.
Directorio de 109 distribuidores: `src/data/dealers.json`, importado de la web publica de ACEG.
Diseno: `DESIGN.md`. Imagenes y procedencia: `public/assets/`.

## Alcance

Home, productos con filtros y fichas, WAVE PTX, accesorios, soluciones, industrias,
distribuidores con busqueda, nosotros, perspectivas, contacto, privacidad y 404.
Sin precios ni datos de clientes ficticios. Las perspectivas son contenido editorial
de propuesta, no casos de exito ni novedades fechadas.

El contacto valida los campos y prepara un correo para enviar con la aplicacion del
visitante. No hay backend de leads ni afirmacion de envio exitoso. No se invento un
numero de WhatsApp: el contacto flotante lleva a los canales publicos verificados.

Antes del lanzamiento comercial: revision de productos y copys por ACEG, validacion
de contactos, fotos definitivas y conexion del formulario al destino comercial elegido.
La URL de Sites es una vista privada de revision; no reemplaza el dominio actual.

## Video de portada

Clip oficial: "Critical Communication B-roll", Motorola Solutions, 16.491 segundos.
Fuente: https://video.motorolasolutions.com/detail/video/6302971659001
Tambien utilizado en la pagina oficial de comunicaciones criticas de Motorola.
El archivo se sirve localmente, con una version de menor resolucion para celulares.
Reproduccion en loop, sin sonido y con control de pausa. Respeta movimiento reducido
y ahorro de datos; pausa cuando la portada o la pestana no estan visibles.
El poster permanece como respaldo si la reproduccion no esta disponible.
Configuracion y procedencia: `src/data/media.ts` y `public/assets/sources.json`.
