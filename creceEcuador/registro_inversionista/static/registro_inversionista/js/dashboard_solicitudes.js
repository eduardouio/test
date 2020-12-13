let RUTA_SOLICITUDES = "/solicitudes/"
let RUTA_SOLICITUDES_FASES_INVERSION = "/registro/"
let RUTA_DETALLE_SOLICITUD ="/invertir/detalle/"
let RUTA_INVERSIONES_POR_USUARIO = "/registro/inversiones/"
let indice_opcion_actual = 0;
let CANTIDAD_OPCIONES_MOSTRADAS = 9;
let CANTIDAD_OPCIONES_MOSTRADAS_MIS_INV = -1;
let obteniendoOportunidades = false;
let dataEncontrada = true;
let RUTA_DETALLES_INVERSION_VIGENTE = "/registro/detalles_inversion_vigente/"

const URL_FILL_INFO = "/registro/completa_datos/"
const URL_ORIGIN_MONEY = "/registro/declaracion_fondos/"
const URL_PENDING_TRANSFER = "/registro/subir_transferencia/"

$( document ).ready(function() {
  let inversionista = $(".active.selectable").attr("data-usuario")
  obtener_inversiones_por_usuario(inversionista)

  $(window).scroll(cargarOportunidadesOnScroll);


    
});

function cargarOportunidadesOnScroll(){
  var a = window.location.href;
  let referencia = a.split('#')[1];
  if($(window).scrollTop() + $(window).height() > $(document).height() - 5) {
    if(!obteniendoOportunidades && dataEncontrada && (referencia === 'todas' || referencia === undefined)){
      obteniendoOportunidades = true;
      let inversionista = $(".active.selectable").attr("data-usuario")
      obtener_inversiones_por_usuario(inversionista)
    }
  }
}



$(".crece-oportunidades-siguiente").click( function() {
  let inversionista = $(".active.selectable").attr("data-usuario")
    obtener_inversiones_por_usuario(inversionista)
    // obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
});
$(".crece-oportunidades-anterior").click( function() {
    if(indice_opcion_actual > CANTIDAD_OPCIONES_MOSTRADAS){
        indice_opcion_actual = indice_opcion_actual - CANTIDAD_OPCIONES_MOSTRADAS - CANTIDAD_OPCIONES_MOSTRADAS;

        let inversionista = $(".active.selectable").attr("data-usuario")
        obtener_inversiones_por_usuario(inversionista)

    } 
});

