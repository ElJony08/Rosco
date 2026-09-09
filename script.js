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
  { letra: "G", pregunta: "Empieza por G: Jon", respuesta: "gay" },
  { letra: "H", pregunta: "Empieza por H: Planta con la que se hace el aceite de oliva.", respuesta: "higuera" },
  { letra: "I", pregunta: "Contiene la I: El proceso de subir el alimento para masticarlo otra vez", respuesta: "rumiar" },
  { letra: "J", pregunta: "Empieza por J: El vigilante del armero", respuesta: "Jabalí" },
  { letra: "K", pregunta: "Contiene la K: Deporte de combate de origen japonés.", respuesta: "karate" },
  { letra: "L", pregunta: "Con la L: Quién le pidió el móvil a Markel para llamar a quién", respuesta: "Luis" },
  { letra: "M", pregunta: "Con la M: Lugar donde descubrimnos que es mejor no darte un hacha", respuesta: "Max Center" },
  { letra: "N", pregunta: "Termina en N: El examen que se le hace a un aniamal despues de morir para determinar la causa de la muerte", respuesta: "Necropsia" },
  { letra: "Ñ", pregunta: "Contiene la Ñ: Animal de granja que se usa para producir lana.", respuesta: "oveja" },
  { letra: "O", pregunta: "Con la O: Tocar tetas, pero a las vacas", respuesta: "ordeñar" },
  { letra: "P", pregunta: "Empieza por P: Es el regalo de tu cumpleaños🫢", respuesta: "madrid" },
];

let indiceActual = 0;
let aciertos = 0;
let fallos = 0;

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
// Calcula el tamaño del rosco según el ancho de pantalla,
// para que se vea bien tanto en móvil como en escritorio.
// ---------------------------------------------------------
function calcularTamanoRosco() {
  const anchoDisponible = Math.min(window.innerWidth * 0.92, 420);
  const tamano = Math.max(anchoDisponible, 260); // nunca demasiado pequeño

  const tamanoLetra = tamano < 320 ? 32 : (tamano < 380 ? 38 : 42);

  document.documentElement.style.setProperty("--rosco-size", tamano + "px");
  document.documentElement.style.setProperty("--letra-size", tamanoLetra + "px");

  return { tamano, tamanoLetra };
}

// ---------------------------------------------------------
// Genera el rosco de letras colocadas en círculo
// ---------------------------------------------------------
function generarRosco() {
  const total = preguntas.length;
  const { tamano, tamanoLetra } = calcularTamanoRosco();
  const centro = tamano / 2;
  // el radio deja hueco suficiente para que la letra no se salga del círculo
  const radio = centro - tamanoLetra / 2 - 4;

  preguntas.forEach((item, i) => {
    const angulo = (i / total) * 2 * Math.PI - Math.PI / 2; // empieza arriba
    const x = centro + radio * Math.cos(angulo);
    const y = centro + radio * Math.sin(angulo);

    const div = document.createElement("div");
    div.classList.add("letra");
    div.id = "letra-" + i;
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.textContent = item.letra;

    roscoEl.appendChild(div);
  });
}

// ---------------------------------------------------------
// Recoloca las letras si cambia el tamaño de pantalla
// (por ejemplo al girar el móvil)
// ---------------------------------------------------------
function reposicionarRosco() {
  const total = preguntas.length;
  const { tamano, tamanoLetra } = calcularTamanoRosco();
  const centro = tamano / 2;
  const radio = centro - tamanoLetra / 2 - 4;

  for (let i = 0; i < total; i++) {
    const angulo = (i / total) * 2 * Math.PI - Math.PI / 2;
    const x = centro + radio * Math.cos(angulo);
    const y = centro + radio * Math.sin(angulo);
    const el = document.getElementById("letra-" + i);
    if (el) {
      el.style.left = x + "px";
      el.style.top = y + "px";
    }
  }
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(reposicionarRosco, 150);
});

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
