// ---------------------------------------------------------
// Preguntas del rosco (letra, pregunta, respuesta correcta)
// ---------------------------------------------------------
const preguntas = [
  { letra: "A", pregunta: "Con la A: Voz que puso Beñat en Calpe", respuesta: "Anas" },
  { letra: "B", pregunta: "Con la B: La distancia nos puede separar de un abrazo, pero no de un...", respuesta: "bizum" },
  { letra: "C", pregunta: "Con la C: Donde te encanta meter el brazo", respuesta: "culo" },
  { letra: "D", pregunta: "Con la D: En qué juego no le tenías fe a Markel y él lo consiguió", respuesta: "Dardos" },
  { letra: "E", pregunta: "Con la E: la mujer más facha de todo Torrevieja, su toalla es prueba de ello", respuesta: "Encarna" },
  { letra: "F", pregunta: "Con la F: Comido que descubrió Endika por nosotros", respuesta: "Fideuá" },
  { letra: "G", pregunta: "Con la G: Jon", respuesta: "gay" },
  { letra: "H", pregunta: "Contiene la H: A Markel y a ti se os quedaba pegada en Torrevieja, a veces demasiado", respuesta: "almohada" },
  { letra: "I", pregunta: "Contiene la I: El proceso de subir el alimento para masticarlo otra vez", respuesta: "rumiar" },
  { letra: "J", pregunta: "Con la J: El vigilante del armero", respuesta: "Jabalí" },
  { letra: "K", pregunta: "Con la K: No sabemos cómo haces para quedar siempre arriba en el", respuesta: "ranking" },
  { letra: "L", pregunta: "Con la L: Quién le pidió el móvil a Markel para llamar a quién", respuesta: "Luis" },
  { letra: "M", pregunta: "Con la M: Lugar donde descubrimnos que es mejor no darte un hacha", respuesta: "Max Center" },
  { letra: "N", pregunta: "Con la N: El examen que se le hace a un aniamal despues de morir para determinar la causa de la muerte", respuesta: "Necropsia" },
  { letra: "Ñ", pregunta: "Contiene la Ñ: Tocar tetas, pero a las vacas", respuesta: "ordeñar" },
  { letra: "O", pregunta: "Con la O: Por lo que pareces de otra raza", respuesta: "ojos" },
  { letra: "P", pregunta: "Con la P: Es el regalo de tu cumpleaños🫢", respuesta: "madrid" },
  { letra: "Q", pregunta: "Con la Q: Producto lácteo elaborado a partir de leche cuajada", respuesta: "queso" },
  { letra: "R", pregunta: "Con la R: Flor de tallo con espinas, símbolo del amor", respuesta: "rosa" },
  { letra: "S", pregunta: "Con la S: Estrella que nos ilumina de día", respuesta: "sol" },
  { letra: "T", pregunta: "Con la T: Aparato electrónico para ver programas y películas", respuesta: "televisor" },
  { letra: "U", pregunta: "Con la U: Conjunto de todo lo que existe: planetas, estrellas y galaxias", respuesta: "universo" },
  { letra: "V", pregunta: "Con la V: Animal doméstico que da leche y hace 'muu'", respuesta: "vaca" },
  { letra: "W", pregunta: "Contiene la W: Red informática mundial, se abrevia WWW", respuesta: "web" },
  { letra: "X", pregunta: "Con la X: Instrumento musical de percusión con láminas de madera", respuesta: "xilofono" },
  { letra: "Y", pregunta: "Contiene la Y: Alimento lácteo fermentado que se suele desayunar", respuesta: "yogur" },
  { letra: "Z", pregunta: "Con la Z: Lugar donde se exhiben animales para el público", respuesta: "zoo" },
];

let indiceActual = 0;
let aciertos = 0;
let fallos = 0;
let temporizadorRevelacion = null;

const roscoEl = document.getElementById("rosco");
const preguntaEl = document.getElementById("pregunta");
const respuestaEl = document.getElementById("respuesta");
const comprobarBtn = document.getElementById("comprobar");
const mensajeEl = document.getElementById("mensaje");
const aciertosEl = document.getElementById("aciertos");
const fallosEl = document.getElementById("fallos");
const pantallaFinal = document.getElementById("pantallaFinal");
const resultadoFinalEl = document.getElementById("resultadoFinal");
const reiniciarBtn = document.getElementById("reiniciar");

// ---------------------------------------------------------
// Normaliza texto: minúsculas y sin tildes (la Ñ se respeta)
// ---------------------------------------------------------
function normalizar(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos
}

// ---------------------------------------------------------
// Genera el rosco de letras colocadas en círculo.
// Las posiciones se calculan en PORCENTAJE del contenedor,
// no en píxeles fijos, así el círculo se adapta solo a
// cualquier tamaño de pantalla (móvil incluido).
// ---------------------------------------------------------
function generarRosco() {
  const total = preguntas.length;
  const centro = 50; // % del contenedor
  const radio = 43;  // % — deja margen para que la letra no se salga

  preguntas.forEach((item, i) => {
    const angulo = (i / total) * 2 * Math.PI - Math.PI / 2; // empieza arriba
    const x = centro + radio * Math.cos(angulo);
    const y = centro + radio * Math.sin(angulo);

    const div = document.createElement("div");
    div.classList.add("letra");
    div.id = "letra-" + i;
    div.style.left = x + "%";
    div.style.top = y + "%";
    div.textContent = item.letra;

    roscoEl.appendChild(div);
  });
}