function obtenerOportunidadesInversion(inicio, cantidad_opciones, lista_inversiones_usuario){
    var querystring = "?inicio="+inicio +"&cantidad="+ cantidad_opciones;
    $.ajax({
        url: RUTA_SOLICITUDES+querystring,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if (res.data.length > 0){
                indice_opcion_actual += cantidad_opciones

                crearCuadrosOportunidadesInversion(res.data, true, lista_inversiones_usuario, "INICIO");

            }  
            else{
              dataEncontrada = false;
              obteniendoOportunidades = false;
            }
        },
        error: function() {
          obteniendoOportunidades = false;
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


function crearCuadrosOportunidadesInversion(data, append, lista_inversiones_usuario, inicio){

    let string_operacion = "";
    let solicitudes_anteriores;
  
    $.each( data, function( indice, oportunidad ) {
        string_operacion += stringSolicitud(oportunidad, lista_inversiones_usuario, inicio);
    });
  
    if(append){
      solicitudes_anteriores = $(".crece-oportunidades-container").html();
    }

    $(".crece-oportunidades-container").html(string_operacion);
    setearTooltipsSugerenciaCompartir();
    
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
        this.innerHTML = stringParrafo.slice(0,-1) + linkSolicitante;
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

    if(append) {
      $(".crece-oportunidades-container").prepend(solicitudes_anteriores);
    }

    obteniendoOportunidades = false;
  
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

function crear_boton_continuar_tarjeta(id_solicitud, lista_inversiones_usuario, inicio, porcentaje_financiado) {
  // body...
  var a = window.location.href;
  let referencia = a.split('#')[1]
  if(parseInt(porcentaje_financiado) < 100){
      if(inicio === "INICIO"){
        for (var i = lista_inversiones_usuario.length - 1; i >= 0; i--) {
          solicitud_invertida = lista_inversiones_usuario[i]
          if(id_solicitud === solicitud_invertida.id){
            let fase_inversion = solicitud_invertida.fase_inversion
            let id_oportunidad = solicitud_invertida.id_inversion
            let monto = solicitud_invertida.monto_invertido
            if(fase_inversion === "FILL_INFO"){
              return (`
                      <span class="span-solicitud-invertida-dashboard">
                        


                          <a class="crece-solicitud-invertida-dashboard" href="#pendientes" onclick="mostrar_completar_datos_modal(`+id_oportunidad+`, `+ monto+`, `+ id_solicitud+`, '`+ fase_inversion+`')">
                            <i class="fa fa-check-square-o" aria-hidden="true"></i>
                            Continuar
                          </a>
                      </span>`
              );
            }

            else if(fase_inversion === "ORIGIN_MONEY"){
              return (`
                      <span class="span-solicitud-invertida-dashboard">
                         <a class="crece-solicitud-invertida-dashboard" href="#pendientes" onclick="declaracion_fondos_modal(`+id_oportunidad+`, `+ monto+`, `+ id_solicitud+`, '`+ fase_inversion+`')">
                           <i class="fa fa-check-square-o" aria-hidden="true"></i>
                           Continuar
                          </a>
                     </span>`  
              );
            }

            else if(fase_inversion === "PENDING_TRANSFER"){
              return (`
                        <span class="span-solicitud-invertida-dashboard">
                            <a class="crece-solicitud-invertida-dashboard check" href="#pendientes" onclick="subir_transferencia_modal(`+id_oportunidad+`, `+ monto+`, `+ id_solicitud+`, '`+ fase_inversion+`')"> 
                              <i class="fa fa-check-square-o" aria-hidden="true"></i>
                              Continuar
                            </a>
                        </span>`
              );
            }
            else if(fase_inversion === "TRANSFER_SUBMITED"){
              return (`
                        <span class="span-solicitud-invertida-dashboard">
                            <a class="crece-solicitud-invertida-dashboard check" href="#pendientes" onclick="transfer_submited_modal(`+id_oportunidad+`, `+ monto+`, `+ id_solicitud+`, '`+ fase_inversion+`')"> 
                              <i class="fa fa-check-square-o" aria-hidden="true"></i>
                              Continuar
                            </a>
                        </span>`
              );
            }
            else if(fase_inversion ===  "GOING"){
              return (`
                        <span class="span-solicitud-invertida-dashboard">
                            <a class="crece-solicitud-invertida-dashboard check"> 
                              <i class="fa fa-check-square-o" aria-hidden="true"></i>
                              Invertido
                            </a>
                        </span>`
              );
            }  

          }
        }
        return ""
    }else{
      return ""
    }
  }
  else{
    return(
            `
             <span class="span-solicitud-invertida-dashboard">
                            <a class="crece-solicitud-invertida-dashboard check"> 
                              <i class="fa fa-check-square-o" aria-hidden="true"></i>
                              Completada
                            </a>
                        </span>

            `
          );
  }
  
  
  
}

function format_proxima_fecha_pago(fecha) {
  // body...
  lista = fecha.split("-")
  dia = lista[2]
  mes = lista[1]
  year = lista[0]
  return dia+"/"+mes+"/"+year
}

function crear_inversiones_vigentes(oportunidad) {
  // body...
  id_inversion = oportunidad.id_inversion
  $.ajax({
      url: RUTA_DETALLES_INVERSION_VIGENTE+id_inversion+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){
            let intereses_ganados = res.data.intereses_ganados
            let capital_cobrado = res.data.capital_cobrado
            let proxima_fecha_pago = res.data.proxima_fecha_pago
            proxima_fecha_pago  = format_proxima_fecha_pago(proxima_fecha_pago)
            id_interes_ganados = "#solicitud-valida-intereses-ganados-"+oportunidad.id_inversion
            $(id_interes_ganados).html("$"+numberWithCommas(intereses_ganados))
            id_capital_cobrado = "#solicitud-valida-capital-cobrado-"+oportunidad.id_inversion
            $(id_capital_cobrado).html("$"+numberWithCommas(capital_cobrado))
            id_proxima_fecha_pago = "#solicitud-valida-fecha-pago-"+oportunidad.id_inversion
            $(id_proxima_fecha_pago).html(proxima_fecha_pago)
            oportunidad.intereses_ganados = intereses_ganados
            oportunidad.capital_cobrado = capital_cobrado
            oportunidad.proxima_fecha_pago = proxima_fecha_pago
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          let id = "#crece-inversion-vigente-container-"+oportunidad.id_inversion
          $(id).hide()
      }
  });
}

function crearTarjetaInversionVigente(oportunidad) {
  
    let tarjeta_oportunidad = ` <div class="col-12" id="crece-inversion-vigente-container-`+oportunidad.id_inversion+`">
                                <div class="row justify-content-center">
                                  <div class="col-12 crece-solicitud-valida-contenedor">
                                    <div class="row">
                                      <div class="col-lg-5 col-xl-5 col-5 crece-solicitud-valida-imagen-autor">
                                          <div class="crece-detalle-operaciones-header-gradiente-imagen-autor" style="background-image: url(\' /`+encodeURIComponent(oportunidad.imagen_url)+ `\');">
                                            
                                          </div>
                                          <div class="crece-solicitud-valida-imagen-autor-contenido">
                                              <div class="row" >
                                                  <h4>`+oportunidad.autor+`</h4>
                                              </div>
                                              <div class="row" >
                                                  <h4>`+oportunidad.tipo_persona+`</h4>
                                              </div>
                                              <div class="row" >
                                                  <h5>`+oportunidad.ticket+`</h5>
                                              </div>
                                          </div>
                                      </div>
                                      <div class="col-lg-7 col-xl-7 col-7 crece-solicitud-valida-detalle">
                                        <div class="row crece-solicitud-valida-detalle-intereses-ganados">
                                          <div class="col-1 crece-solicitud-detalle-icono">
                                            <img src="/static/assets/favicon-32.png">
                                          </div>
                                          <div class="col-10" style="padding-left: 0px;">
                                            <div class="col-12" style="color: #006B8D;font-weight: 400;font-size: 30px;">
                                              <span id="solicitud-valida-intereses-ganados-`+oportunidad.id_inversion+`"> $0 </span>
                                            </div>
                                            <div class="col-12" style="font-size: 10px;top: -8px;">
                                              Intereses ganados
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row crece-solicitud-valida-detalle-inversion">
                                          <div class="col-12">
                                            <div class="row">
                                              <div class="col-1 crece-solicitud-detalle-icono">
                                                <img src="/static/assets/icono_capital_cobrado.png">
                                              </div>
                                              <div class="col-10">
                                                <span id="solicitud-valida-capital-cobrado-`+oportunidad.id_inversion+`">$</span> 
                                                <span class="solicitud-valida-detalle-inversion-texto-derecha">Capital cobrado</span>
                                                <div class="solicitud-valida-detalle-inversion-texto-derecha-movil">
                                                  Capital cobrado
                                                </div>
                                              </div>
                                            </div>
                                            <div class="row">
                                              <div class="col-1 crece-solicitud-detalle-icono">
                                                <img src="/static/assets/icono_capital_invertido.png">
                                              </div>
                                              <div class="col-10">
                                                <span id="solicitud-valida-capital-invertido">$`+numberWithCommas(oportunidad.monto_invertido)+`</span>
                                                <span class="solicitud-valida-detalle-inversion-texto-derecha">Capital invertido</span>
                                                <div class="solicitud-valida-detalle-inversion-texto-derecha-movil">
                                                  Capital invertido
                                                </div>
                                              </div>

                                            </div>
                                            <div class="row">
                                              <div class="col-1 crece-solicitud-detalle-icono">
                                                <img src="/static/assets/icono_tasa_tir.png">
                                              </div>
                                              <div class="col-10">
                                                <span id="solicitud-valida-tasa-tir">`+oportunidad.tir+`%</span>
                                                <span class="solicitud-valida-detalle-inversion-texto-derecha">Tasa(TIR)</span>
                                                <div class="solicitud-valida-detalle-inversion-texto-derecha-movil">
                                                  Tasa(TIR)
                                                </div>
                                              </div>
                                            </div>
                                            <div class="row">
                                              <div class="col-1 crece-solicitud-detalle-icono">
                                                <img src="/static/assets/icono_proxima_fecha_pago.png">
                                              </div>
                                              <div class="col-10">
                                                <span id="solicitud-valida-fecha-pago-`+oportunidad.id_inversion+`"></span> 
                                                <span class="solicitud-valida-detalle-inversion-texto-derecha">Próxima fecha de pago</span>
                                                 <div class="solicitud-valida-detalle-inversion-texto-derecha-movil">
                                                  Próxima fecha de pago
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row crece-solicitud-valida-botones">
                                          <div class="col-12">
                                            <button  onclick="ver_detalle_solicitud('GOING',`+oportunidad.id_inversion+`,`+oportunidad.id+`, `+oportunidad.monto_inversion+`)">Ver más</button>
                                            <button onclick="crear_modal_tabla_solicitud_valida(`+oportunidad.id_inversion+`,`+oportunidad.id_solicitud+`)">Tabla de pagos</button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            `
  crear_inversiones_vigentes(oportunidad)
  return tarjeta_oportunidad
}

function stringSolicitud(oportunidad, lista_inversiones_usuario, inicio){
  let tarjeta_oportunidad = ""
  if (oportunidad.fase_inversion === "GOING"){
    tarjeta_oportunidad = crearTarjetaInversionVigente(oportunidad)
  }else{
    tarjeta_oportunidad = '<div class="col-xl-4 col-lg-6 col-12">'+
  
  '                                    <div class="row justify-content-center">'+
  '                                        <div class="crece-oportunidades-contenedor">'+
  '                                            <div class="col-12 crece-oportunidades-imagen" style="background-image: url(\' /'+encodeURIComponent(oportunidad.imagen_url)+ '\');">'+
  '                                                <div class="crece-oportunidades-imagen-gradiente">'+
  '                                                    <div class="crece-oportunidades-imagen-gradiente-texto">'+
                                                        crear_boton_continuar_tarjeta(oportunidad.id, lista_inversiones_usuario, inicio, oportunidad.porcentaje_financiado)+
  '                                                        <span>'+ oportunidad.tipo_credito +' <i class="fa fa-question-circle tooltipTipo_cred" aria-hidden="true"><span class="tooltiptextTipo_cred">Uso que se le dará al capital. Existen tres tipos:<br>-Capital de trabajo<br>-Compra de activo<br>-Adelanto de factura</span></i></span>'+
  '                                                        <strong>'+ oportunidad.autor +'</strong>'+
  '                                                        <strong>'+oportunidad.tipo_persona+'</strong>'+
  '                                                        <span>'+ oportunidad.ticket +'<i class="fa fa-question-circle tooltipTicker" aria-hidden="true"><span class="tooltiptextTicker">Es una codificación interna de CRECE para clasificar a los solicitantes. Con esto puedes comparar tu portafolio de inversión con otros inversionistas y ver los retornos que han tenido.</span></i></span>'+
                                                            
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
  '                                                                 <img class="copyImage" data-container=".content" data-toggle="tooltip" data-placement="bottom" data-original-title="Copiar enlace y compartir" src="/static/assets/compartir.png" role="button" alt="Compartir" width="20" height="20" >'+
  '                                                             </button>'+
  '                                                            <span class="crece-oportunidades-contenido-monto-img-wrapper-link">'+rutaDetalleSolicitud(oportunidad.id)+'</span>'+
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
                                                    '<a class="crece-oportunidades-contenido-solicitante-link" href="'+rutaDetalleSolicitud(oportunidad.id)+'">...</a>'+
  '        '+
  '                                                    <div class="col-12 crece-oportunidades-contenido-historial">'+
  '                                                        <div class="row">'+
  '                                                            <div class="col-4">'+
  '                                                                <p>'+
  '                                                                    <strong>Pagados</strong> <i class="fa fa-question-circle tooltipPag" aria-hidden="true"><span class="tooltiptextPag">Indica la cantidad de solicitudes terminadas de pagar por el solicitante.</span></i><br>'+
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
                                                                    button_detalle_solicitud(oportunidad.fase_inversion, oportunidad.id_inversion, oportunidad.id, lista_inversiones_usuario, inicio, oportunidad.monto_invertido)+                                                                
  '                                                            </div>'+

                                                                botonInvertir(oportunidad, lista_inversiones_usuario, inicio)+


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

  }
  return tarjeta_oportunidad;
  
	
}
function botonInvertir(oportunidad, lista_inversiones_usuario, inicio){
  if(parseInt(oportunidad.porcentaje_financiado) < 100){
    return link_a_fase_inversion(oportunidad.fase_inversion, oportunidad.id_inversion, oportunidad.id, oportunidad.monto_invertido, lista_inversiones_usuario, inicio);
  }
  return (
    '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul-desactivado">'+
    '                                                                <a href="#pendientes">Invertir</a>'+
    '                                                            </div>'
  );
}

function button_detalle_solicitud(fase_inversion, id_oportunidad, id_solicitud, lista_inversiones_usuario, inicio, monto) {
  // body...

  if(inicio==="INICIO"){
    for (let  i = 0; i< lista_inversiones_usuario.length; i++) {

      solicitud_invertida = lista_inversiones_usuario[i]
      

        if(id_solicitud === solicitud_invertida.id){
          let fase_inversion = solicitud_invertida.fase_inversion
          let id_oportunidad = solicitud_invertida.id_inversion
          let monto = solicitud_invertida.monto_invertido
            if(fase_inversion === "FILL_INFO"){
                  return ( `<button type="button" onclick="ver_detalle_solicitud('FILL_INFO',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
                            `

                                                                                );
                }

                else if(fase_inversion === "ORIGIN_MONEY"){
                  return ( `<button type="button" onclick="ver_detalle_solicitud('ORIGIN_MONEY',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
                            `

                                                                                );
                }

                else if(fase_inversion === "PENDING_TRANSFER"){
                  return ( `<button type="button" onclick="ver_detalle_solicitud('PENDING_TRANSFER',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
                            `

                                                                                );
                }
                 else if(fase_inversion === "TRANSFER_SUBMITED"){
                  return ( `<button type="button" onclick="ver_detalle_solicitud('TRANSFER_SUBMITED',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
                            `

                                                                                );
                }
                
                
        }
    }

   return ( `<button  type="button" onclick="ver_detalle_solicitud('SIMULAR',`+id_oportunidad+`,`+id_solicitud+`)">Ver más</button>'
                        `

                                                                                );
              
  }
  if(fase_inversion === "FILL_INFO"){
    return ( `<button type="button" onclick="ver_detalle_solicitud('FILL_INFO',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
              `

                                                                  );
  }

  else if(fase_inversion === "ORIGIN_MONEY"){
    return ( `<button type="button" onclick="ver_detalle_solicitud('ORIGIN_MONEY',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
              `

                                                                  );
  }

  else if(fase_inversion === "PENDING_TRANSFER"){
    return ( `<button type="button" onclick="ver_detalle_solicitud('PENDING_TRANSFER',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
              `

                                                                  );
  }
  else if(fase_inversion === "TRANSFER_SUBMITED"){
    return ( `<button type="button" onclick="ver_detalle_solicitud('TRANSFER_SUBMITED',`+id_oportunidad+`,`+id_solicitud+`, `+monto+`)">Ver más</button>'
              `

                                                                  );
  }
  else if(fase_inversion === "GOING"){
    return ''
  }
  else{
   return ( `<button  type="button" onclick="ver_detalle_solicitud('SIMULAR',`+id_oportunidad+`,`+id_solicitud+`)">Ver más</button>'
              `

                                                                  );
  }
}



function link_a_fase_inversion(fase_inversion, id_oportunidad, id_solicitud, monto, lista_inversiones_usuario, inicio){
  var a = window.location.href;
  let referencia = a.split('#')[1]
  if(inicio==="INICIO"){
    if (!referencia){
      referencia = "todas"
    }
    for (var i = lista_inversiones_usuario.length - 1; i >= 0; i--) {
      solicitud_invertida = lista_inversiones_usuario[i]
        if(id_solicitud === solicitud_invertida.id){
          let fase_inversion = solicitud_invertida.fase_inversion
          let id_oportunidad = solicitud_invertida.id_inversion
          let monto = solicitud_invertida.monto_invertido
            if(fase_inversion === "FILL_INFO"){
                return (
                  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

                  '                                                                <a href="#continuar" onclick="mostrar_completar_datos_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

                  '                                                            </div>'
                );
              }

              else if(fase_inversion === "ORIGIN_MONEY"){
                return (
                  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

                  '                                                                <a href="#continuar" onclick="declaracion_fondos_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

                  '                                                            </div>'
                );
              }

              else if(fase_inversion === "PENDING_TRANSFER"){
                return (
                  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

                  '                                                                <a href="#continuar" onclick="subir_transferencia_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

                  '                                                            </div>'
                );
              }
              else if(fase_inversion === "TRANSFER_SUBMITED"){
                return (
                  '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

                  '                                                                <a href="#continuar" onclick="transfer_submited_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

                  '                                                            </div>'
                );
              }
                
        }
    }
          return ( '<div class="col-6 crece-oportunidades-contenido-botones-azul">'+

      '                   <a href="#invertir" onclick="crear_modal_aceptar_inversion('+id_solicitud+',`aceptar-inversion-inicio`,350)">Invertir</a>'+

      '                                          </div>'
              );

  }


  if(fase_inversion === "FILL_INFO"){
    return (
      '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

      '                                                                <a href="#pendientes" onclick="mostrar_completar_datos_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

      '                                                            </div>'
    );
  }

  else if(fase_inversion === "ORIGIN_MONEY"){
    return (
      '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

      '                                                                <a href="#pendientes" onclick="declaracion_fondos_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

      '                                                            </div>'
    );
  }

  else if(fase_inversion === "PENDING_TRANSFER"){
    return (
      '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

      '                                                                <a href="#pendientes" onclick="subir_transferencia_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

      '                                                            </div>'
    );
  }
  else if(fase_inversion === "TRANSFER_SUBMITED"){
    return (
      '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

      '                                                                <a href="#pendientes" onclick="transfer_submited_modal('+id_oportunidad+', '+ monto+', '+ id_solicitud+', `'+ fase_inversion+'`)">Continuar</a>'+

      '                                                            </div>'
    );
  }
  else if(fase_inversion === "GOING"){
    return (`
            <div class="col-12 crece-oportunidades-contenido-botones-azul">
                <a href="#vigentes" onclick="crear_modal_tabla_solicitud_valida(`+id_oportunidad+`,`+id_solicitud+`)" style="margin-left: auto;margin-right: auto;
                                                                                        display: block;">
                  Ver Tabla
                  </a>
            </div>
          `      
    )
  }
  else{
    return (
      '                                                            <div class="col-6 crece-oportunidades-contenido-botones-azul">'+

      '                                                                <a href="#pendientes" onclick="crear_modal_aceptar_inversion('+id_solicitud+',`aceptar-inversion-inicio`,350)">Invertir</a>'+

      '                                                            </div>'
    );
  }

}


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
'                                   <div id="detalle-operaciones-imagen-solicitante" class="crece-detalle-operaciones-header-gradiente-imagen-autor" style="background-image: url(\' /'+oportunidad.imagen_url+'\');">'+
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
'                                                            <strong>TIR</strong>'+
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
'                                                            <strong>Tipo de Financiamiento</strong>'+
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
'                                                            <strong>Ticker</strong> '+
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
/*
'                                                <!-- input invierte-->'+
'                                                <div class="crece-detalle-operaciones-invierte-monto col-12">'+
'                                                    <div>'+
'                                                        <label for="monto">$</label><input id="monto_inversion" name="monto" type="text" min="0">'+
'                                                    </div>'+
'                                                </div>'+*/
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
'                                                            <a href="https://www.creceecuador-server.tk/sysworkspace/en/neoclassic/login/login">Invertir</a>'+
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


$(".selectable").click(function (){
    $(".selectable").each(function (){
        $(this).removeClass("active");
    });
    $(this).addClass("active")

    var fase_inversion =  $(this).attr("data-fase-inversion")
    var inversionista =  $(this).attr("data-usuario")

    $(".crece-oportunidades").show();
    $(".crece-perfil").hide();

    $("link[href='/static/registro_inversionista/css/registro.css']").remove();

    if (fase_inversion){

        $("#crece-botones-pag").hide()
        $('#crece-detalle-operaciones-id').hide()

        if(fase_inversion == "pendientes"){
          $(".crece-oportunidades-titulo").html("Mis Inversiones Pendientes")
        }
        else if(fase_inversion == "por_fondear"){
          $(".crece-oportunidades-titulo").html("Mis Inversiones Por Fondear")
        }
        else if(fase_inversion == "vigentes"){
          $(".crece-oportunidades-titulo").html("Mis Inversiones Vigentes")
        }
        else if(fase_inversion == "terminados"){
          $(".crece-oportunidades-titulo").html("Mis Inversiones Terminadas")
        }
        else{
          $(".crece-oportunidades-titulo").html("Mis Inversiones")
        }
        
        obtenerOportunidadesDesdeInversion(0, CANTIDAD_OPCIONES_MOSTRADAS_MIS_INV, fase_inversion, inversionista)
        
    }
    else {
        indice_opcion_actual = 0;

        dataEncontrada = true;

        $(".crece-oportunidades-container").html("");
        obtener_inversiones_por_usuario(inversionista)

        $("#crece-botones-pag").show()
        $('#crece-detalle-operaciones-id').hide()
        $(".crece-oportunidades-titulo").html("Oportunidades de Inversión")
    }
    
  });

function obtener_inversiones_por_usuario(id_inversionista) {
  // body...
  let url = RUTA_INVERSIONES_POR_USUARIO+id_inversionista+"/"
  let listaSolicitudes = []

  $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(res) {


                  listaSolicitudes = parseSolicitudesInversionASolicitudes(res.data)
                  obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS, listaSolicitudes);
               

            
        }
    });

}

