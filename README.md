# Scriptorium Privatum

Biblioteca digital personal de inspiración medieval. La primera versión incluye una interfaz adaptable, estantería interactiva, búsqueda y fichas de obras de ejemplo.

## Estructura

- `public/`: interfaz web estática.
- `server/`: API inicial en Node.js y Express.
- `docs/`: decisiones de arquitectura.

## Requisitos

- Node.js 20 o superior.

## Ejecutar

1. Instala dependencias con `npm install`.
2. Inicia el servidor con `npm start`.
3. Abre `http://localhost:3000`.

En desarrollo, `npm run dev` inicia el servidor con reinicio automático si tienes nodemon instalado.

## Estado actual

Esta es una base funcional de prototipo. El catálogo usa datos de ejemplo; todavía no hay autenticación de administrador ni persistencia en base de datos. No publiques credenciales ni secretos en el repositorio. Antes de permitir edición real, debe implementarse autenticación y autorización en el servidor.
