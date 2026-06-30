// --- VARIABLES GLOBALES ---
let fondoConductos = [];
let celdasFrontales = [];
let coloresBase;

let inicio = false;

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
let imgVentana;        
let imgDosCuadrados;   
let imgCuadradosFondo; 

function preload() {
  imgMarco = loadImage('marco.png');
  imgCelda = loadImage('celda.png');
  imgRejas = loadImage('reja.png');
  imgTextura = loadImage('textura.png');
  imgVentana = loadImage('ventana.png');
  imgDosCuadrados = loadImage('dos cuadrados separados.png');
  imgCuadradosFondo = loadImage('cuadrados para el fondo.png');
}

function setup() {
  createCanvas(800, 600);

  mic = new p5.AudioIn();
  mic.start(() => {
    fft = new p5.FFT(0.8, 512);
    fft.setInput(mic);
  });
  
  fft = new p5.FFT(0.8, 512);

  coloresBase = [
    color(205, 45, 50),   
    color(225, 185, 40),  
    color(145, 80, 180),  
    color(135, 180, 60),  
    color(40, 80, 150),   
    color(170, 170, 170), 
    color(80, 80, 80),    
    color(215, 205, 190)  
  ];
  
  crearMenuParametros();
  generarNuevaObra();
}

function draw() {

if (!inicio) {
  background(35);

  fill(255);
  textAlign(CENTER, CENTER);

  textSize(32);
  text("Hacer click para iniciar", width / 2, height / 2);

  return;
}

  background(35); 

  fft.analyze();

  let factorVol = sliderSensibilidadVol.value();
  let umbralChasquido = sliderUmbralChasquido.value();
  let umbralShhh = sliderUmbralShhh.value();
  let limiteContadorShhh = sliderTiempoShhh.value();
  
  let fMinG = sliderFrecMinGraves.value();
  let fMaxG = sliderFrecMaxGraves.value();
  let fMinA = sliderFrecMinAgudos.value();
  let fMaxA = sliderFrecMaxAgudos.value();

  let volumenRaw = mic.getLevel();
  let volumen = constrain(volumenRaw * factorVol, 0, 1); 
  
  let graves = fft.getEnergy(fMinG, fMaxG);    
  let agudos = fft.getEnergy(fMinA, fMaxA);

  // --- LÓGICA DE INTERACCIÓN POR VOZ ---
  
  // 1. CHASQUIDO (Genera nueva obra)
  if (volumen > 0.15 && agudos > umbralChasquido && chasquear) {
    generarNuevaObra();
    chasquear = false;
    setTimeout(() => { chasquear = true; }, 600); 
  }

  // 2. SHHHH (Congela movimiento y variaciones por 5 segundos)
  if (agudos > umbralShhh && volumen > 0.03 && graves < 80) {
    contadorShhh++;
    if (contadorShhh > limiteContadorShhh && !congelado) { 
      congelado = true;
      let simuladoX = map(agudos - graves, -150, 150, 0, width, true);
      let simuladoY = map(volumen, 0, 0.4, 0, height, true);
      mouseXCongelado = constrain(simuladoX, 0, width);
      mouseYCongelado = constrain(simuladoY, 0, height);
      
      setTimeout(() => { congelado = false; }, 5000);
      
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
    let diferenciaFrecuencia = agudos - graves; 
    mx = map(diferenciaFrecuencia, -120, 120, 0, width, true);
    my = map(volumen, 0.01, 0.45, 0, height, true);
  }

  mx = constrain(mx, 0, width);
  my = constrain(my, 0, height);

  let variacionColor = map(mx, 0, width, -15, 15); 
  let escalaObj = map(my, 0, height, 0.95, 1.05);

  let modBrillo = 0;
  if (volumen > 0.03) {
    if (graves > agudos) {
      modBrillo = map(graves, 50, 255, 0, -25, true); 
    } else {
      modBrillo = map(agudos, 50, 255, 0, 30, true);
    }
  }

  noStroke();

  // --- ORDENAMIENTO ESTRICTO DE CAPAS ---

  // Capa 1: Estructuras profundas de fondo (marcos y dos_cuadrados)
  for (let conducto of fondoConductos) {
    if (conducto.tipo !== 'cuadrados_fondo') {
      dibujarElemento(conducto, escalaObj, variacionColor, volumen, modBrillo);
    }
  }

  // Capa 2: Celdas base intermedias (celda lisa y textura)
  for (let celda of celdasFrontales) {
    if (celda.tipo === 'celda' || celda.tipo === 'textura') {
      dibujarElemento(celda, escalaObj, variacionColor, volumen, modBrillo);
    }
  }

  // Capa 3 (¡ADELANTE DEL TODO!): Cuadrados para el fondo, rejas y ventanas
  for (let conducto of fondoConductos) {
    if (conducto.tipo === 'cuadrados_fondo') {
      dibujarElemento(conducto, escalaObj, variacionColor, volumen, modBrillo);
    }
  }
  for (let celda of celdasFrontales) {
    if (celda.tipo === 'rejas' || celda.tipo === 'ventana') {
      dibujarElemento(celda, escalaObj, variacionColor, volumen, modBrillo);
    }
  }
}

// --- CONSTRUCCIÓN DE LA INTERFAZ (GUI) ---
function crearMenuParametros() {
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
  panelUI.hide(); 

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

// --- GENERACIÓN PROCEDURAL ---
function generarNuevaObra() {
  fondoConductos = [];
  celdasFrontales = [];
  
  let paletaMezclada = shuffle(coloresBase.slice());
  let colorIndex = 0;

  let numMarcos = floor(random(2, 5)); 

  for (let i = 0; i < numMarcos; i++) {
    let w = random(500, 950); 
    let h = random(400, 750);
    let x = random(width / 2 - 150, width / 2 + 150);
    let y = random(height / 2 - 100, height / 2 + 100);
    
    let c = paletaMezclada[colorIndex % paletaMezclada.length];
    colorIndex++;
    fondoConductos.push(crearObjeto(x, y, w, h, c, 'marco', 0));
  }

  let colorDosCuad = paletaMezclada[colorIndex % paletaMezclada.length];
  colorIndex++;
  fondoConductos.push(crearObjeto(random(width/2 - 100, width/2 + 100), random(height/2 - 100, height/2 + 100), random(400, 550), random(350, 500), colorDosCuad, 'dos_cuadrados', 0));

  let numCeldas = floor(random(1, 3)); 
  
  let zonasX = [];
  if (numCeldas === 2) {
    zonasX = [random(150, 350), random(450, 650)];
  } else {
    zonasX = [random(300, 500)]; 
  }
  zonasX = shuffle(zonasX); 

  let poolRoles = ['textura', 'rejas', 'celda', 'ventana'];
  poolRoles = shuffle(poolRoles);
  
  let rolesAsignados = [];
  for(let i = 0; i < numCeldas; i++) {
    rolesAsignados.push(poolRoles[i]);
  }

  let celdaElegidaParaSuperposicion = floor(random(0, numCeldas));

  for (let i = 0; i < numCeldas; i++) {
    let wCelda = random(220, 350);
    let hCelda = random(220, 350);
    let xCelda = zonasX[i]; 
    let yCelda = random(150, height - 150);
    let tipoImagen = rolesAsignados[i]; 
    let rotacionActual = 0; 
    
    // 50% de rotación para las REJAS
    if (tipoImagen === 'rejas') {
      if (random() > 0.5) {
        rotacionActual = HALF_PI; 
      }
    }

    let c = paletaMezclada[colorIndex % paletaMezclada.length];
    colorIndex++;
    celdasFrontales.push(crearObjeto(xCelda, yCelda, wCelda, hCelda, c, tipoImagen, rotacionActual));

    if (i === celdaElegidaParaSuperposicion) {
      let colorCuadFondo = paletaMezclada[colorIndex % paletaMezclada.length];
      colorIndex++;
      
      // NUEVO: 50% de rotación para los CUADRADOS DE FONDO
      let rotacionFondo = 0;
      if (random() > 0.5) {
        rotacionFondo = HALF_PI;
      }
      
      fondoConductos.push(crearObjeto(xCelda + random(-20, 20), yCelda + random(-20, 20), wCelda * 1.1, hCelda * 1.1, colorCuadFondo, 'cuadrados_fondo', rotacionFondo));
    }
  }
}

// --- FUNCIONES AUXILIARES ---
function crearObjeto(x, y, w, h, col, tipo, rot) {
  let mov = random(['H', 'V', 'E']);
  return { x: x, y: y, w: w, h: h, col: col, tipo: tipo, rot: rot, modoMovimiento: mov };
}

function dibujarElemento(obj, escala, matizMod, volumen, brilloMod) {
  let colModificado = alterarColorHSB(obj.col, matizMod, brilloMod);
  let wEscalado = obj.w * escala;
  let hEscalado = obj.h * escala;

  let offsetX = 0;
  let offsetY = 0;

  if (!congelado && volumen > 0.08) { 
    let intensidad = map(volumen, 0.08, 1.0, 0, 40, true);
    if (obj.modoMovimiento === 'H') {
      offsetX = sin(frameCount * 0.15) * intensidad;
    } else if (obj.modoMovimiento === 'V') {
      offsetY = cos(frameCount * 0.15) * intensidad;
    }
  }

  let posXFinal = constrain(obj.x + offsetX, obj.w / 4, width - obj.w / 4);
  let posYFinal = constrain(obj.y + offsetY, obj.h / 4, height - obj.h / 4);

  push();
  translate(posXFinal, posYFinal);
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
  else if (obj.tipo === 'ventana' && imgVentana) {
    image(imgVentana, 0, 0, wEscalado, hEscalado);
  }
  else if (obj.tipo === 'dos_cuadrados' && imgDosCuadrados) {
    image(imgDosCuadrados, 0, 0, wEscalado, hEscalado);
  }
  else if (obj.tipo === 'cuadrados_fondo' && imgCuadradosFondo) {
    image(imgCuadradosFondo, 0, 0, wEscalado, hEscalado);
  }
  pop();
}

function alterarColorHSB(c, variacionMatiz, variacionBrillo) {
  colorMode(HSB, 360, 100, 100);
  let h = hue(c);
  let s = saturation(c);
  let b = brightness(c);
  
  if (s > 10) {
    h = (h + variacionMatiz + 360) % 360;
  }
  
  let nuevoB = constrain(b + variacionBrillo, 15, 95);
  
  let colFinal = color(h, s, nuevoB);
  colorMode(RGB, 255); 
  return colFinal;
}

// --- CONTROLES Y ACTIVACIÓN DEL MICRÓFONO ---
function keyPressed() {
  if (key === 'r' || key === 'R') { 
    generarNuevaObra(); 
  }
  if (key === 'd' || key === 'D') {
    congelado = !congelado;
    if (congelado) {
      mouseXCongelado = mouseX;
      mouseYCongelado = mouseY;
    }
  }
}

function mousePressed() {
  if (!inicio) {
    inicio = true;
    return;
  }

  if (getAudioContext().state !== 'running') {
    userStartAudio();
  }
}