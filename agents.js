/*

=============================================================================
DECLARACIÓN DE USO DE INTELIGENCIA ARTIFICIAL
Y BITÁCORA TÉCNICA DE DESARROLLO
=============================================================================
Durante el desarrollo de este trabajo práctico se utilizó un modelo de
Inteligencia Artificial como herramienta de asistencia técnica para
acompañar el proceso de programación. Su participación estuvo orientada a la
resolución de problemas de implementación, consultas sobre sintaxis y apoyo
en la traducción de decisiones de diseño previamente definidas a código
JavaScript utilizando p5.js y la librería p5.sound.
Las principales decisiones conceptuales, estéticas, compositivas,
interactivas y metodológicas fueron desarrolladas por el estudiante, quien
dirigió el proceso completo de diseño, realizó las iteraciones necesarias,
evaluó las propuestas generadas por la IA y validó cada modificación
incorporada al proyecto.

=============================================================================
1. ASISTENCIA TÉCNICA PROPORCIONADA POR LA IA
=============================================================================
La Inteligencia Artificial fue utilizada para:
- Resolver dudas sobre la sintaxis de JavaScript y p5.js.
- Implementar estructuras de programación necesarias para el proyecto.
- Asistir en el uso de preload(), setup() y draw().
- Colaborar en la carga y representación de imágenes PNG.
- Implementar transformaciones mediante translate(), rotate() e imageMode().
- Resolver operaciones matemáticas utilizando map(), constrain(), random(),

  shuffle(), sin() y cos().

- Implementar el análisis de audio mediante p5.sound y FFT.
- Obtener información de volumen y energía en diferentes bandas de frecuencia.
- Ayudar en la programación de eventos condicionados por el sonido.
- Detectar y corregir errores durante el desarrollo.
- Proponer mejoras en la organización modular del código.
- Optimizar funciones para mejorar estabilidad, legibilidad y mantenimiento.

=============================================================================
2. DECISIONES DESARROLLADAS POR EL ESTUDIANTE
=============================================================================
Las siguientes decisiones corresponden principalmente al estudiante:
- Investigación del movimiento Neo-Geo y del lenguaje visual de Peter Halley.
- Definición del concepto general de la obra interactiva.
- Diseño de la composición visual.
- Producción de todos los recursos gráficos en Adobe Photoshop.
- Decisión de reemplazar figuras geométricas por imágenes propias.
- Selección de la paleta cromática.
- Definición del comportamiento dinámico del color.
- Diseño del sistema procedural de generación.
- Definición de reglas, restricciones y probabilidades.
- Organización jerárquica de las capas visuales.
- Definición de la interacción exclusivamente mediante sonido.
- Asociación del chasquido con la generación de una nueva composición.
- Asociación del sonido "Shhh" con el congelamiento temporal de la obra.
- Definición de los umbrales de detección, sensibilidad y tiempos de respuesta.
- Diseño del panel de configuración para calibrar el micrófono.
- Evaluación permanente y validación de cada modificación antes de incorporarla.

=============================================================================
3. EVOLUCIÓN DEL DESARROLLO
=============================================================================
El proyecto atravesó distintas etapas de desarrollo e iteración.
Inicialmente se experimentó con composiciones geométricas simples. Luego se
decidió abandonar las figuras primitivas para utilizar imágenes creadas
específicamente para la obra, buscando una mayor cercanía con los referentes
analizados.
Posteriormente se desarrolló un sistema procedural basado en reglas que
controla cantidades, posiciones, tamaños, rotaciones, colores y relaciones
espaciales entre los elementos, evitando composiciones completamente
aleatorias.
En una etapa posterior se incorporó un sistema de calibración del audio,
permitiendo ajustar sensibilidad, umbrales y rangos de frecuencia mediante
una interfaz gráfica para adaptar el funcionamiento a distintos micrófonos.
Finalmente se integró el sistema de interacción sonora mediante FFT,
permitiendo que la voz controle distintos aspectos del comportamiento visual
de la obra.

=============================================================================
4. ORGANIZACIÓN DEL PROYECTO
=============================================================================
El código fue organizado siguiendo una estructura modular para facilitar su
lectura, mantenimiento y futuras ampliaciones.
Las responsabilidades fueron separadas en:
- Carga de recursos (preload()).
- Inicialización del proyecto (setup()).
- Actualización permanente (draw()).
- Procesamiento y análisis de audio.
- Generación procedural de la composición.
- Construcción de la interfaz gráfica de configuración.
- Dibujo y renderizado de los elementos.
- Funciones auxiliares para color, movimiento y creación de objetos.
Esta organización permite modificar una parte del proyecto sin afectar el
resto de la estructura y facilita la incorporación de nuevas funcionalidades.

=============================================================================
5. SISTEMA GENERATIVO
=============================================================================
La composición visual responde a un conjunto de reglas previamente definidas y
no a un azar absoluto.
Cada nueva obra controla:
- Cantidad de elementos.
- Distribución espacial.
- Escalas permitidas.
- Rotaciones.
- Colores.
- Asignación de roles específicos para cada imagen.
- Orden de superposición por capas.
- Movimiento individual de cada objeto.
- Restricciones de repetición.
- Probabilidades de aparición.
Estas reglas garantizan diversidad visual manteniendo coherencia formal en
todas las composiciones generadas.

=============================================================================
6. CRITERIOS PARA FUTURAS MODIFICACIONES
=============================================================================
Toda modificación futura deberá respetar los siguientes criterios:
- Mantener la estructura modular del proyecto.
- Conservar la lógica procedural existente.
- No reemplazar los recursos gráficos desarrollados para la obra.
- Respetar el sistema de capas y jerarquías visuales.
- Mantener la interacción basada en audio como mecanismo principal.
- Integrar nuevas funciones sin alterar el comportamiento existente, salvo
  que sea necesario para ampliar la propuesta.
- Priorizar soluciones claras, reutilizables y correctamente documentadas.
=============================================================================

*/