// ---------------------------------------------------------
// Marca visualmente la letra actual
// ---------------------------------------------------------
function actualizarLetraActual() {
  document.querySelectorAll(".letra").forEach(el => el.classList.remove("actual"));
  const actual = document.getElementById("letra-" + indiceActual);
  if (actual) actual.classList.add("actual");
}

// ---------------------------------------------------------
// Muestra la pregunta actual
// ---------------------------------------------------------
function mostrarPregunta() {
  preguntaEl.textContent = preguntas[indiceActual].pregunta;
  respuestaEl.value = "";
  mensajeEl.textContent = "";
  mensajeEl.className = "mensaje";
  actualizarLetraActual();
  respuestaEl.focus();

  // La revelación va ligada SIEMPRE a la letra P (no a la última
  // pregunta del rosco), así el jugador no se lo espera aunque
  // el rosco completo llegue hasta la Z.
  const esLaP = preguntas[indiceActual].letra === "P";
  if (esLaP) {
    programarRevelacion();
  }
}

// ---------------------------------------------------------
// Programa (o reprograma) el difuminado a los 5 segundos
// ---------------------------------------------------------
function programarRevelacion() {
  cancelarRevelacion();
  temporizadorRevelacion = setTimeout(() => {
    document.body.classList.add("difuminado");
  }, 5000);
}

function cancelarRevelacion() {
  if (temporizadorRevelacion) {
    clearTimeout(temporizadorRevelacion);
    temporizadorRevelacion = null;
  }
  document.body.classList.remove("difuminado");
}

// ---------------------------------------------------------
// Avanza a la siguiente pregunta pendiente (no acertada)
// ---------------------------------------------------------
function siguientePregunta() {
  const total = preguntas.length;

  // Si ya se han acertado todas, se termina el juego
  if (aciertos >= total) {
    finalizarJuego();
    return;
  }

  let siguiente = (indiceActual + 1) % total;
  while (document.getElementById("letra-" + siguiente).classList.contains("correcta")) {
    siguiente = (siguiente + 1) % total;
  }

  indiceActual = siguiente;
  mostrarPregunta();
}

// ---------------------------------------------------------
// Comprueba la respuesta introducida
// ---------------------------------------------------------
function comprobarRespuesta() {
  const respuestaUsuario = normalizar(respuestaEl.value);
  const respuestaCorrecta = normalizar(preguntas[indiceActual].respuesta);
  const letraActualEl = document.getElementById("letra-" + indiceActual);

  if (respuestaUsuario.length === 0) {
    return;
  }

  if (respuestaUsuario === respuestaCorrecta) {
    // Acierto: la letra se pone en verde y se avanza
    aciertos++;
    letraActualEl.classList.add("correcta");
    mensajeEl.textContent = "¡Correcto!";
    mensajeEl.classList.add("correcto");
    actualizarMarcador();

    setTimeout(() => {
      siguientePregunta();
    }, 500);

  } else {
    // Fallo: se queda en la misma pregunta, no avanza
    fallos++;
    mensajeEl.textContent = "Respuesta incorrecta, inténtalo de nuevo.";
    mensajeEl.classList.add("incorrecto");
    actualizarMarcador();

    letraActualEl.classList.add("fallo-temporal");
    setTimeout(() => letraActualEl.classList.remove("fallo-temporal"), 350);

    respuestaEl.value = "";
    respuestaEl.focus();
  }
}

function actualizarMarcador() {
  aciertosEl.textContent = "Aciertos: " + aciertos;
  fallosEl.textContent = "Fallos: " + fallos;
}

// ---------------------------------------------------------
// Pantalla final
// ---------------------------------------------------------
function finalizarJuego() {
  resultadoFinalEl.textContent =
    "Has completado el rosco con " + aciertos + " aciertos y " + fallos + " fallos.";
  pantallaFinal.classList.remove("oculto");
}

function reiniciarJuego() {
  indiceActual = 0;
  aciertos = 0;
  fallos = 0;
  actualizarMarcador();
  document.querySelectorAll(".letra").forEach(el => el.classList.remove("correcta", "actual"));
  pantallaFinal.classList.add("oculto");
  cancelarRevelacion();
  mostrarPregunta();
}

// ---------------------------------------------------------
// Eventos
// ---------------------------------------------------------
comprobarBtn.addEventListener("click", comprobarRespuesta);

respuestaEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    comprobarRespuesta();
  }
});

reiniciarBtn.addEventListener("click", reiniciarJuego);

// ---------------------------------------------------------
// Inicio del juego
// ---------------------------------------------------------
generarRosco();
mostrarPregunta();
