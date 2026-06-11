// --- VARIABLES GLOBALES ---
let fondoConductos = [];
let celdasFrontales = [];
let coloresBase;

let congelado = false;
let mouseXCongelado, mouseYCongelado;

// Variables de Audio
let mic;
let fft;
let contadorShhh = 0; 
let chasquear = true; 

// --- VARIABLES DEL MENÚ DESPLEGABLE ---
let panelUI;
let botonMenu;
let menuVisible = false;

// Sliders y configuraciones mutables por el usuario
let sliderSensibilidadVol;
let sliderUmbralChasquido;
let sliderUmbralShhh;
let sliderTiempoShhh;
let sliderFrecMinGraves, sliderFrecMaxGraves;
let sliderFrecMinAgudos, sliderFrecMaxAgudos;

// Variables para las imágenes de Photoshop
let imgMarco;
let imgCelda;
let imgRejas;
let imgTextura;

function preload() {
  imgMarco = loadImage('marco.png');
  imgCelda = loadImage('celda.png');
  imgRejas = loadImage('rejas.png');
  imgTextura = loadImage('textura.png');
}

function setup() {
  createCanvas(800, 600);

  // Inicialización optimizada del Micrófono y FFT
  mic = new p5.AudioIn();
  mic.start(() => {
    // Esto se ejecuta SOLO cuando el mic ya está activo
    fft = new p5.FFT(0.8, 512);
    fft.setInput(mic);
  });
  
  fft = new p5.FFT(0.8, 512);

  // PALETA RECALIBRADA
  coloresBase = [
    color(205, 45, 50),   // Rojo un poco más vivo e intenso
    color(225, 185, 40),  // Mostaza
    color(145, 80, 180),  // Violeta con más saturación
    color(135, 180, 60),  // Verde oliva más vibrante
    color(40, 80, 150),   // Azul acero con más fuerza
    color(170, 170, 170), // Gris cemento medio
    color(80, 80, 80),    // Gris plomo
    color(215, 205, 190)  // Arena 
  ];
  
  crearMenuParametros();

  generarNuevaObra();
}

function draw() {
  background(35); 

  // Analizar audio
  fft.analyze();

  // LEER VALORES DESDE EL MENÚ EN TIEMPO REAL
  let factorVol = sliderSensibilidadVol.value();
  let umbralChasquido = sliderUmbralChasquido.value();
  let umbralShhh = sliderUmbralShhh.value();
  let limiteContadorShhh = sliderTiempoShhh.value();
  
  let fMinG = sliderFrecMinGraves.value();
  let fMaxG = sliderFrecMaxGraves.value();
  let fMinA = sliderFrecMinAgudos.value();
  let fMaxA = sliderFrecMaxAgudos.value();

  // Procesar volumen con la sensibilidad del slider
  let volumenRaw = mic.getLevel();
  let volumen = constrain(volumenRaw * factorVol, 0, 1); 
  
  // Procesar frecuencias con los rangos dinámicos del slider
  let graves = fft.getEnergy(fMinG, fMaxG);    
  let agudos = fft.getEnergy(3000, 6000);

  // --- LÓGICA DE INTERACCIÓN POR VOZ ---
  
  // 1. REINICIAR (Chasquido)
  if (volumen > 0.15 && agudos > umbralChasquido && chasquear) {
    generarNuevaObra();
    chasquear = false;
    setTimeout(() => { chasquear = true; }, 600); 
  }

  // 2. CONGELAR ("shhh" > 2 segundos)
  if (agudos > (umbralShhh * 0.75) && volumen > 0.0015 && graves < 60) {
    contadorShhh++;
    if (contadorShhh > (limiteContadorShhh / 2.5)) { 
      congelado = !congelado;
      if (congelado) {
        let simuladoX = map(agudos - graves, -150, 150, 0, width, true);
        let simuladoY = map(volumen, 0, 0.4, 0, height, true);
        mouseXCongelado = constrain(simuladoX, 0, width);
        mouseYCongelado = constrain(simuladoY, 0, height);
      }
      contadorShhh = 0; 
    }
  } else {
    contadorShhh = max(0, contadorShhh - 1.5); 
  }

  let mx, my;

  if (congelado) {
    mx = mouseXCongelado;
    my = mouseYCongelado;
  } else {
    // Eje X (Tonos/Frecuencias): Compara "AAA" (agudos) contra "UUU" (graves) para mapear de 0 a width
    let diferenciaFrecuencia = agudos - graves; 
    mx = map(diferenciaFrecuencia, -120, 120, 0, width, true);

    // Eje Y (Volumen/Amplitud): Mapea el rango del susurro, voz media y grito de 0 a height
    my = map(volumen, 0.01, 0.45, 0, height, true);
  }

  mx = constrain(mx, 0, width);
  my = constrain(my, 0, height);

  let variacionColor = map(mx, 0, width, -20, 20); 
  let escalaObj = map(my, 0, height, 0.95, 1.05);

  // 1. Dibujar el laberinto de fondo
  for (let conducto of fondoConductos) {
    dibujarElemento(conducto, escalaObj, variacionColor);
  }

  // 2. Dibujar las celdas principales
  for (let celda of celdasFrontales) {
    dibujarElemento(celda, escalaObj, variacionColor);
  }
}

