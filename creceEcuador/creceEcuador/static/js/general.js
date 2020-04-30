


$(".crece-menu-toogle").click(function(){
  var x = document.getElementById("crece-header-id");
   if (x.className === "container crece-header-contenido") {
      x.className += " mobile";
    } else {
      x.className = "container crece-header-contenido";
    }
});

$("button").click(function(){
  var solicitar = $("#crece-solicitar-id");
  var invertir = $("#crece-invertir-id");
  if(this.className == "btn crece-invertir-button"){
    solicitar.hide();
    invertir.css("display","flex");
    $(".crece-solicitar-button").removeClass("crece-solicitar-invertir-elegido");
    $(".crece-invertir-button").addClass("crece-solicitar-invertir-elegido");

  }
  else{
    solicitar.css("display","flex");
    invertir.hide();
    $(".crece-solicitar-button").addClass("crece-solicitar-invertir-elegido");
    $(".crece-invertir-button").removeClass("crece-solicitar-invertir-elegido");
  }
});


$(document).ready(function(){
      
  cargar_carrusel();
  cargar_operaciones();
   
  
});

function cargar_carrusel(){
  var celular = window.matchMedia("(max-width: 600px)")

  if(celular.matches){
    $(".crece-carrusel-imagenes-movil").slick({
      speed: 500,
      focusOnSelect: true,
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,


    });
  }
  else{
    $(".crece-carrusel-imagenes").slick({
      speed: 500,
      focusOnSelect: true,
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,

      // the magic
        responsive: [{
            breakpoint: 600,
            settings: "unslick" // destroys slick

          }]

    });
  }
}

function cargar_operaciones() {
   // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    // Setup our listener to process completed requests
    xhr.onload = function () {

      // Process our return data
      if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        var data = JSON.parse(xhr.responseText);
        //construir_operaciones(data)
        
      } else {
        // What do when the request fails
        console.log('The request failed!');
      }
      
    };
    xhr.open('GET', 'http://localhost:8000/solicitudes/');
    xhr.send();
}

/*
function construir_operaciones(data) {
  var operaciones = data.data;
  //var contenido_operaciones = document.getElementById("crece-operaciones-contenido")
  var row =  contenido_operaciones.children[0];


  for (var i = operaciones.length - 1; i >= 0; i--) {
    operacion = operaciones[i];
    card = document.createElement("div");
    card.setAttribute("class", "card");
    col = document.createElement("div");
    col.setAttribute("class", "col-xl-6");
    col.appendChild(card);
    img = document.createElement("img");
    img.setAttribute("src",operacion.imagen_url);
    card.appendChild(img);
    card.setAttribute("id", operacion.id)
    llenar_tarjeta(card, operacion);
    row.appendChild(col);
  }

}

function llenar_tarjeta(card, operacion){
  var body = document.createElement("div");
  body.setAttribute("class", "card-body");
  card.appendChild(body);

  var autor = document.createElement("h4");
  autor.setAttribute("class","card-title");
  autor.innerHTML = operacion.autor;
  body.appendChild(autor);

  var tipo_persona = document.createElement("p");
  tipo_persona.innerHTML = "Persona natural";

  body.appendChild(tipo_persona);
}*/