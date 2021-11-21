'use strict';

const formularioJuego = document.getElementById('formularioJuego');
const parrillaJuego = document.getElementById('parrillaJuego');
const tablaResultados= document.getElementById('resultadoJuego');

const sleepMS = 100;

let juegoIniciado = false;
let listaPilotos = [];



// funcion para empezar la carrera
function empezarCarrera() {
  reiniciarCarrera(true);

  juegoIniciado = true;
  formButtonToggler();

  crearCochesParrilla();

  aCorrer();
}
// funcion que evita controversia con otros eventos
function empezarPreventDefault(e) {
  e.preventDefault();
  empezarCarrera();
}



// funcion para reiniciar la carrera
function reiniciarCarrera(reseteado = false) {
  juegoIniciado = false;
  formButtonToggler();

  
  if (reseteado) {
   eliminarCochesPista();
  } else {
    reiniciarPosiciones();
  }

  reiniciarResultadosTabla();
}
// funcion que evita controversia con otros eventos
function reiniciarPreventDefault(e) {
  e.preventDefault();
  reiniciarCarrera();
}



// Crea el circuito con los coches seleccionados

function crearCochesParrilla() {
  listaPilotos = [];

  const numeroCoches = getNumeroCoches()


  for (let index = 1; index < numeroCoches + 1; index++) {
    const imagenesCoches = `img/car${index}.png`;

    // Step 2
    listaPilotos.push({ numeroPilotoID: index, score: 0, imagenesCoches });
  }


  listaPilotos.forEach((piloto) => {
    const contenedorCoches = document.createElement('li');
    contenedorCoches.classList.add('contenedor-coches');

    const labelElement = document.createElement('label');
    labelElement.textContent = `Piloto ${piloto.numeroPilotoID}`;

    const carrilElement = document.createElement('div');
    carrilElement.id = `carril-${piloto.numeroPilotoID}`;
    carrilElement.classList.add('carril');

    const imgCocheElement = document.createElement('img');
    imgCocheElement.id = `piloto-${piloto.numeroPilotoID}`;
    imgCocheElement.classList.add('coche');
    imgCocheElement.src = piloto.imagenesCoches;
    imgCocheElement.alt = `Coche del piloto: ${piloto.numeroPilotoID}`;
    // Step 3
    imgCocheElement.style.marginLeft = '0px';

    const lineMetaElement = document.createElement('div');
    lineMetaElement.classList.add('linea-meta');

    contenedorCoches.appendChild(labelElement);

    contenedorCoches.appendChild(carrilElement);

    carrilElement.appendChild(imgCocheElement);

    contenedorCoches.appendChild(lineMetaElement);

    parrillaJuego.appendChild(contenedorCoches);
  });
}

function eliminarCochesPista() {
  parrillaJuego.innerHTML = '';
}

function reiniciarPosiciones() {
  for (const piloto of listaPilotos) {
    const pilotoElement = document.getElementById(
      `piloto-${piloto.numeroPilotoID}`
    );

    moverPilotoHacia(piloto, '0%');
  }
}

async function aCorrer() {

  let ganador = undefined;
  const puntosVencedor = getpuntosVencedor();

  ganadorLoop: while (!ganador) {
    for (const piloto of listaPilotos) {
      await sleep(sleepMS);

      const pilotoElement = document.getElementById(
        `piloto-${piloto.numeroPilotoID}`
      );

      const ventajaCoche = calcularVentaja();

      piloto.score += ventajaCoche;

      if (piloto.score > puntosVencedor) {
        piloto.score = puntosVencedor;
      }

  
      moverPilotoHacia(piloto, `${piloto.score}%`);


      if (piloto.score >= puntosVencedor) {
        ganador = piloto;
        break ganadorLoop;
      }
    }
  }

  crearTablaResultados();
}

function moverPilotoHacia(piloto, posicion) {
  const pilotoElement = document.getElementById(
    `piloto-${piloto.numeroPilotoID}`
  );

  pilotoElement.animate([{ marginLeft: posicion}], {
    duration: sleepMS,
    easing: 'ease-in-out',
    fill: 'both',
  }).onfinish = () => {
    pilotoElement.style.marginLeft = posicion;
  };
}

function crearTablaResultados() {
  tablaResultados.hidden = false;

  const pilotosOrdenadosPorPuntos = listaPilotos.sort(function (a, b) {
    return a.score - b.score;
  });
  const tabla = tablaResultados.getElementsByTagName('tbody')[0];

  for (const piloto of pilotosOrdenadosPorPuntos) {
    const columna = tabla.insertRow(0);

    const numeroPilotoTabla= columna.insertCell();
    numeroPilotoTabla.textContent = piloto.numeroPilotoID;

    const puntosPilotoTabla = columna.insertCell();
    puntosPilotoTabla.textContent = piloto.score;
  }
}

function reiniciarResultadosTabla() {
  tablaResultados.hidden = true;

  tablaResultados.getElementsByTagName('tbody')[0].innerHTML = '';
}

function formButtonToggler() {
  const gameFormSubmitButton = document.getElementById('submit-btn');
  const gameFormResetButton = document.getElementById('reset-btn');

  if (juegoIniciado) {
    gameFormSubmitButton.hidden = true;
    gameFormResetButton.hidden = false;
    return;
  }

  gameFormSubmitButton.hidden = false;
  gameFormResetButton.hidden = true;
}

function getNumeroCoches() {
  return Number(document.getElementById('numJugadoresSelect').value);
}

function getpuntosVencedor() {
  return Number(document.getElementById('puntosParaGanar').value);
}


function calcularVentaja() {
  const randomNumero_1_10 = Math.floor(Math.random() * 10) + 1;

  return randomNumero_1_10;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

formularioJuego.addEventListener('submit', empezarPreventDefault);

formularioJuego.addEventListener('reset', reiniciarPreventDefault);
