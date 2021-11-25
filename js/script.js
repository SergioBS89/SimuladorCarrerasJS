
// Variables que señalan a los principales elementos del index
const formularioJuego = document.getElementById('formularioJuego');
const parrillaJuego = document.getElementById('parrillaJuego');
const tablaResultados= document.getElementById('resultadoJuego');

formularioJuego.addEventListener('submit', empezarPreventDefault);
formularioJuego.addEventListener('reset', reiniciarPreventDefault);

let juegoIniciado = false //Indicamos que el juego no esta iniciado
let listaPilotos = [] //Array de los pilotos que correran
const tiempoDistancia = 100 // Variable que indica el valor total del recorrido de los coches

// Funcion que cambia el boton de comenzar por reiniciar
function cambioBoton() {
  const botonSubmit = document.getElementById('submit-btn');
  const botonReinicio = document.getElementById('reset-btn');

  if (juegoIniciado) {
    botonSubmit.hidden = true;
    botonReinicio.hidden = false;
    return;
  }
  botonSubmit.hidden = false;
  botonReinicio.hidden = true;
}

// Funcion que obtine los coches quer van a correr
function getNumeroCoches() {
  return Number(document.getElementById('numJugadoresSelect').value);
}

// Funcion que obtiene el valor de puntos seleccionado
function getpuntosVencedor() {
  return Number(document.getElementById('puntosParaGanar').value);
}

// Funcion que genera los carriles, los coches, la linea de meta y los nombres de cada piloto
function crearCochesParrilla() {
  listaPilotos = [];
  const numeroCoches = getNumeroCoches()
  for (let index = 1; index < numeroCoches + 1; index++) {
    const imagenesCoches = `img/car${index}.png`;
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

// Funcion que genera aleatoriamente la velocidad del coche
function velocidad() {
  const randomNumero_1_10 = Math.floor(Math.random() * 10) + 1;
  return randomNumero_1_10;
}


// Funcion que elimina todo el contenedor del circuito
function eliminarCochesPista() {
  parrillaJuego.innerHTML = '';
}

// Funcion que retorna una promesa con el tiempo de los coches
function tiempo(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Funcion que espera la promesa anterior, obtenida, se ejecutara la carrera
async function aCorrer() {

  let ganador = undefined;
  const puntosVencedor = getpuntosVencedor();
  ganadorLoop: while (!ganador) {
    for (const piloto of listaPilotos) {
      await tiempo(tiempoDistancia);
      const pilotoElement = document.getElementById(
        `piloto-${piloto.numeroPilotoID}`
      );

      const ventajaCoche = velocidad();
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

// Funcion que desplaza los coches con animate
function moverPilotoHacia(piloto, posicion) {
  const pilotoElement = document.getElementById(
    `piloto-${piloto.numeroPilotoID}`
  );

  pilotoElement.animate([{ marginLeft: posicion}], {
    duration: tiempoDistancia,
    easing: 'ease-in-out',
    fill: 'both',
  }).onfinish = () => {
    pilotoElement.style.marginLeft = posicion;
  };
}

// Funcion que genera la table de resultados
function crearTablaResultados() {
  tablaResultados.hidden = false;

   //Trofeo resultado final
 const trofeo = document.getElementById('trofeo')
 trofeo.classList.remove('hidden')

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
// Funcion para reieniciar la tabla con los resultados 
function reiniciarResultadosTabla() {
  tablaResultados.hidden = true;
  tablaResultados.getElementsByTagName('tbody')[0].innerHTML = '';
}

// funcion para empezar la carrera que llama a las diferentes funciones necesarias 
function empezarCarrera() {
  reiniciarCarrera(true)
  juegoIniciado = true
  cambioBoton() //Cambia el boton de comenzar por reiniciar
  crearCochesParrilla()
  aCorrer()
}

// funcion que evita controversia con otros eventos
function empezarPreventDefault(e) {
  e.preventDefault();
  empezarCarrera();
}


// funcion para reiniciar la carrera
function reiniciarCarrera() {
  juegoIniciado = false;
  cambioBoton();
  eliminarCochesPista()
  // trofeo de la tabla resultados, la agrego la clase hidden
  const trofeo = document.getElementById('trofeo')
  trofeo.classList.add('hidden')
  reiniciarResultadosTabla();
}

// funcion que evita controversia con otros eventos
function reiniciarPreventDefault(e) {
  e.preventDefault();
  reiniciarCarrera();
}





// Animacion inicio

let semaforo = document.getElementById('animacionSemaforo')
let botonGo = document.getElementById('botonGO')
let botonComezar = document.getElementById('botonComenzar')
let botonReiniciar = document.getElementById('reset-btn')

botonComezar.addEventListener('click',()=>{
  botonComezar.classList.add('hidden')
  semaforo.classList.remove('hiddenSemaforo')
  setTimeout(() => botonGo.classList.remove('hidden'),4000)
  setTimeout(() => semaforo.classList.add('hiddenSemaforo'),4000)
  botonGo.addEventListener('click',()=>{
    botonGo.classList.add('hidden')
  })
})
botonReiniciar.addEventListener('click',()=>{
  botonComezar.classList.remove('hidden')
})




