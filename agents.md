# Declaración de uso de Agentes de IA

Para el desarrollo de este trabajo práctico se utilizó asistencia de Inteligencia Artificial (modelo Gemini) como co-piloto de programación.

* **Rol de la IA:** Traducción de lógicas compositivas a código JavaScript (p5.js). Asistencia en la resolución matemática para el mapeo de interacción (`map`, `constrain`) y en la sintaxis para la carga y manipulación de imágenes (`preload`, `tint`, `imageMode`).
  
* **Rol del Estudiante (Decisiones de Diseño):**
  Definición del análisis formal de los referentes (estilo Neo-Geo / Peter Halley). Corrección de la IA para abandonar el uso de figuras primitivas (`rect`, `line`) y forzar la transición a un sistema basado en imágenes de mapa de bits (Photoshop) para lograr la textura y opacidad correctas. Definición estricta de la paleta cromática, roles de los elementos y límites de probabilidad.

* **Modo de interacción e Iteraciones Clave:**
  1. Se solicitó a la IA generar un sistema procedural geométrico, pero el resultado inicial carecía de la estructura de las obras de referencia (se generaba un "masacote" desordenado con contornos no deseados).
  2. Se instruyó a la IA para eliminar contornos (`noStroke`) y limitar la interacción del mouse para que las escalas no colapsaran las figuras.
  3. **Migración a Imágenes:** Se le ordenó a la IA reescribir el sistema de dibujado para que en lugar de usar código primitivo, leyera 4 archivos PNG externos creados por el estudiante (`marco`, `celda`, `rejas`, `textura`).
  4. **Control de Azar:** Se corrigió a la IA para evitar la repetición de colores y aplicar probabilidades estrictas (garantizar la aparición de 1 sola textura y 1 sola reja por obra, con rotación aleatoria de 90° para esta última).
  5. **Composición:** Se ajustaron las coordenadas de nacimiento de los elementos para asegurar una composición centrada y equilibrada en todo el lienzo.

  # Declaración de uso de Agentes de IA (Continuación - Implementación de Audio)

Para la segunda etapa del desarrollo de este trabajo práctico, se continuó utilizando la asistencia de Inteligencia Artificial (modelo Gemini) como co-piloto de programación, enfocándose en la transición de un sistema de interacción analógico (mouse/teclado) a uno de carácter reactivo por sonido y voz.

* **Rol de la IA:** Asistencia en el procesamiento de la librería `p5.sound`. Traducción de rangos de frecuencia abstractos a valores numéricos reales en Hertz (Hz). Depuración de errores críticos de sincronización asíncrona del micrófono en el navegador (`p5.AudioIn`) y diseño modular de una interfaz gráfica de usuario (GUI) nativa para calibración interactiva.
  
* **Rol del Estudiante (Decisiones de Diseño):**
  Definición conceptual de las sinestesias de la obra: asignación de las bajas frecuencias (sonidos graves/vocal "UUU") al oscurecimiento dramático y las altas frecuencias (sonidos agudos/vocal "AAA") al aclarado lumínico del color HSB. Establecimiento de los criterios físicos para las acciones (un impacto seco/chasquido para resetear la obra y un siseo prolongado/"shhh" para pausar/congelar la matriz). Corrección del rango de color para forzar virajes cromáticos drásticos y evidentes en lugar de sutiles.

* **Modo de interacción e Iteraciones Clave (Evolución del Código):**
  1. **Migración a Entrada de Audio:** Se solicitó reemplazar la lectura tradicional de los ejes `mouseX` y `mouseY` por las lecturas dinámicas de amplitud y análisis de espectro FFT.
  2. **Resolución de Errores del Sistema:** Ante un fallo interno de p5.js (`TypeError: Cannot read properties of undefined` en el búfer de amplitud), se guió a la IA para reestructurar el `setup()`, forzando la inicialización del analizador exclusivamente mediante un *callback* asíncrono una vez que el usuario otorga permisos de micrófono.
  3. **Calibración de Frecuencias Reales (Hz):** Las cadenas de texto por defecto de p5 (`"bass"`, `"treble"`) resultaron imprecisas para la voz humana. Se corrigió a la IA para segmentar el espectro utilizando rangos estrictos en Hertz: de 80 a 320 Hz para aislar la gravedad de la "UUU", y de 2500 a 7000 Hz para la brillantez de la "AAA" y los siseos.
  4. **Diseño de Interfaz de Calibración (GUI):** Con el fin de evitar la edición constante del código según la acústica del entorno, se coordinó con la IA la adición de un panel de control flotante lateral programado nativamente en DOM. Este menú permite ajustar sliders de sensibilidad, umbrales de disparo de eventos y rangos de Hz en tiempo real sin interferir con la visualización limpia de la obra abstracta.