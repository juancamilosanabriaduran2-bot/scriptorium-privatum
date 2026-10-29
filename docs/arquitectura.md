# Arquitectura inicial

## Primera entrega

- **Frontend:** HTML semántico, CSS adaptable y JavaScript sin framework.
- **API Gateway:** Node.js + Express sirve los archivos estáticos y expone `/api/works`.
- **Catálogo:** por ahora reside en un arreglo de datos de ejemplo en el servidor; se migrará a un servicio Ruby cuando se defina el modelo de persistencia.
- **Análisis textual:** servicio Python/FastAPI previsto para una fase posterior.

## Próximas etapas

1. Definir el modelo de obras, autores, ediciones, fragmentos, imágenes y etiquetas.
2. Añadir base de datos persistente y migraciones.
3. Implementar inicio de sesión para el propietario y autorización comprobada en cada ruta de escritura.
4. Incorporar carga de imágenes validada y almacenamiento de objetos.
5. Crear endpoints administrativos protegidos y registro de cambios.
6. Añadir pruebas automatizadas, configuración de despliegue y copias de seguridad.

## Seguridad

La interfaz pública es de solo lectura por ahora. No hay rutas de edición en esta primera versión. Antes de añadirlas, se deben implementar sesiones seguras, protección CSRF si se usan cookies, validación de entradas, límites de tamaño, control de tipos de archivo y autorización en el servidor. La visibilidad de un botón nunca debe ser la única barrera de seguridad.
