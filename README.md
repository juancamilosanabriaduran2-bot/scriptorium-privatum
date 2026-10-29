# Scriptorium Privatum

Biblioteca digital personal de inspiración medieval. Es un sitio estático: los datos de cada obra están escritos directamente en `public/index.html`, y no requiere base de datos ni servidor de API.

## Funciones
- Estantería visual con portadas ilustradas mediante CSS.
- Catálogo de obras con fichas emergentes.
- Búsqueda por título, autor, categoría, época y descripción.
- Filtros por categoría y orden alfabético.
- Diseño adaptable a móvil, tableta y escritorio.
- Navegación accesible por teclado.

## Ver el sitio
Abre `public/index.html` en un navegador o publica el contenido de la carpeta `public` con un servicio de hosting estático. Los enlaces a CSS y JavaScript son relativos para admitir publicación en una subruta.

Si deseas probarlo localmente con Node.js, ejecuta `npm install` y después `npm start`; luego abre `http://localhost:3000`.

## Editar el catálogo
Cada obra es un elemento `<article class="work-card">` en `public/index.html`. Para añadir una, duplica un artículo y actualiza sus atributos `data-title`, `data-author`, `data-period`, `data-category`, `data-language`, `data-cover`, `data-description` y `data-note`, además del texto visible de la tarjeta. Las categorías disponibles deben coincidir con los botones de filtro. Los estilos de portada disponibles son `bestiary`, `rose`, `nights` y `hours`.

Para incluir una imagen propia, súbela al repositorio (por ejemplo a `public/images/`) y añade un elemento `img` en la tarjeta o ficha; usa imágenes que tengas derecho a publicar.

## Privacidad y administración
No existe formulario de edición público. El contenido se modifica editando el HTML y guardando los cambios en el repositorio. Quien tenga permiso de escritura en GitHub podrá modificarlo; mantener el repositorio privado limita el acceso al código, pero no convierte en privado un sitio web que publiques públicamente.

## Alcance
Los textos llamados “Nota de lectura” son comentarios originales de esta edición, no citas literales de las obras. Los datos iniciales forman un catálogo de muestra y pueden ampliarse o corregirse.
