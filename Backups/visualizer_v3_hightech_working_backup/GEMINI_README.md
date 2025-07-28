# Documentación para Gemini: Proyecto "Visualizador de Cursos de IA"

Este documento está diseñado para proporcionar a Gemini (o cualquier agente de IA) la información necesaria para comprender, mantener y escalar el proyecto "Visualizador de Cursos de IA".

## 1. Arquitectura de la Aplicación Web

Este proyecto es una aplicación web estática de una sola página (SPA) que se ejecuta completamente en el lado del cliente. No hay un backend o base de datos tradicional.

*   **HTML (`index.html`):** Es el punto de entrada principal. Define la estructura básica de la página, incluyendo la barra lateral de navegación y el área de contenido principal.
*   **CSS (`visualizer_bin/css/style.css`):** Contiene todos los estilos visuales de la aplicación, incluyendo el diseño responsivo, la tipografía, los colores y las animaciones.
*   **JavaScript (`visualizer_bin/js/script.js`):** Es el cerebro de la aplicación. Se encarga de:
    *   Cargar dinámicamente la lista de cursos en la barra lateral.
    *   Manejar la navegación entre cursos y la sección "Sobre Nosotros".
    *   Cargar y renderizar el contenido de los cursos y la información "Sobre Nosotros" a partir de archivos JSON.
    *   Gestionar la funcionalidad del acordeón para el programa detallado.
    *   Implementar la galería de imágenes con lightbox.
    *   Proporcionar navegación por teclado y botones de desplazamiento.
    *   **Manejo de Logos:** Incluye una lógica de fallback para los logos (`logo.svg` y `logo.png`). Si `logo.svg` no se carga, automáticamente intentará cargar `logo.png`.
*   **Datos (`visualizer_bin/data/*.json`):** Estos archivos JSON actúan como la "base de datos" del proyecto. Cada `curso_X.json` contiene los detalles de un curso específico, y `informacion_general.json` contiene la información de la sección "Sobre Nosotros".
*   **Activos (`visualizer_bin/images/`, `visualizer_bin/sounds/` - aunque los audios han sido eliminados):** Contienen las imágenes de los cursos, logos y otros elementos multimedia.

**Flujo de Datos:**
1.  El usuario abre `index.html`.
2.  `script.js` se ejecuta, carga la lista de cursos y muestra la pantalla de bienvenida.
3.  Cuando el usuario selecciona un curso o "Sobre Nosotros", `script.js` realiza un `fetch` al archivo JSON correspondiente en `visualizer_bin/data/`.
4.  Una vez que los datos JSON se cargan, `script.js` los utiliza para generar dinámicamente el HTML y renderizar el contenido en el área principal.

## 2. Mapa de Escalabilidad

Dado que es una aplicación estática, la escalabilidad se centra en la gestión de contenido y la extensión de funcionalidades del lado del cliente.

*   **Añadir Nuevos Cursos:**
    *   Crea un nuevo archivo JSON (`curso_X.json`) en `visualizer_bin/data/` siguiendo la estructura de los archivos existentes.
    *   Asegúrate de que el `image_url` y `video.youtube_url` (si aplica) apunten a rutas válidas.
    *   El `script.js` ya está configurado para cargar dinámicamente hasta 10 cursos. Si se necesitan más, la lógica de carga en `script.js` (el bucle `for` que va de 1 a 10) deberá ajustarse para incluir el nuevo rango de cursos.
    *   Añade el título del nuevo curso al array `courseTitles` en `script.js` en la posición correcta.
*   **Añadir/Actualizar Contenido "Sobre Nosotros":**
    *   Edita directamente el archivo `visualizer_bin/informacion_general.json`.
*   **Gestión de Activos (Imágenes/Videos):**
    *   Las imágenes de los cursos se almacenan en `visualizer_bin/images/`. Se recomienda crear una subcarpeta por curso (ej. `visualizer_bin/images/curso_X/`).
    *   Los videos se enlazan a través de URLs de YouTube en los archivos JSON de los cursos. No se alojan videos directamente en el proyecto.
*   **Extensión de Funcionalidad (JavaScript):**
    *   Para nuevas características, modifica `visualizer_bin/js/script.js`. Sigue las convenciones de código existentes.
    *   Si la funcionalidad es muy específica o compleja, considera modularizar el código en funciones separadas dentro del mismo archivo o, si es necesario, en archivos JS adicionales (asegurándote de enlazarlos correctamente en `index.html`).
*   **Extensión de Estilos (CSS):**
    *   Para cambios visuales, modifica `visualizer_bin/css/style.css`. Mantén la organización existente y utiliza variables CSS (`:root`) cuando sea apropiado.
*   **Limitaciones:**
    *   Al ser una aplicación estática, no soporta funcionalidades que requieran un servidor (ej. autenticación de usuarios, comentarios, formularios de contacto dinámicos, búsqueda avanzada en el contenido de los cursos sin cargar todos los datos).
    *   El rendimiento para un número muy grande de cursos podría verse afectado si todos los datos se cargan de golpe. Actualmente, los cursos se cargan bajo demanda.

## 3. Instrucciones para Gemini (Edición del Proyecto)

Cuando edites este proyecto, por favor, ten en cuenta lo siguiente:

1.  **Comprender el Contexto:**
    *   Siempre lee los archivos relevantes (`.html`, `.css`, `.js`, `.json`) antes de realizar cambios. Utiliza `read_file` para obtener el contenido exacto.
    *   Familiarízate con la estructura de los datos JSON antes de modificarlos.
2.  **Adherencia a Convenciones:**
    *   **Estilo de Código:** Mantén el estilo de indentación, nombramiento de variables y formato general de los archivos JavaScript y CSS existentes.
    *   **Rutas:** Siempre utiliza rutas absolutas para los archivos cuando uses herramientas como `read_file`, `write_file` o `replace`. Las rutas relativas en el código HTML/CSS/JS deben ser relativas al archivo que las referencia.
3.  **Modificaciones de Código:**
    *   **`script.js`:** Es el archivo más crítico. Ten extremo cuidado al modificarlo.
        *   Para añadir nuevas funcionalidades, intenta integrarlas de forma modular, preferiblemente al final del archivo o dentro de funciones existentes si encajan lógicamente.
        *   Si necesitas modificar una sección existente, asegúrate de entender su propósito completo.
    *   **Archivos JSON:**
        *   Mantén la estructura JSON consistente. Cada curso debe tener los mismos campos.
        *   Asegúrate de que las URLs de imágenes y videos sean correctas.
    *   **HTML/CSS:** Realiza cambios incrementales y verifica el impacto visual.
4.  **Verificación:**
    *   **Después de cualquier cambio en el código:** Abre `index.html` en un navegador web para verificar visualmente que la aplicación funciona como se espera y que los cambios se han aplicado correctamente sin introducir errores.
    *   Presta especial atención a la consola del navegador para detectar errores de JavaScript o problemas de carga de recursos.
5.  **Manejo de Errores (Logos):**
    *   Recuerda que la lógica de fallback de logos ya está implementada en `script.js`. Si se te pide cambiar un logo, prioriza actualizar `logo.svg`. Si el usuario proporciona un `.png`, asegúrate de que esté en `visualizer_bin/images/` y que la lógica de fallback lo pueda encontrar.
6.  **Audio a Video:**
    *   Los reproductores de audio han sido eliminados y reemplazados por reproductores de video (YouTube embeds). Si se menciona audio en el futuro, asume que se refiere a video o aclara con el usuario.

Este documento servirá como tu guía principal para futuras interacciones con este proyecto.
