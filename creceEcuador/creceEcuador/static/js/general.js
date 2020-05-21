
let RUTA_SOLICITUDES = "/solicitudes/"
let RUTA_DETALLE_SOLICITUD ="/detalle_solicitud/"
let indice_opcion_actual = 0;
let CANTIDAD_OPCIONES_MOSTRADAS = 3;


const color_calculadora_inversionista = "#08A7BA"
const color_calculadora_solicitante = "#006B8D"



$(".crece-menu-toogle").click(function(){
  var x = document.getElementById("crece-header-id");
   if (x.className === "container crece-header-contenido") {
      x.className += " mobile";
    } else {
      x.className = "container crece-header-contenido";
    }
});


$("div.crece-solicitar-invertir button").click(function(){
  var solicitar = $("#crece-solicitar-id");
  var invertir = $("#crece-invertir-id");
  let section = document.getElementById("crece-solicitante-inversionista-id");


  if(this.className == "btn crece-invertir-button"){
    solicitar.hide();
    invertir.css("display","flex");
    $(".crece-solicitar-button").removeClass("crece-solicitar-invertir-elegido");
    $(".crece-invertir-button").addClass("crece-solicitar-invertir-elegido");

    section.style.backgroundColor = color_calculadora_solicitante
  }
  else{
    solicitar.css("display","flex");
    invertir.hide();
    $(".crece-solicitar-button").addClass("crece-solicitar-invertir-elegido");
    $(".crece-invertir-button").removeClass("crece-solicitar-invertir-elegido");

    section.style.backgroundColor = color_calculadora_inversionista
  }
});


$(document).ready(function(){
      
  cargar_carrusel();
  obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
  
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
      autoplay: true,
      autoplaySpeed: 5000,
      fade: true,


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
      autoplay: true,
      autoplaySpeed: 5000,
      fade: true,

      // the magic
        responsive: [{
            breakpoint: 600,
            settings: "unslick" // destroys slick

          }]

    });
  }
}


function obtenerOportunidadesInversion(inicio, cantidad_opciones){
  var querystring = "?inicio="+inicio +"&cantidad="+ cantidad_opciones;
  $.ajax({
      url: RUTA_SOLICITUDES+querystring,
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          if (res.data.length > 0){
              indice_opcion_actual += cantidad_opciones
              crearCuadrosOportunidadesInversion(res.data);
          }  
      }
  });
}

function crearCuadrosOportunidadesInversion(data){
  let string_operacion = "";

  $.each( data, function( indice, oportunidad ) {
      string_operacion += stringSolicitud(oportunidad);
  });

  $(".crece-oportunidades-container").html(string_operacion);
  let links = $(".crece-oportunidades-contenido-solicitante-link");
  $(".crece-oportunidades-contenido-solicitante-link").remove();
  $(".crece-oportunidades-contenido-solicitante p").each( function(numSolicitante) {
    var lines = lineWrapDetector.getLines(this);
    let stringParrafo = "";
    $.each(lines, function(numLinea, linea) {
      if(numLinea<3){
        $.each(linea, function(numPalabra, palabra) {
          if (numLinea != 2 || numPalabra != linea.length -1){
            stringParrafo += palabra.innerText+ " ";
          }
        });
      }
      else {
        return false;
      }
    });

    let linkSolicitante = links[numSolicitante].outerHTML
    this.innerHTML = stringParrafo.slice(0,-1) + linkSolicitante;
  });

}

function decimalAPorcentaje(decimal){
  return decimal.split(".")[1];
}

function decimalAEntero(decimal){
  return decimal.split(".")[0];
}

function rutaDetalleSolicitud(id){
  return RUTA_DETALLE_SOLICITUD+"?id="+id;
}

function calcularPorcentajeFinanciado(monto, porcentaje_financiado){
  total_financiado = parseFloat(monto)*(parseFloat(porcentaje_financiado)/100);
  return Math.round( total_financiado );
}

function numeroConComas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function stringSolicitud(oportunidad){

  var tarjeta_oportunidad = '<div class="col-xl-4 col-lg-6 col-12">'+
  '                                    <div class="row justify-content-center">'+
  '                                        <div class="crece-oportunidades-contenedor">'+
  '                                            <div class="col-12 crece-oportunidades-imagen" style="background-image: url(\' '+oportunidad.imagen_url+ '\');">'+
  '                                                <div class="crece-oportunidades-imagen-gradiente">'+
  '                                                    <div class="crece-oportunidades-imagen-gradiente-texto">'+
  '                                                        <span>'+ oportunidad.tipo_credito +'</span>'+
  '                                                        <strong>'+ oportunidad.autor +'</strong>'+
  '                                                        <strong>'+oportunidad.tipo_persona+'</strong>'+
  '                                                        <span>ID: '+oportunidad.id+'</span>'+
  '                                                    </div>'+
  '                                                </div>'+
  '                                            </div>'+
  '            '+
  '                                            <div class="col-12">'+
  '                                                <div class="crece-oportunidades-contenido">'+
  '                                                    <div class="col-12 crece-oportunidades-contenido-monto">'+
  '                                                        <div class="col-12 crece-oportunidades-contenido-monto-texto">'+
  '                                                            <p>'+
  '                                                                <strong>$'+numeroConComas(decimalAEntero(oportunidad.monto))+'</strong><br>'+
  '                                                                $'+numeroConComas(calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado))+' ('+oportunidad.porcentaje_financiado+'%) recolectados'+
  '                                                            </p>'+
  '                                                            '+
  '                                                            <span></span>'+
  '                                                        </div>'+
  '                                                        <div class="col-12 crece-oportunidades-contenido-monto-barra">'+
  '                                                            <div style="width:'+oportunidad.porcentaje_financiado+'%;" class="crece-oportunidades-contenido-monto-barra-progreso">'+
  '            '+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-informacion">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col">'+
  '                                                                <p>'+
  '                                                                    <strong>Plazo</strong><br>'+
  '                                                                    '+oportunidad.plazo+' Días'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col">'+
  '                                                                <p>'+
  '                                                                    <strong>Industria</strong><br>'
                                                                          +oportunidad.categoria+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col">'+
  '                                                                <p>'+
  '                                                                    <strong>Tasa(TIR)</strong><br>'+
  '                                                                    '+ oportunidad.tir+'%'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-solicitante">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-12">'+
  '                                                                <strong>'+ oportunidad.autor+' en CRECE</strong>'+
  '                                                            </div>'+
  '                                                            <div class="col-12">'+
  '                                                                <p>'+
                                                                      oportunidad.historia+
  '                                                                </p><a class="crece-oportunidades-contenido-solicitante-link" href="'+rutaDetalleSolicitud(oportunidad.id)+'">...</a>'+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-historial">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Pagados</strong><br>'+
  '                                                                    2/3'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col-4 crece-oportunidades-contenido-historial-centro">'+
  '                                                                <p>'+
  '                                                                    <strong>Puntualidad</strong><br>'+
  '                                                                    95%'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Vigentes</strong><br>'+
  '                                                                    1/3'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-botones">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-blanco">'+
  '                                                                <a href="'+rutaDetalleSolicitud(oportunidad.id)+'">Ver más</a>'+
  '                                                            </div>'+
  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+
  '                                                                <a href="#">Invertir</a>'+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                </div>'+
  '            '+
  '                                            </div>'+
  '                                        </div>'+
  '                                    </div>'+
  '                                    '+
  '                                </div>';

  return tarjeta_oportunidad;

}
