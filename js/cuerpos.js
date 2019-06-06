//CLASE ENCARGADA DE LOS OBJETOS DEL JUEGO (METEORITOS,COHETES,TIERRA...)

class Cuerpo {
//Constructor de objetos
  constructor(x, y, shape) { 
    this.pos = createVector(x, y);   
  }
}

class Tierra extends Cuerpo {
  constructor(x, y, r){
    super(x, y);
    this.radio = r;
  }
  dibujar() {
    circle(this.pos.x, this.pos.y, this.radio);
  }
}

class Meteorito extends Cuerpo {

  constructor(x, y, r){
    super(x, y);
    this.radio = r;
    this.vel = createVector(0, 5);
  }
  dibujar() {
    circle(this.pos.x, this.pos.y, this.radio);
  }

  actualizar() {
    this.pos.add(this.vel);
  }
}



class Cohete extends Cuerpo {
  constructor(x, y){
    super(x, y);

    this.velCohete = 10;
    this.dim = createVector(10, 30);
  }

  dibujar(angle) {
    push();
    fill(255);
    translate(this.pos.x, this.pos.y);
    rotate(angle-HALF_PI);
    rect(0, 0, this.dim.x, this.dim.y);
    pop();
  }

  actualizar(angle) {      
    this.vel = createVector(cos(angle)*this.velCohete, sin(angle)*this.velCohete);
    this.pos.add(this.vel);
  }  
}


class Particula extends Cuerpo {
  constructor(x, y, velX, velY, lifeSpan) {
    super(x, y);

    this.lifeSpan = lifeSpan;

    this.vel = createVector(velX, velY);
    this.radio = 3;
  }

  dibujar() {
    ellipse(this.pos.x, this.pos.y, this.radio, this.radio);
  }

  actualizar() {
    this.lifeSpan--;
    this.pos.add(this.vel);
  }  
}