function obtenerOportunidadesDesdeInversion(inicio, cantidad_opciones, fase_inversion, inversionista){
    var querystring = "?inicio="+inicio +"&cantidad="+ cantidad_opciones+"&fase_inversion="+ fase_inversion+"&id_inversionista="+ inversionista;
    $.ajax({
        url: RUTA_SOLICITUDES_FASES_INVERSION+querystring,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if (res.data.length > 0){
                let listaSolicitudes = parseSolicitudesInversionASolicitudes(res.data)
                
                crearCuadrosOportunidadesInversion(listaSolicitudes, false);
            }  
            else {
              $(".crece-oportunidades-container").html('<div class="col-11"><h3 class="crece-oportunidades-container-mensaje">No tienes inversiones activas</h3></div><div class="col-auto"><button class="crece-oportunidades-container-boton" type="button">Quiero Invertir</button></div>');
              
              $(".crece-oportunidades-container-boton").click(function(){
                $("#todas_las_oportunidades a").trigger("click");
              });
            }
        }
    });
}

function parseSolicitudesInversionASolicitudes(data){
    let listaSolicitudes = []
    $.each( data, function( indice, inversion ) {

        inversion.solicitud.fase_inversion = inversion.fase_inversion;
        inversion.solicitud.monto_invertido = inversion.monto;
        inversion.solicitud.id_inversion = inversion.id
        listaSolicitudes.push(inversion.solicitud);

    });
    return listaSolicitudes
}



