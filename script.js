// ---------------------------------------------------------
// Preguntas del rosco (letra, pregunta, respuesta correcta)
// ---------------------------------------------------------
const preguntas = [
  { letra: "A", pregunta: "Con la A: Órgano que bombea la sangre por el cuerpo.", respuesta: "arteria" },
  { letra: "B", pregunta: "Empieza por B: Instrumento musical de viento, de madera y con llaves.", respuesta: "clarinete" },
  { letra: "B", pregunta: "Con la B: Recipiente pequeño donde se guardan joyas.", respuesta: "bandeja" },
  { letra: "C", pregunta: "Empieza por C: Capital de Francia.", respuesta: "paris" },
  { letra: "D", pregunta: "Con la D: Figura geométrica de cuatro lados iguales y ángulos rectos.", respuesta: "diamante" },
  { letra: "E", pregunta: "Empieza por E: Estrella alrededor de la cual gira la Tierra.", respuesta: "estrella" },
  { letra: "F", pregunta: "Contiene la F: Aparato que sirve para conservar alimentos fríos.", respuesta: "frigorifico" },
  { letra: "G", pregunta: "Empieza por G: Ave de corral que da huevos.", respuesta: "gallina" },
  { letra: "H", pregunta: "Empieza por H: Planta con la que se hace el aceite de oliva.", respuesta: "higuera" },
  { letra: "I", pregunta: "Contiene la I: Piedra preciosa transparente formada por carbono puro.", respuesta: "diamante" },
  { letra: "J", pregunta: "Empieza por J: Prenda de vestir de tela vaquera.", respuesta: "jeans" },
  { letra: "K", pregunta: "Contiene la K: Deporte de combate de origen japonés.", respuesta: "karate" },
  { letra: "L", pregunta: "Empieza por L: Satélite natural de la Tierra.", respuesta: "luna" },
  { letra: "M", pregunta: "Empieza por M: Rey de la selva.", respuesta: "leon" },
  { letra: "N", pregunta: "Termina en N: Estación del año más fría.", respuesta: "invierno" },
  { letra: "Ñ", pregunta: "Contiene la Ñ: Animal de granja que se usa para producir lana.", respuesta: "oveja" },
  { letra: "O", pregunta: "Empieza por O: Fruto amarillo y curvado, alimento preferido de los monos.", respuesta: "platano" },
  { letra: "P", pregunta: "Empieza por P: Capital de España.", respuesta: "madrid" },
  { letra: "Q", pregunta: "Contiene la Q: Producto lácteo elaborado a partir de leche cuajada.", respuesta: "queso" },
  { letra: "R", pregunta: "Empieza por R: Fenómeno óptico y meteorológico con forma de arco de colores.", respuesta: "arcoiris" },
  { letra: "S", pregunta: "Empieza por S: Estrella que ilumina la Tierra de día.", respuesta: "sol" },
  { letra: "T", pregunta: "Empieza por T: Aparato electrónico para ver programas y películas.", respuesta: "televisor" },
  { letra: "U", pregunta: "Contiene la U: Conjunto de todo lo que existe, planetas, estrellas y galaxias.", respuesta: "universo" },
  { letra: "V", pregunta: "Empieza por V: Medio de transporte con dos ruedas que se mueve pedaleando.", respuesta: "bicicleta" },
  { letra: "W", pregunta: "Contiene la W: Red informática mundial, se abrevia WWW.", respuesta: "web" },
  { letra: "X", pregunta: "Contiene la X: Instrumento musical de percusión con láminas de madera.", respuesta: "xilofono" },
  { letra: "Y", pregunta: "Contiene la Y: Metal precioso de color amarillo.", respuesta: "oro" },
  { letra: "Z", pregunta: "Empieza por Z: Lugar donde se exhiben animales para el público.", respuesta: "zoo" }
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