// --- CONSTRUCCIÓN DE LA INTERFAZ (GUI) ---
function crearMenuParametros() {
  // Botón para desplegar/ocultar el menú
  botonMenu = createButton('⚙ Configurar Voz');
  botonMenu.position(20, 20);
  botonMenu.style('padding', '8px 14px');
  botonMenu.style('background-color', '#fff');
  botonMenu.style('border', 'none');
  botonMenu.style('border-radius', '4px');
  botonMenu.style('cursor', 'pointer');
  botonMenu.style('font-weight', 'bold');
  botonMenu.style('z-index', '9999');
  botonMenu.mousePressed(toggleMenu);

  // Contenedor principal del panel flotante
  panelUI = createDiv('');
  panelUI.position(20, 60);
  panelUI.style('background-color', 'rgba(25, 25, 25, 0.92)');
  panelUI.style('color', '#fff');
  panelUI.style('padding', '15px');
  panelUI.style('width', '260px');
  panelUI.style('border-radius', '6px');
  panelUI.style('font-family', 'sans-serif');
  panelUI.style('font-size', '12px');
  panelUI.style('box-shadow', '0px 4px 10px rgba(0,0,0,0.5)');
  panelUI.hide(); // Inicia oculto

  // Función interna para crear sliders con etiquetas de texto ordenadas
  function agregarControl(texto, min, max, defecto, paso) {
    let label = createDiv(texto);
    label.parent(panelUI);
    label.style('margin-top', '10px');
    label.style('font-weight', 'bold');
    
    let slider = createSlider(min, max, defecto, paso);
    slider.parent(panelUI);
    slider.style('width', '100%');
    slider.style('margin-bottom', '5px');
    return slider;
  }

  // Creación de cada Slider asignado a sus variables correspondientes
  sliderSensibilidadVol = agregarControl('Sensibilidad de Volumen (Multiplicador):', 1.0, 5.0, 2.5, 0.1);
  sliderUmbralChasquido  = agregarControl('Umbral de Chasquido (Cambio de obra):', 50, 200, 110, 5);
  sliderUmbralShhh       = agregarControl('Umbral Sonido "Shhh" (Congelar):', 40, 150, 70, 5);
  sliderTiempoShhh       = agregarControl('Duración requerida para "Shhh" (Frames):', 40, 180, 100, 5);
  
  sliderFrecMinGraves    = agregarControl('Frecuencia Mínima Graves - oscurecer colores ("UUU" Hz):', 40, 200, 80, 5);
  sliderFrecMaxGraves    = agregarControl('Frecuencia Máxima Graves - oscurecer colores ("UUU" Hz):', 220, 500, 320, 5);
  
  sliderFrecMinAgudos    = agregarControl('Frecuencia Mínima Agudos - aclarar colores ("AAA" Hz):', 1000, 3000, 2500, 50);
  sliderFrecMaxAgudos    = agregarControl('Frecuencia Máxima Agudos - aclarar colores ("AAA" Hz):', 4000, 10000, 7000, 100);
}