/*modals*/

const CLASE_MODAL =".crece-modal";
const ID_COMPLETA_DATOS = "#completar_datos_wrapper";
const ID_DECLARACION_FONDOS = "#crece-declaracion-body-id";
const ID_SUBIR_TRANSFERENCIA = "#subir_transferencia_wrapper";
const ID_FASE_FINAL = "#final_inversion_wrapper";
const ID_FASE_ACEPTAR = "#aceptar-inversion-modal-dashboard"
const ID_CAMBIAR_MONTO_INVERSION = "#cambiar-monto-inversion-modal-dashboard"
const ID_SIMULAR_INVERSION = "#crece-modal-simular-inversion-id"
const ID_TABLA_SOLICITUD_VIGENTE = "#crece-modal-tabla-solicitud-vigente-id"
let monto_inversion_actual = 350;
let fase_inversion_actual;
let id_solicitud_actual;

let id_inversion_modal;

/*Aceptar inversion */
function aceptar_inversion_modal(id_solicitud) {
  // body...
  $(CLASE_MODAL).show();
  $(ID_FASE_ACEPTAR).css('display', 'flex');
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_COMPLETA_DATOS).hide();
  $(ID_DECLARACION_FONDOS).hide();
  $(ID_SIMULAR_INVERSION).hide();
  $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  $(ID_FASE_FINAL).hide();

}

