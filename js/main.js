//FUNCIONES DE P5
//Atributos
const WIDTH = 1200, HEIGHT = 900;
var meteoritos = [];
var particulas = [];
const anchoTierra = 200;
var tierra;
var countMeteoritos = 0;
var puntuacion = 0;
var cohete;
var dificultad, nombre, puntosMaximos;

var juegoEmpezado = false;
//Se crea el canvas y se establecen los valores del juego
function setup() { 
  noStroke();
  tierra = new Tierra(WIDTH/2, HEIGHT+WIDTH-anchoTierra, WIDTH*2);
}

function empezarJuego(name, dif, puntosMax) {
  canvas=createCanvas(WIDTH, HEIGHT);
  canvas.parent('contenedor');
  background(0, 0, 25);

  nombre = name;
  dificultad = dif;
  puntosMaximos = puntosMax;
  juegoEmpezado = true;
}

//Funcion que se encarga de dibujar los elementos y las particulas
function draw() {
  if(juegoEmpezado) {
    background(0, 0, 25);
    textSize(26);
    fill(255);

    textAlign(LEFT);
    text(`Puntuación: ${puntuacion}`, 20, 40);
    textAlign(RIGHT);
    text(nombre, width - 20, 40);

    tierra.dibujar();
    comprobarChoque();

    crearMeteoritos();
    dibujarMeteoritos(); 

    dibujarCohete();

    dibujarParticulas();

    comprobarVictoria();
  }
  
}

//FUNCIONES DEL JUEGO
function comprobarVictoria() {
  if(puntuacion >= puntosMaximos){
    ganar();
  }
}
function ganar() {
  juegoEmpezado = false;
  puntuacion = 0;
  background(0, 0, 25);
  textAlign(CENTER);
  textSize(40);
  text("Has ganado!", WIDTH/2, HEIGHT/2);
}

function crearMeteoritos() {
  var aparicion = dificultad/frameCount + 20; //20: Minimo tiempo de aparición, dificultad: Lo que tarda en llegar a ese tiempo
  if(countMeteoritos >= aparicion) {
    meteoritos.push(new Meteorito(random(20, WIDTH-20), -20, random(30, 80)));
    countMeteoritos = 0;
  }
  countMeteoritos++;
}

function dibujarMeteoritos() {
  meteoritos.forEach( (item, key) => {
    item.actualizar();
    item.dibujar();

    if(item.pos.y > HEIGHT) {
      meteoritos.splice(key, 1);
    }
  })
}

function dibujarCohete() {
  if(cohete){
    var angle = atan2(mouseY - cohete.pos.y, mouseX - cohete.pos.x);
    cohete.actualizar(angle);
    cohete.dibujar(angle);
    for(var i = 0; i < random(5, 20); i++){
      let x = random(cohete.pos.x + sin(angle), cohete.pos.x + cohete.dim.x*sin(angle) + sin(angle));
      let y = random(cohete.pos.y + cos(angle), cohete.pos.y - cohete.dim.x*cos(angle) + cos(angle));

      let dispersion = 2.5;

      let velX = random(-0.05*cohete.vel.x-dispersion*sin(angle),-0.05*cohete.vel.x+dispersion*sin(angle));
      let velY = random(-0.05*cohete.vel.y-dispersion*cos(angle),-0.05*cohete.vel.y+dispersion*cos(angle));

      let lifeSpan = floor(random(14, 30));

      particulas.push(new Particula(x, y, velX, velY, lifeSpan));
    }
    if(abs(cohete.pos.x - mouseX) < 5 && abs(cohete.pos.y - mouseY) < 5) {
      explotarCohete();
      cohete = null;
      
    }
  }
}

function dibujarParticulas() {
  particulas.forEach( (item, key) => {
    item.actualizar();
    if(item.lifeSpan == 0){
      particulas.splice(key, 1);
    } else {
      item.dibujar();
    } 
  })
}

function mouseClicked() {
  if(cohete){
    explotarCohete();
  }
  var angle = atan2(mouseY - tierra.pos.y, mouseX - tierra.pos.x);
  var angleSin = map(sin(angle), -0.93, -1, -0.96, -1);

  cohete = new Cohete(mouseX, (HEIGHT-anchoTierra)+tierra.radio*(1+angleSin));
}

function comprobarChoque(){
  meteoritos.forEach((item) => {
    if(cohete && abs(item.pos.x - cohete.pos.x) < item.radio && abs(item.pos.y - cohete.pos.y) < item.radio){
      cambiarPuntuacion(1);
      explotar(item, true);
    }
    if(item && tierra.pos.dist(item.pos) < tierra.radio/2 + item.radio/3 ){
      cambiarPuntuacion(-1);
      explotar(item);
    }
  })
  if(cohete){
    
    var angle = atan2(cohete.pos.y - tierra.pos.y, cohete.pos.x - tierra.pos.x);
    var angleSin = map(sin(angle), -0.85, -1, -0.999, -1);
    if(tierra.pos.dist(cohete.pos) < tierra.radio/2-tierra.radio*(1+angleSin)){
      
      explotarCohete();
    }
  }
}
function explotar(meteoritoQueExplota, explotarTarget = false){
  posExpX = (meteoritoQueExplota.pos.x + meteoritoQueExplota.radio/2)
  posExpY = (meteoritoQueExplota.pos.y + meteoritoQueExplota.radio/2)
  for (let j = 0; j < 150; j++) {
    let lifeSpan = floor(random(14, 30));
    let anguloExp = random(0,TWO_PI);
    let velX = random(10,15)*sin(anguloExp);
    let velY = random(10,15)*cos(anguloExp);
    particulas.push(new Particula(posExpX, posExpY, velX, velY, lifeSpan));
  }
  var pos = meteoritos.indexOf(meteoritoQueExplota);
  meteoritos.splice(pos,1);
  if(explotarTarget){
    cohete = null;
  }
  
}

function explotarCohete(){
  posExpX = cohete.pos.x;
  posExpY = cohete.pos.y;
  for (let j = 0; j < 100; j++) {
    let lifeSpan = floor(random(5, 20));
    let anguloExp = random(0,TWO_PI);
    let velX = random(10,15)*sin(anguloExp);
    let velY = random(10,15)*cos(anguloExp);
    particulas.push(new Particula(posExpX, posExpY, velX, velY, lifeSpan));
  }
  cohete = null;
}


function cambiarPuntuacion(valor) {
  puntuacion = puntuacion+valor >= 0 ? puntuacion+valor : 0;
}
