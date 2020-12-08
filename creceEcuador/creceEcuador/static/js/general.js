
let RUTA_SOLICITUDES = "/solicitudes/"
let RUTA_DETALLE_SOLICITUD ="/invertir/detalle/"
let indice_opcion_actual = 0;
let CANTIDAD_OPCIONES_MOSTRADAS = 3;


const color_calculadora_inversionista = "#08A7BA";
const color_calculadora_solicitante = "#006B8D";


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

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $(window).on('resize orientationchange', function() {
    resize_carrusel();
  });
      
  cargar_carrusel();
  obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
  $.each( $('*'), function() { 
    if( $(this).width() > $('body').width()) {

    } 
  });
  
});

function resize_carrusel() {
  
  if($(".crece-carrusel-imagenes").hasClass('slick-initialized')){
    $(".crece-carrusel-imagenes").slick('unslick');
  }

  if($(".crece-carrusel-imagenes-movil").hasClass('slick-initialized')){
    $(".crece-carrusel-imagenes-movil").slick('unslick');
  }

  cargar_carrusel()
}
function cargar_carrusel(){
  var celular = window.matchMedia("(max-width: 600px)");

  if(celular.matches){
    $(".crece-carrusel-imagenes-movil").slick({
      speed: 500,
      focusOnSelect: true,
      dots: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
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
      autoplaySpeed: 3000,
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

function setearTooltipsSugerenciaCompartir(){
  let options = {delay : {show:0, hide: 2000},
							trigger: "manual"
              }
              

  $('.copyImage').each(function(){
    $(this).tooltip(options);

    $(this).hover(function (){
      showTooltipCompartir(this);
      console.log("hovering");
    });

  });

}

function showTooltipCompartir(element){
  var $el = $(element);
  $el.tooltip("show");

  setTimeout(function() {
    $el.tooltip("hide")
  }, 1500);
}

function crearCuadrosOportunidadesInversion(data){
  let string_operacion = "";

  $.each( data, function( indice, oportunidad ) {
      string_operacion += stringSolicitud(oportunidad);
  });

  $(".crece-oportunidades-container").html(string_operacion);
  setearTooltipsSugerenciaCompartir();
  let links = $(".crece-oportunidades-contenido-solicitante-link");
  $(".crece-oportunidades-contenido-solicitante-link").remove();
  $(".crece-historia-container *:not(:first-child)").remove();
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


  //Agregar elipsis en Titulo de historia
  $(".crece-oportunidades-contenido-solicitante strong").each( function(numSolicitante) {
    var lines = lineWrapDetector.getLines(this);
    let stringParrafo = "";
    $.each(lines, function(numLinea, linea) {
      if(numLinea<1){
        $.each(linea, function(numPalabra, palabra) {
          stringParrafo += palabra.innerText+ " ";
        });
      }
      else {
        return false;
      }
    });

    if(lines.length > 1){
      let linkSolicitante = links[numSolicitante].outerHTML
      this.innerHTML = stringParrafo.slice(0,-5) + linkSolicitante;
    }
    else{
      this.innerHTML = stringParrafo;
    }
    
  });

  //Agregar elipsis en industria
  $(".crece-oportunidades-contenido-informacion-industria p").each( function(numSolicitante) {
    var lines = lineWrapDetector.getLines(this);
    let stringParrafo = "";

    $.each(lines, function(numLinea, linea) {
      if(numLinea<2){
        //Agregar los tags strong y br al título
        if(numLinea == 0){
          stringParrafo += "<strong>";
          $.each(linea, function(numPalabra, palabra) {
            stringParrafo += palabra.innerText+ " ";
          });
          stringParrafo += "</strong><br>";
        }
        else {
          $.each(linea, function(numPalabra, palabra) {
            let palabraSubstr = "";
            if(palabra.innerText.length > 9){
              palabraSubstr = palabra.innerText.substring(0,9);
              let linkSolicitante = links[numSolicitante].outerHTML;
              palabraSubstr += linkSolicitante;
            }
            else {
              palabraSubstr = palabra.innerText;
            }
            
            stringParrafo += palabraSubstr
          });
        }
      }
      else {
        return false;
      }
    });

    this.innerHTML = stringParrafo;
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
  '                                            <div class="col-12 crece-oportunidades-imagen" style="background-image: url(\' /'+oportunidad.imagen_url+ '\');">'+
  '                                                <div class="crece-oportunidades-imagen-gradiente">'+
  '                                                    <div class="crece-oportunidades-imagen-gradiente-texto">'+
  '                                                        <span>'+ oportunidad.tipo_credito +' <i class="fa fa-question-circle tooltipTipo_cred" aria-hidden="true"><span class="tooltiptextTipo_cred">Uso que se le dará al capital. Existen tres tipos:<br>-Capital de trabajo<br>-Compra de activo<br>-Adelanto de factura</span></i></span>'+
  '                                                        <strong>'+ oportunidad.autor +'</strong>'+
  '                                                        <strong>'+oportunidad.tipo_persona+'</strong>'+
  '                                                        <span>'+ oportunidad.ticket +' <i class="fa fa-question-circle" aria-hidden="true"><span class="tooltiptextTicker">Es una codificación interna de CRECE para clasificar a los solicitantes. Con esto puedes comparar tu portafolio de inversión con otros inversionistas y ver los retornos que han tenido.</span></i></span>'+
  '                                                    </div>'+
  '                                                </div>'+
  '                                            </div>'+
  '            '+
  '                                            <div class="col-12">'+
  '                                                <div class="crece-oportunidades-contenido">'+
  '                                                    <div class="col-12 crece-oportunidades-contenido-monto">'+
  '                                                      <div class="row justify-content-center">'+
  '                                                        <div class="col-11 crece-oportunidades-contenido-monto-texto">'+
  '                                                            <p>'+
  '                                                                <strong>$'+numeroConComas(decimalAEntero(oportunidad.monto))+'</strong><br>'+
  '                                                                $'+numeroConComas(calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado))+' ('+oportunidad.porcentaje_financiado+'%) recolectados'+
  '                                                            </p>'+
  '                                                            '+
  '                                                            <span></span>'+
  '                                                        </div>'+
  '                                                        <div class="col-1 crece-oportunidades-contenido-monto-img-wrapper">'+
  '                                                             <button class="copyButton" data-toggle="tooltip" data-placement="bottom" data-trigger="click" delay: { "show": 0, "hide": 100 } data-clipboard-text="'+rutaDetalleSolicitud(oportunidad.id)+'" alt="Compartir" width="20" height="20">'+
  '                                                                 <img class="copyImage" data-container=".crece-oportunidades" data-toggle="tooltip" data-placement="top" data-original-title="Copiar enlace y compartir" src="/static/assets/compartir.png" role="button" alt="Compartir" width="20" height="20" >'+
  '                                                             </button>'+
  '                                                        </div>'+
  '                                                        <div class="col-12 crece-oportunidades-contenido-monto-barra">'+
  '                                                            <div style="width:'+oportunidad.porcentaje_financiado+'%;" class="crece-oportunidades-contenido-monto-barra-progreso">'+
  '            '+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                       </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-informacion">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Plazo</strong><br>'+
  '                                                                    '+oportunidad.plazo+' Meses'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col-4 crece-oportunidades-contenido-informacion-industria">'+
  '                                                                <p>'+
  '                                                                    <strong>Industria</strong><br>'
                                                                          +oportunidad.categoria+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Tasa(TIR)</strong><i class="fa fa-question-circle tooltipTir" aria-hidden="true"><span class="tooltiptextTir">La Tasa Interna de Retorno representa una métrica más transparente del ingreso que genera tu inversión, pues toma en consideración las comisiones cobradas por CRECE. Adicionalmente, se expresa en periodos anuales, así que facilita la comparación entre operaciones de diferentes plazos.</span></i><br>'+
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
  '                                                            <div class="col-12 crece-historia-container">'+
                                                                      oportunidad.historia+
  '                                                                <a class="crece-oportunidades-contenido-solicitante-link" href="'+rutaDetalleSolicitud(oportunidad.id)+'">...</a>'+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-historial">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Pagados</strong><i class="fa fa-question-circle tooltipPag" aria-hidden="true"><span class="tooltiptextPag">Indica la cantidad de solicitudes terminadas de pagar por el solicitante.</span></i><br>'+
  '                                                                    '+oportunidad.solicitudes_pagadas+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col-4 crece-oportunidades-contenido-historial-centro">'+
  '                                                                <p>'+
  '                                                                    <strong>Puntualidad</strong><i class="fa fa-question-circle tooltipPun" aria-hidden="true"><span class="tooltiptextPun">Indica la proporción de pagos que él ha realizado de forma puntual. Excluye retrasos por temas operativos o técnicos.</span></i><br>'+
  '                                                                    '+decimalAEntero(oportunidad.puntualidad_autor)+'%'+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Vigentes</strong><i class="fa fa-question-circle tooltipVig" aria-hidden="true"><span class="tooltiptextVig">Cantidad de solicitudes que aún tienen pagos pendientes sobre el total de solicitudes publicadas en la plataforma.</span></i><br>'+
  '                                                                    '+oportunidad.solicitudes_vigentes+
  '                                                                </p>'+
  '                                                            </div>'+
  '                                                        </div>'+
  '                                                    </div>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-botones">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-blanco">'+
  '                                                                <button type="button" onclick="crearModal('+oportunidad.id+')">Ver más</button>'+
  '                                                            </div>'+
  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+
  '                                                                <a href="/inversionista/dashboard/?mostrar_detalle=true&id_solicitud='+oportunidad.id+'" target="_blank">Invertir</a>'+
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



let section_carrusel = document.getElementById("crece-carrusel-id")
let ingresar_boton_imagen_1 = document.createElement("div")
ingresar_boton_imagen_1.className = "crece-carrusel-boton-ingresar-imagen"
ingresar_boton_imagen_1.innerHTML = `<a class="" href="/solicitar/">
                                Solicitar
                                </a>`
ingresar_boton_imagen_1.setAttribute("id", "ingresar-boton-imagen-0")

section_carrusel.appendChild(ingresar_boton_imagen_1)



// SECCION DETALLE DE LA SOLICITUD

function crearModal(id){
  //Si es dispositivo movil redireccionar
  if($(window).width() <= 600){
    window.location.href = rutaDetalleSolicitud(id);
  }
  //Si no, mostrar modal
  else{
    obtenerDetallesOportunidadInversion(id);
  }
}

function obtenerDetallesOportunidadInversion(id_oportunidad){
  $.ajax({
      url: RUTA_SOLICITUDES+id_oportunidad+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){
              crearDetalleInversion(res.data);
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          alert("Solicitud no encontrada.");
      }
  });
}


function crearDetalleInversion(oportunidad) {
  var html_string = '<div class="row justify-content-center crece-detalle-operaciones-header">'+
'                        <div class="col-xl-8 col-lg-10 col-11 crece-detalle-operaciones-header-imagen">'+
'                           <div class="crece-detalle-operaciones-header-imagen-blur" style="background-image: url(\' '+oportunidad.imagen_categoria+'\');">'+
'                           </div>'+
'                        </div>'+
'                        <div class="crece-detalle-operaciones-header-gradiente col-xl-8 col-lg-10 col-11" >'+
'                           <svg class="bi bi-x crece-detalle-operaciones-header-gradiente-cerrar" width="50px" height="50px" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
'                             <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>'+
'                             <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>'+
'                           </svg>'+
'                           <div class="row justify-content-center crece-detalle-operaciones-header-gradiente-imagen" >'+
'                               <div class="col-auto" >'+
'                                   <div class="crece-detalle-operaciones-header-gradiente-imagen-autor" style="background-image: url(\' '+oportunidad.imagen_url+'\');">'+
'                                   </div>'+
'                               </div>'+
'                               <div class="col-auto" >'+
'                                   <div class="row" >'+
'                                       <h1>'+oportunidad.autor+'</h1>'+
'                                   </div>'+
'                                   <div class="row" >'+
'                                       <h2>'+oportunidad.categoria+'</h2>'+
'                                   </div>'+
'                               </div>'+
'                           </div>'+
'                        </div>'+
'                    </div>'+
''+
'                    <div id="container_informacion" class="row justify-content-center">'+
'                        <div class="col-xl-8 col-lg-10 col-11 fondo-blanco">'+
'                            <div class="row justify-content-center">'+
'                                <!--Contenido izquierda-->'+
'                                <div class="col-lg-8 col-12">'+
'                                    <div class="row justify-content-center">'+
'                                        <!--Barra de progreso-->'+
'                                        <div class="crece-detalle-operaciones-contenido col-12">'+
'                                            '+
'                                            <div class="row justify-content-center">'+
'                                                <!--Barra de progreso-->'+
'                                            <div class="col-10 crece-operaciones-contenido-monto-barra">'+
'                                                    <div style="width: '+ oportunidad.porcentaje_financiado+'%;" class="crece-operaciones-contenido-monto-barra-progreso">'+
'                                                    </div>                                                        '+
'                                                </div>'+
'        '+
'                                                <!--Datos Barra-->'+
'                                                <div class="col-10 crece-operaciones-contenido-datos-barra">'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-datos-barra-porcentaje">'+
'                                                            <strong>'+
'                                                                $'+numeroConComas(calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado))+
'                                                            </strong>'+
'                                                            <span>'+ oportunidad.porcentaje_financiado+'% recolectado</span>'+
'                                                        </div>'+
'                                                        <div class="col-6 crece-operaciones-contenido-datos-barra-objetivo">'+
'                                                            <strong>'+
'                                                                $'+numeroConComas(decimalAEntero(oportunidad.monto))+
'                                                            </strong>'+
'                                                            <span>Objetivo</span>'+
'                                                        </div>'+
'                                                    </div>'+
'                                                </div>'+
'        '+
'                                                <!-- Informacion -->'+
'                                                <div class="col-10 crece-operaciones-contenido-informacion">'+
'                                                    <h2>Información del Financiamiento</h2>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <strong>Monto</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6 col-sm-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>$'+numeroConComas(decimalAEntero(oportunidad.monto))+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <strong>Plazo</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6 col-sm-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>'+oportunidad.plazo+' Meses</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <strong>TIR</strong> <i class="fa fa-question-circle tooltipTirVermas" aria-hidden="true"><span class="tooltiptextTirVermas">La Tasa Interna de Retorno representa una métrica más transparente del ingreso que genera tu inversión, pues toma en consideración las comisiones cobradas por CRECE. Adicionalmente, se expresa en periodos anuales, así que facilita la comparación entre operaciones de diferentes plazos.</span></i>'+
'                                                        </div>'+
'                                                        <div class="col-6 col-sm-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>'+ oportunidad.tir+'%</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <strong>Frecuencia de pagos</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6 col-sm-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>Mensual (Capital e intereses)</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <strong>Tipo de Financiamiento</strong> <i class="fa fa-question-circle tooltipTipo_credVermas" aria-hidden="true"><span class="tooltiptextTipo_credVermas">Uso que se le dará al capital. Existen tres tipos:<br>-Capital de trabajo<br>-Compra de activo<br>-Adelanto de factura</span></i>'+
'                                                        </div>'+
'                                                        <div class="col-6 col-sm-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>'+oportunidad.tipo_credito+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <strong>Categoría del Negocio</strong>'+
'                                                        </div>'+
'                                                        <div class="col-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>'+oportunidad.categoria+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6">'+
'                                                            <strong>Ticker</strong> <i class="fa fa-question-circle tooltipTickerVermas" aria-hidden="true"><span class="tooltiptextTickerVermas">Es una codificación interna de CRECE para clasificar a los solicitantes. Con esto puedes comparar tu portafolio de inversión con otros inversionistas y ver los retornos que han tenido.</span></i>'+
'                                                        </div>'+
'                                                        <div class="col-3">'+
'                                                            <span>'+oportunidad.ticket+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                </div>'+
'        '+
'                                                <!-- Historia -->'+
'                                                <div class="col-10 crece-operaciones-contenido-historia">'+
'                                                    <h2>Historia de '+oportunidad.autor+'</h2>'+
'                                                    <div class="row">'+
'                                                        <div class="col-12">'+
'                                                            <p>'+oportunidad.historia+
'                                                            </p>'+
'                                                        </div>'+
'                                                    </div>'+
'                                                </div>'+
'                                            </div>'+
'                                            '+
'    '+
'    '+
'                                        </div>'+
'                                    </div>'+
'                                </div>'+
'    '+
'                                <!-- Contenido derecha -->'+
'                                <div class="col-lg-4 col-11">'+
'                                    <div class="row justify-content-center">'+
'    '+
'                                        <!-- Invierte -->'+
'                                        <div class="crece-detalle-operaciones-invierte col-lg-9">'+
'                                            <div class="row justify-content-center">'+
'                                                <h3>Invierte en el Solicitante</h3>'+
'                                                <p>'+
'                                                    Ingresa a la plataforma, calcula tu retorno y haz tu compromiso de inversión. <br> Si estás registrado, da clic en Invertir. Si no te has registrado crea tu usuario ahora.'+
'                                                </p>'+
''+
'                                                <div class="crece-detalle-operaciones-invierte-botones">'+
'                                                    <div class="crece-detalle-operaciones-invierte-botones-blanco">'+
'                                                        <div class="row justify-content-center">'+
'                                                            <a href="/inversionista/registro">Crear Usuario</a>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                    <div class="crece-detalle-operaciones-invierte-botones-azul">'+
'                                                        <div class="row justify-content-center">'+
'                                                            <a href="/inversionista/dashboard/?modal_simular=true&id_solicitud='+oportunidad.id+'" target="_blank">Invertir</a>'+
'                                                        </div>'+
'                                                    </div>'+
'                                                        '+
'                                                </div>'+
'                                            </div>'+
'                                        </div>'+
'    '+
'                                        <!-- Historial Solicitante -->'+
'                                        <div class="crece-detalle-operaciones-historial col-lg-9">'+
'                                            <!-- titulo historial-->'+
'                                            <div class="row justify-content-center">'+
'                                                <h3>Sobre el Solicitante</h3>'+
'                                            </div>'+
'                                            <!-- datos historial-->'+
'                                            <div class="row justify-content-center crece-detalle-operaciones-historial-datos">'+
'                                                <div class="col-12">'+
'                                                    <!-- Item datos-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-9">'+
'                                                            <h4>'+
'                                                                Solicitudes Vigentes'+
'                                                               <i class="fa fa-question-circle tooltipVigVermas" aria-hidden="true"><span class="tooltiptextVigVermas">Cantidad de solicitudes que aún tienen pagos pendientes sobre el total de solicitudes publicadas en la plataforma.</span></i>'+
'                                                            </h4>'+
'                                                        </div>'+
'                                                        <div class="col-3">'+
'                                                            <h5>'+
'                                                                '+oportunidad.solicitudes_vigentes+
'                                                            </h5>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                     <!-- Item datos-->'+
'                                                     <div class="row">'+
'                                                        <div class="col-9">'+
'                                                            <h4>'+
'                                                                Solicitudes Pagadas'+
'                                                                 <i class="fa fa-question-circle tooltipPagVermas" aria-hidden="true"><span class="tooltiptextPagVermas">Indica la cantidad de solicitudes terminadas de pagar por el solicitante.</span></i>'+
'                                                            </h4>'+
'                                                        </div>'+
'                                                        <div class="col-3">'+
'                                                            <h5>'+
'                                                                '+oportunidad.solicitudes_pagadas+
'                                                            </h5>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                     <!-- Item datos-->'+
'                                                     <div class="row">'+
'                                                        <div class="col-9">'+
'                                                            <h4>'+
'                                                                Puntualidad'+
'                                                                 <i class="fa fa-question-circle tooltipPunVermas" aria-hidden="true"><span class="tooltiptextPunVermas">Indica la proporción de pagos que él ha realizado de forma puntual. Excluye retrasos por temas operativos o técnicos.</span></i>'+
'                                                            </h4>'+
'                                                        </div>'+
'                                                        <div class="col-3">'+
'                                                            <h5>'+
'                                                                '+decimalAEntero(oportunidad.puntualidad_autor)+'%'+
'                                                            </h5>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                </div>'+
'                                            </div>'+
'                                        </div>'+
''+
''+
'                                    </div>'+
'                                </div>'+
'                            </div>'+
'                            '+
'                        </div>'+
'                    </div>';

  $(".crece-modal-container").html(html_string) ;


  $(".crece-detalle-operaciones-header").click(function (){
    $(".crece-modal").hide();
  });

  $(".crece-detalle-operaciones-header *").click(function(e) {
    e.stopPropagation();
  });

  $(".crece-modal").click(function (){
    $(".crece-modal").hide();
  });

  $(".crece-modal *").click(function(e) {
    e.stopPropagation();
  });

  $("#container_informacion").click(function (){
    $(".crece-modal").hide();
  });

  $("#container_informacion *").click(function(e) {
    e.stopPropagation();
  });

  $(".crece-detalle-operaciones-header-gradiente-cerrar, .crece-detalle-operaciones-header-gradiente-cerrar *").click(function(){
    $(".crece-modal").hide();
  });

  //Si el modal es mas grande que el viewport entonces mostrarlo desde arriba
  $(".crece-modal").css('display', 'block');
  //Si no lo es, mostrarlo centrado
  if($(".crece-modal-container").height() < $(window).height()){
    $(".crece-modal").css('display', 'flex');
    $(".crece-modal").css('justify-content', 'center');
    $(".crece-modal").css('align-items', 'center');
  }


  //Se asegura que no se ingresen caracteres ni montos incorrectos al monto de la inversion
  $('#monto_inversion').focus(
      function(){
          $(this).parent('div').css('border-color','#006B8D');
      }).blur(
      function(){
          $(this).parent('div').css('border-color','#DEDEDE');
      });
  
      $('#monto_inversion').keyup( function(){
          let numero_ingresado = $(this).val();
          let monto_maximo = oportunidad.monto - calcularPorcentajeFinanciadoFloat(oportunidad.monto, oportunidad.porcentaje_financiado)
          if( $.isNumeric(numero_ingresado)){
              if( numero_ingresado<0){
                  $(this).val($(this).val() * -1);
      
              }
              else if (numero_ingresado > monto_maximo) {
                  $(this).val(numero_ingresado.slice(0,-1));
                  alert("El monto máximo a invertir es: "+ monto_maximo.toFixed(2))
              }
  
          }
          else{
              $(this).val(numero_ingresado.slice(0,-1));
          }
      });

}

function numeroConComas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function decimalAPorcentaje(decimal){
  return decimal.split(".")[1];
}

function decimalAEntero(decimal){
  return decimal.split(".")[0];
}

function calcularPorcentajeFinanciado(monto, porcentaje_financiado){
  total_financiado = parseFloat(monto)*(parseFloat(porcentaje_financiado)/100);
  return Math.round( total_financiado );
}


function calcularPorcentajeFinanciadoFloat(monto, porcentaje_financiado){
  total_financiado = parseFloat(monto)*(parseFloat(porcentaje_financiado)/100);
  return total_financiado;
}