/* declaracion de fondos */
function declaracion_fondos_modal(id_inversion, monto, id_solicitud, fase_inversion){

  id_inversion_modal = id_inversion;
  id_solicitud_actual = id_solicitud;
  monto_inversion_actual = monto;
  fase_inversion_actual = fase_inversion;
  $(CLASE_MODAL).show();
  $(ID_FASE_ACEPTAR).hide();
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_COMPLETA_DATOS).hide();
  $(ID_DECLARACION_FONDOS).css('display', 'flex');
  $(ID_SIMULAR_INVERSION).hide();
  $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  $(ID_FASE_FINAL).hide();

  habilitarClicks();

  setPasoInversionistaActualOrigin(3);

  $(".crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");

}

function aceptar_declaracion_fondos_modal() {

  if(fase_inversion_actual != "ORIGIN_MONEY"){

    $(CLASE_MODAL).show();
    $(ID_FASE_ACEPTAR).hide();
    $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
    $(ID_COMPLETA_DATOS).hide();
    $(ID_DECLARACION_FONDOS).hide();
    $(ID_SIMULAR_INVERSION).hide();
    $(ID_TABLA_SOLICITUD_VIGENTE).hide();
    $(ID_FASE_FINAL).hide();

    habilitarClicks();

    habilitarLinksAnteriores(fase_inversion_actual,4);

    setPasoInversionistaActualPendingTransfer(4);

    llenar_datos_transferencia(id_inversion_modal, true);

  }
  else {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           
            cambio_fase_inversion_declaracion_fondos_modal(id_inversion_modal);

            fase_inversion_actual = "PENDING_TRANSFER";

            habilitarClicks();

            habilitarLinksAnteriores(fase_inversion_actual,4);

            setPasoInversionistaActualPendingTransfer(4);

            llenar_datos_transferencia(id_inversion_modal, true)          

        }
    };
    let inversionista = $(".active.selectable").attr("data-usuario")
    xhttp.open("POST", RUTA_ACEPTAR_DECLARACION, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
                "id_inversionista": inversionista,
              })
        );


  }


}