function toggleMenu() {
  menuVisible = !menuVisible;
  if (menuVisible) {
    panelUI.show();
    botonMenu.html('✖ Cerrar Config');
  } else {
    panelUI.hide();
    botonMenu.html('⚙ Configurar Voz');
  }
}

// --- GENERACIÓN ESTRUCTURADA ---
function generarNuevaObra() {
  fondoConductos = [];
  celdasFrontales = [];
  
  let paletaMezclada = shuffle(coloresBase.slice());
  let colorIndex = 0;

  // 1. CONDUCTOS (Fondos - marco.png)
  let numMarcos = floor(random(3, 6)); 

  for (let i = 0; i < numMarcos; i++) {
    let w = random(500, 950); 
    let h = random(400, 750);
    let x = random(width / 2 - 150, width / 2 + 150);
    let y = random(height / 2 - 100, height / 2 + 100);
    let c = paletaMezclada[colorIndex];
    colorIndex++;
    fondoConductos.push(crearObjeto(x, y, w, h, c, 'marco', 0));
  }

  // 2. CELDAS FRONTALES (celda, rejas o textura)
  let numCeldas = floor(random(2, 4)); 
  let zonasX = [];
  if (numCeldas === 2) {
    zonasX = [random(150, 350), random(450, 650)];
  } else {
    zonasX = [random(100, 250), random(350, 450), random(550, 700)];
  }
  zonasX = shuffle(zonasX); 

  let roles = ['textura', 'rejas'];
  if (numCeldas === 3) {
    roles.push('celda'); 
  }
  roles = shuffle(roles); 

  for (let i = 0; i < numCeldas; i++) {
    let wCelda = random(220, 380);
    let hCelda = random(220, 380);
    let xCelda = zonasX[i]; 
    let yCelda = random(150, height - 150);
    let tipoImagen = roles[i]; 
    let rotacionActual = 0; 
    
    if (tipoImagen === 'rejas') {
      if (random() > 0.5) {
        rotacionActual = HALF_PI; 
      }
    }

    let c = paletaMezclada[colorIndex];
    colorIndex++;
    celdasFrontales.push(crearObjeto(xCelda, yCelda, wCelda, hCelda, c, tipoImagen, rotacionActual));
  }
}

// --- FUNCIONES AUXILIARES ---
function crearObjeto(x, y, w, h, col, tipo, rot) {
  return { x: x, y: y, w: w, h: h, col: col, tipo: tipo, rot: rot };
}

function dibujarElemento(obj, escala, matizMod) {
  let colModificado = alterarColorHSB(obj.col, matizMod);
  let wEscalado = obj.w * escala;
  let hEscalado = obj.h * escala;

  push();
  translate(obj.x, obj.y);
  rotate(obj.rot);
  imageMode(CENTER);
  tint(colModificado); 

  if (obj.tipo === 'marco' && imgMarco) {
    image(imgMarco, 0, 0, wEscalado, hEscalado);
  } 
  else if (obj.tipo === 'textura' && imgTextura) {
    image(imgTextura, 0, 0, wEscalado, hEscalado);
  } 
  else if (obj.tipo === 'rejas' && imgRejas) {
    image(imgRejas, 0, 0, wEscalado, hEscalado);
  } 
  else if (obj.tipo === 'celda' && imgCelda) {
    image(imgCelda, 0, 0, wEscalado, hEscalado);
  }
  pop();
}

function alterarColorHSB(c, variacion) {
  colorMode(HSB, 360, 100, 100);
  let h = hue(c);
  let s = saturation(c);
  let b = brightness(c);
  
  if (s > 10) {
    h = (h + variacion + 360) % 360;
  }
  
  let colFinal = color(h, s, b);
  colorMode(RGB, 255); 
  return colFinal;
}
