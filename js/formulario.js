var dificultadMinima = 20000;
var dificultadMaxima = 1000;

$(document).ready(function() {
  $("#formulario").submit(function(event) {
    event.preventDefault();
    var dificultadInput = this.Dificultad.value/100; //Para que este entre 0 y 1;
    var dificultad = dificultadMinima-(dificultadInput)*(dificultadMinima-dificultadMaxima);

    var nombre = this.Nombre.value;
    var puntosMax = this.Puntos.value;

    $(this).parent().fadeOut("slow", function(){
      empezarJuego(nombre, dificultad, puntosMax);
    });
  })
});