function cambio_fase_inversion_declaracion_fondos_modal(id_inversion){
  $.ajax({
      type: 'POST',
      url: URL_CAMBIO_FASE_DECLARACION+id_inversion, 
      data: {},
      success: function(resultData) { 
        $("#crece-declaracion-body-id .error-container").hide();
        $(CLASE_MODAL).show();
        $(ID_FASE_ACEPTAR).hide();
        $(ID_DECLARACION_FONDOS).hide();
        $(ID_COMPLETA_DATOS).hide();
        $(ID_SIMULAR_INVERSION).hide();
        $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
        $(ID_TABLA_SOLICITUD_VIGENTE).hide();
        $(ID_FASE_FINAL).hide();
        $("#subir_transferencia_wrapper .error-container").hide();
      },
      error: function(){
          $("#crece-declaracion-body-id .error").html("No se pudo cambiar la fase de la inversión.");
          $("#crece-declaracion-body-id .error-container").css("display", "flex");
      }
  });
}




/* Completa Datos*/
function mostrar_completar_datos_modal(id_inversion, monto, id_solicitud, fase_inversion){
  id_inversion_modal = id_inversion;
  monto_inversion_actual = monto;
  id_solicitud_actual = id_solicitud;
  fase_inversion_actual = fase_inversion;
  $(CLASE_MODAL).show();
  $(ID_FASE_ACEPTAR).hide();
  $(ID_COMPLETA_DATOS).css('display', 'flex');
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_DECLARACION_FONDOS).hide();
  $(ID_CAMBIAR_MONTO_INVERSION).hide();
  $(ID_SIMULAR_INVERSION).hide();
  $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  $(ID_FASE_FINAL).hide();

  habilitarClicks();

  setPasoInversionistaActualFillInfo(2);

  $(".crece-flujo-inversionista-paso-tres, "+
  ".crece-flujo-inversionista-paso-tres span").prop("onclick", null).off("click");

  $(".crece-flujo-inversionista-paso-cuatro, "+
  ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");

}


/* Subir Transferencia */
function subir_transferencia_modal(id_inversion, monto, id_solicitud, fase_inversion){
  id_inversion_modal = id_inversion;
  monto_inversion_actual = monto;
  id_solicitud_actual = id_solicitud;
  fase_inversion_actual = fase_inversion;

  habilitarClicks();

  setPasoInversionistaActualPendingTransfer(4);

  llenar_datos_transferencia(id_inversion_modal, true)
  

}

/* Modal Transfer Submited */
function transfer_submited_modal(id_inversion, monto, id_solicitud, fase_inversion){
  id_inversion_modal = id_inversion;
  monto_inversion_actual = monto;
  id_solicitud_actual = id_solicitud;
  fase_inversion_actual = fase_inversion;

  habilitarClicks();

  setPasoInversionistaActualPendingTransfer(5);

  $("#input-cambiar-monto-inversion").prop( "disabled", true );

  llenar_datos_transferencia(id_inversion, false);

  llenar_datos_transferencia_subida(id_inversion);

  $(CLASE_MODAL).show();
  $(ID_FASE_ACEPTAR).hide();
  $(ID_COMPLETA_DATOS).hide();
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_DECLARACION_FONDOS).hide();
  $(ID_CAMBIAR_MONTO_INVERSION).hide();
  $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  $(ID_FASE_FINAL).css('display', 'flex');
  

}

function llenar_datos_transferencia_subida(id_inversion){
  $.ajax({
    url: "/transferencia/transferencia/"+id_inversion+"/",
    type: "GET",
    dataType: 'json',
    success: function(res){
      url_documento = res.data.url_documento;
      nombre_documento = url_documento.split("/");
      nombre_documento = nombre_documento[nombre_documento.length-1];
      $("#labelDocumentoTransferencia").html('<a target="_blank" rel="noopener noreferrer" href="/'+url_documento+'">'+nombre_documento+'</a>');
    }
  });
}

function llenar_datos_transferencia(id_inversion, mostrar_modal){
  $.ajax({
    url: "/registro/"+id_inversion+"/",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {

      $("#nombre_transferencia").html(res.data.nombre_completo_autor);
      $("#cuenta_transferencia").html(res.data.banco_transferencia);
      $("#texto_monto").html(res.data.monto_a_transferir.toFixed(2));
      $("#cedula_transferencia").html(res.data.cedula_solicitante);

      $("#subir_transferencia_wrapper .error-container").hide();

      if(mostrar_modal){
        $(CLASE_MODAL).show();
        $(ID_FASE_ACEPTAR).hide();
        $(ID_COMPLETA_DATOS).hide();
        $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
        $(ID_DECLARACION_FONDOS).hide();
        $(ID_CAMBIAR_MONTO_INVERSION).hide();
        $(ID_TABLA_SOLICITUD_VIGENTE).hide();
        $(ID_FASE_FINAL).hide();
      }
      
    },
    error: function(){
      
      $("#subir_transferencia_wrapper .error").html("No se pueden cargar datos.");
      $("#subir_transferencia_wrapper .error-container").css("display", "flex");

      if (mostrar_modal){
        $(CLASE_MODAL).show();
        $(ID_FASE_ACEPTAR).hide();
        $(ID_COMPLETA_DATOS).hide();
        $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
        $(ID_DECLARACION_FONDOS).hide();
        $(ID_CAMBIAR_MONTO_INVERSION).hide();
        $(ID_TABLA_SOLICITUD_VIGENTE).hide();
        $(ID_FASE_FINAL).hide();
      }
      
    }
  });
}

function enviarComprobanteTransferenciaModal(id_inversion){
  var myFormData = new FormData();
  const archivo = $('#comprobante_transferencia').prop('files')[0];
  myFormData.append("url_documento",archivo );

  myFormData.append("id_inversion", id_inversion);

  let nuevoNombre = renombrarArchivo(id_inversion, archivo.name);

  $.ajax({
      url: '/inversionista/comprobante_transferencia/'+nuevoNombre,  
      type: 'POST',
      processData: false,
      contentType: false,
      dataType : 'json',
      data: myFormData,
      success: function () {
        $('#comprobante_transferencia').val('')
        $(CLASE_MODAL).show();
        $(ID_COMPLETA_DATOS).hide();
        $(ID_FASE_FINAL).css('display', 'flex');
        $(ID_DECLARACION_FONDOS).hide();
        $(ID_SUBIR_TRANSFERENCIA).hide();
        $(ID_CAMBIAR_MONTO_INVERSION).hide();
        $(ID_TABLA_SOLICITUD_VIGENTE).hide();
      },
      error: function(){
          $("#subir_transferencia_wrapper .error").html("No se pudo cargar el archivo. Intente de nuevo.");
          $("#subir_transferencia_wrapper .error-container").css("display", "flex");
      }
  });
}

$("#enviar_transferencia").click(function(){
  if($('#comprobante_transferencia').prop('files')[0]){
    $("#subir_transferencia_wrapper .error-container").hide();
    enviarComprobanteTransferenciaModal(id_inversion_modal);
  }
  else if ($("#labelDocumentoTransferencia a").length > 0){
    $("#subir_transferencia_wrapper .error-container").hide();
    $('#comprobante_transferencia').val('')
    $(CLASE_MODAL).show();
    $(ID_COMPLETA_DATOS).hide();
    $(ID_FASE_FINAL).css('display', 'flex');
    $(ID_DECLARACION_FONDOS).hide();
    $(ID_SUBIR_TRANSFERENCIA).hide();
    $(ID_CAMBIAR_MONTO_INVERSION).hide();
    $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  }
  else{
    $("#subir_transferencia_wrapper .error").html("Suba una foto del comprobante de su transferencia.");
    $("#subir_transferencia_wrapper .error-container").css("display", "flex");
  }
});

function recargarSeccion(){
  var url = window.location.hash;
  var hash = url.substring(url.indexOf('#')+1);

  switch (hash){
    case "todas":
      $("#todas_las_oportunidades").trigger("click");
      break;
    
    case "pendientes":
      $("#oportunidades_pendientes").trigger("click");
      break;
    case "por_fondear":
      $("#oportunidades_por_fondear").trigger("click");
      break;
    case "vigentes":
      $("#oportunidades_vigentes").trigger("click");
      break;
    case "terminadas":
      $("#oportunidades_terminadas").trigger("click");
      break;
    default:
      break;
  }
}

/*Seccion finalizar inversion */
$("#finalizar_inversion").click(function(){
  $(CLASE_MODAL).hide();
  $(ID_FASE_ACEPTAR).hide();
  $(ID_COMPLETA_DATOS).hide();
  $(ID_FASE_FINAL).hide();
  $(ID_DECLARACION_FONDOS).hide();
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_CAMBIAR_MONTO_INVERSION).hide();
  $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  recargarSeccion();
});

$(".crece-modal-container-cerrar, .crece-modal-container-cerrar *").click(function(){
  $(CLASE_MODAL).hide();
  $(ID_FASE_ACEPTAR).hide();
  $(ID_COMPLETA_DATOS).hide();
  $(ID_FASE_FINAL).hide();
  $(ID_DECLARACION_FONDOS).hide();
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_CAMBIAR_MONTO_INVERSION).hide();
  $(ID_SIMULAR_INVERSION).hide();
  $(ID_TABLA_SOLICITUD_VIGENTE).hide();
  $("#crece-modal-imagen-solicitud").hide();

  // var a = window.location.href;
  // let referencia = a.split('#')[1]
  // if (referencia === "inversion_creada"){
  //   window.location = "/inversionista/dashboard/"
  // }
  $("#aceptar-inversion-button-invertir").unbind()
  $("#simular-inversion-boton-invertir").unbind()


  recargarSeccion();

});

$(".crece-modal").click(function(e) {

  let id_event = e.target.id;

  if(id_event === "aceptar-inversion-modal-dashboard" ||
  id_event === "completar_datos_wrapper" ||
  id_event === "crece-declaracion-body-id" ||
  id_event === "subir_transferencia_wrapper"){
    $(CLASE_MODAL).hide();
    $(ID_FASE_ACEPTAR).hide();
    $(ID_COMPLETA_DATOS).hide();
    $(ID_FASE_FINAL).hide();
    $(ID_DECLARACION_FONDOS).hide();
    $(ID_SUBIR_TRANSFERENCIA).hide();
    $(ID_CAMBIAR_MONTO_INVERSION).hide();
    $(ID_TABLA_SOLICITUD_VIGENTE).hide();

    $("#aceptar-inversion-button-invertir").unbind()
    $("#simular-inversion-boton-invertir").unbind()

    recargarSeccion();

  }

});

function habilitarClicks(){

  $(".crece-flujo-inversionista-paso-uno, "+
  ".crece-flujo-inversionista-paso-uno span").prop("onclick", null).off("click");

  $(".crece-flujo-inversionista-paso-dos, "+
  ".crece-flujo-inversionista-paso-dos span").prop("onclick", null).off("click");

  $(".crece-flujo-inversionista-paso-tres, "+
  ".crece-flujo-inversionista-paso-tres span").prop("onclick", null).off("click");

  $(".crece-flujo-inversionista-paso-cuatro, "+
  ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");


  $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
    ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
      crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);
      habilitarLinksAnteriores(fase_inversion_actual,1);
    });

    $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
    ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
      $(CLASE_MODAL).show();
      $(ID_FASE_ACEPTAR).hide();
      $(ID_SUBIR_TRANSFERENCIA).hide();
      $(ID_COMPLETA_DATOS).css('display', 'flex');
      $(ID_DECLARACION_FONDOS).hide();
      $(ID_CAMBIAR_MONTO_INVERSION).hide();
      $(ID_TABLA_SOLICITUD_VIGENTE).hide();
      $(ID_FASE_FINAL).hide();
      habilitarLinksAnteriores(fase_inversion_actual,2);
    });

    $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres, "+
    ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres span").click( function(){
      $(CLASE_MODAL).show();
      $(ID_FASE_ACEPTAR).hide();
      $(ID_SUBIR_TRANSFERENCIA).hide();
      $(ID_COMPLETA_DATOS).hide();
      $(ID_DECLARACION_FONDOS).css('display', 'flex');
      $(ID_CAMBIAR_MONTO_INVERSION).hide();
      $(ID_TABLA_SOLICITUD_VIGENTE).hide();
      $(ID_FASE_FINAL).hide();
      habilitarLinksAnteriores(fase_inversion_actual,3);
    });

    $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro, "+
    ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro span").click( function(){
      $(CLASE_MODAL).show();
      $(ID_FASE_ACEPTAR).hide();
      $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
      $(ID_COMPLETA_DATOS).hide();
      $(ID_DECLARACION_FONDOS).hide();
      $(ID_CAMBIAR_MONTO_INVERSION).hide();
      $(ID_FASE_FINAL).hide();

      $("#subir_transferencia_wrapper .error-container").hide();

      habilitarLinksAnteriores(fase_inversion_actual,4);
    });
}

function habilitarLinksAnteriores(fase_inversion, fase_click){
  if(fase_inversion === "FILL_INFO"){

    switch (fase_click) {
      case 1:
          setPasoInversionistaActualFillInfo(1);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).css('display', 'flex');
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualFillInfo(2);
          
        });
    
        $(".crece-flujo-inversionista-paso-tres, "+
        ".crece-flujo-inversionista-paso-tres span").prop("onclick", null).off("click");

        $(".crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");
        break;

      case 2:
          setPasoInversionistaActualFillInfo(2);

          $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
          ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
            crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);
  
            setPasoInversionistaActualFillInfo(1);
          });
      
          $(".crece-flujo-inversionista-paso-tres, "+
        ".crece-flujo-inversionista-paso-tres span").prop("onclick", null).off("click");
  
          $(".crece-flujo-inversionista-paso-cuatro, "+
          ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");
          break;

    }

  }

  else if(fase_inversion === "ORIGIN_MONEY"){

    switch (fase_click) {
      case 1:
        setPasoInversionistaActualOrigin(1);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).css('display', 'flex');
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualOrigin(2);
          
        });
    
        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).css('display', 'flex');
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualOrigin(3);
        });

        $(".crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");
        break;

      case 2:
          setPasoInversionistaActualOrigin(2);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
          crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);

          setPasoInversionistaActualOrigin(1);
        });
    
        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).css('display', 'flex');
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualOrigin(3);
        });

        $(".crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");
        break;

      case 3:
        setPasoInversionistaActualOrigin(3);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
          crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);

          setPasoInversionistaActualOrigin(1);
        });

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).css('display', 'flex');
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualOrigin(2);
        });

        $(".crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");
        break;
    }

  }

  else{ //PENDING_TRANSFER o TRANSFER_SUBMITED

    switch (fase_click){
      case 1:

        setPasoInversionistaActualPendingTransfer(1);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).css('display', 'flex');
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualPendingTransfer(2);
          
        });
    
        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).css('display', 'flex');
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualPendingTransfer(3);
        });
    
        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          $("#subir_transferencia_wrapper .error-container").hide();

          setPasoInversionistaActualPendingTransfer(4);
        });
        break;
      
      case 2:

          setPasoInversionistaActualPendingTransfer(2);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
          crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);

          setPasoInversionistaActualPendingTransfer(1);
        });
    
        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).css('display', 'flex');
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualPendingTransfer(3);
        });
    
        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          $("#subir_transferencia_wrapper .error-container").hide();

          setPasoInversionistaActualPendingTransfer(4);
        });

        break;

      case 3:
          setPasoInversionistaActualPendingTransfer(3);

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
          crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);

          setPasoInversionistaActualPendingTransfer(1);
        });

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).css('display', 'flex');
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualPendingTransfer(2);
        });

        $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro, "+
        ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-cuatro span").click( function(){
          $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_SUBIR_TRANSFERENCIA).css('display', 'flex');
          $(ID_COMPLETA_DATOS).hide();
          $(ID_DECLARACION_FONDOS).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_FASE_FINAL).hide();

          setPasoInversionistaActualPendingTransfer(4);
        });

        break;

      case 4:
          setPasoInversionistaActualPendingTransfer(4);

  
          $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno, "+
          ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-uno span").click( function(){
            crear_modal_cambiar_monto_inversion(id_solicitud_actual,'cambiar-monto-inversion-inicio',monto_inversion_actual, id_inversion_modal);

            setPasoInversionistaActualPendingTransfer(1);
          });
  
          $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos, "+
          ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-dos span").click( function(){
            $(CLASE_MODAL).show();
            $(ID_FASE_ACEPTAR).hide();
            $(ID_SUBIR_TRANSFERENCIA).hide();
            $(ID_COMPLETA_DATOS).css('display', 'flex');
            $(ID_DECLARACION_FONDOS).hide();
            $(ID_CAMBIAR_MONTO_INVERSION).hide();
            $(ID_FASE_FINAL).hide();

            setPasoInversionistaActualPendingTransfer(2);
          });
  
          $(".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres, "+
          ".crece-flujo-inversionista-paso-completado.crece-flujo-inversionista-paso-tres span").click( function(){
            $(CLASE_MODAL).show();
            $(ID_FASE_ACEPTAR).hide();
            $(ID_SUBIR_TRANSFERENCIA).hide();
            $(ID_COMPLETA_DATOS).hide();
            $(ID_DECLARACION_FONDOS).css('display', 'flex');
            $(ID_CAMBIAR_MONTO_INVERSION).hide();
            $(ID_FASE_FINAL).hide();

            setPasoInversionistaActualPendingTransfer(3);
            
          });
  
          break;

    }
  }
}

function setPasoInversionistaActualPendingTransfer(pasoClickeado){
  switch (pasoClickeado){
    case 1:

      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-selected");

      break;

    case 2:
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-selected");
      break;

    case 3:
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-selected");
      break;

    case 4:
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").addClass("crece-flujo-inversionista-paso-selected");
      break;

    case 5:
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      break;
  }
}

function setPasoInversionistaActualOrigin(pasoClickeado){
  switch (pasoClickeado){
    case 1:

      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");

      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-selected");

      break;

    case 2:
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");

      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-selected");
      break;

    case 3:
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");

      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-tres").addClass("crece-flujo-inversionista-paso-selected");
      break;
  }
}

function setPasoInversionistaActualFillInfo(pasoClickeado){

  switch (pasoClickeado){
    case 1:

      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-completado");

      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-selected");

      break;

    case 2:
      $(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");

      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-completado");
      
      $(".crece-flujo-inversionista-paso-tres").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-cuatro").removeClass("crece-flujo-inversionista-paso-selected");
      $(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");

      $(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-completado");
      $(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-selected");
      break;
  }
}