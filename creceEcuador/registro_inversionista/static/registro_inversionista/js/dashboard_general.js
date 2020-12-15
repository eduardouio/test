let RUTA_ENVIAR_ENCUESTA_PREFERENCIA_PERSONA = '/inversionista/encuesta_preferencia_persona/'

let sidebarMostrado;

let contratoAcUsoFirmado;

  $(".crece-menu-toggle").click(function(){

      if($(window).width() > 768){
         if(sidebarMostrado){
             $("#sidebar").show();
             $("#sidebar").css("min-width", "51px");
             $("#li_sidebar_desplegable").hide();
             $(".content").css("padding-left", "51px");
             $(".content-block-background").hide();
             $(".sidebar-outer-li").show();
             $(".sidebar-span").hide();
             $(".crece-usuario-nombre").hide();
             sidebarMostrado = false;
         }
         else {
             $("#sidebar").show();
             $("#sidebar").css("margin-left", "0px");
             $("#li_sidebar_desplegable").show();
             $("#sidebar").css("min-width", "250px");
             $(".content").css("padding-left", "250px");
             $(".content-block-background").hide();
             $(".sidebar-outer-li").hide();
             $(".sidebar-span").show();
             $(".crece-usuario-nombre").show();
             sidebarMostrado = true;
         }
     }   
     else {
         if(sidebarMostrado){
             $("#sidebar").hide();
             $("#sidebar").css("margin-left", "-250px");
             $("#sidebar").css("min-width", "250px");
             $(".content").css("padding-left", "0px");
             $("#li_sidebar_desplegable").show();
             $(".content-block-background").hide()
             $(".sidebar-outer-li").hide();
             $(".sidebar-span").show();
             $(".crece-usuario-nombre").show();
             sidebarMostrado = false;
         }
         else {
             $("#sidebar").show();
             $("#sidebar").css("margin-left", "0px");
             $("#sidebar").css("min-width", "250px");
             $("#li_sidebar_desplegable").show();
             $(".content").css("padding-left", "0px");
             $(".content-block-background").show();
             $(".sidebar-outer-li").hide();
             $(".sidebar-span").show();
             $(".crece-usuario-nombre").show();
             sidebarMostrado = true;
         }
     }

  });

  $("#crece_ocultar_sidebar, #crece_ocultar_sidebar svg").click(function(){
     $("#sidebar").hide();
     $("#sidebar").css("margin-left", "-250px");
     $(".content").css("padding-left", "0px");
     $(".content-block-background").hide();
     $(".sidebar-outer-li").hide();
     $("#li_sidebar_desplegable").show();
     $(".sidebar-span").show();
    $(".crece-usuario-nombre").show();
     sidebarMostrado = false;

  });

  function initListGridButtons(){
      $("#list-button").click(function(){
        $("#list-button").addClass("crece-oportunidades-button-group-selected");
        $("#list-button").removeClass("crece-oportunidades-button-group-not-selected");
        $("#grid-button").addClass("crece-oportunidades-button-group-not-selected");
        $("#grid-button").removeClass("crece-oportunidades-button-group-selected");

        $(".crece-oportunidades-list-container").css("display", "flex");
        $(".crece-oportunidades-container").hide();
      });
      $("#grid-button").click(function(){
        $("#grid-button").addClass("crece-oportunidades-button-group-selected");
        $("#grid-button").removeClass("crece-oportunidades-button-group-not-selected");
        $("#list-button").addClass("crece-oportunidades-button-group-not-selected");
        $("#list-button").removeClass("crece-oportunidades-button-group-selected");

        $(".crece-oportunidades-list-container").hide();
        $(".crece-oportunidades-container").css("display", "flex");
        
      });
  }

  $(document).ready(function() {
     initSidebar();
     initListGridButtons();
     contratoAcUsoFirmado = $("#sidebar").attr("data-firmar-contrato");

    $("#usuario_data_container *, .crece-usuario-imagen-seleccionada, .crece-usuario-imagen").click( function() {
        $(".crece-oportunidades").hide();
        $('#crece-detalle-operaciones-id').hide()
        $(".crece-perfil").show();
    
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "/static/registro_inversionista/css/registro.css"
            }).appendTo("head");
    
            inicializarVerPerfil();
    });

     $("#usuario_data_container *, .crece-usuario-imagen-seleccionada, .crece-usuario-imagen").click( function() {
        $(".crece-oportunidades").hide();
        $('#crece-detalle-operaciones-id').hide()
        $(".crece-perfil").show();
    
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "/static/registro_inversionista/css/registro.css"
         }).appendTo("head");
    
         inicializarVerPerfil();
    });
     
 });



  function initSidebar() {
     if($(window).width() > 768) {
         sidebarMostrado = true;
     }
     else {
         sidebarMostrado = false;
     }
 }

  $(".content-block-background").on("touchmove", function(e) {
     e.preventDefault();
 });

  $("#sidebar").on("touchmove", function(e) {
     e.preventDefault();
 });

  $(".content-block-background").click(function(){
     $("#sidebar").hide();
     $("#sidebar").css("margin-left", "-250px");
     $(".content").css("padding-left", "0px");
     $(".content-block-background").hide();
     $("footer").css("padding-left", "0px");
     $(".crece-dashboard-header").css("max-width", "100vw");
     sidebarMostrado = false;
 });



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

$(document).ready(function() {
    var next = getParameterByName('from_email')
    if (next){
        $(".crece-modal-container-cerrar").hide()
        $(".crece-modal").show();
        $("#crece-modal-pregunta-prefencia-1-id").css('display', 'flex');
        $("#crece-modal-simular-inversion-id").hide();
        $("#aceptar-inversion-modal-dashboard").hide();
        $("#subir_transferencia_wrapper").hide();
        $("#completar_datos_wrapper").hide();
        $("#crece-declaracion-body-id").hide();
        $("#cambiar-monto-inversion-modal-dashboard").hide();
    }

    if(getParameterByName('mostrar_detalle')){
        let solicitud_query = getParameterByName('id_solicitud');

        let id_usuario = $("#sidebar").attr("data-usuario");

        $.ajax({
            url: "/registro/"+solicitud_query+"/"+id_usuario+"/",
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res) {
                
                if (res.data){
                    let data = res.data;
                    ver_detalle_solicitud(data.fase_inversion, data.id,data.solicitud.id,data.monto);
                }  
                else{
                    ver_detalle_solicitud('SIMULAR',undefined,solicitud_query);
                }
            },
            error: function(xhr, status, error) {
                ver_detalle_solicitud('SIMULAR',undefined,solicitud_query);
            }
        });
    }

    if(getParameterByName('modal_simular')){
        let solicitud_query = getParameterByName('id_solicitud');

        let id_usuario = $("#sidebar").attr("data-usuario");

        $.ajax({
            url: "/registro/"+solicitud_query+"/"+id_usuario+"/",
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res) {
                
                if (res.data){
                    let data = res.data;
                    ver_detalle_solicitud(data.fase_inversion, data.id,data.solicitud.id,data.monto);
                    waitForElementToDisplay(".crece-detalle-operaciones-invierte-botones-azul a", function(){
                        $(".crece-detalle-operaciones-invierte-botones-azul a").trigger("click");
                    },200,10000);
                    
                }  
                else{
                    ver_detalle_solicitud('SIMULAR',undefined,solicitud_query);
                    waitForElementToDisplay("#input-monto-detalle-solicitud", function(){
                        $("#input-monto-detalle-solicitud").val("350");
                        crear_modal_simulacion_inversion(solicitud_query, 'FALSE');
                    },200,5000);
                    
                    
                }
            },
            error: function(xhr, status, error) {
                ver_detalle_solicitud('SIMULAR',undefined,solicitud_query);
                waitForElementToDisplay("#input-monto-detalle-solicitud", function(){
                    $("#input-monto-detalle-solicitud").val("350");
                    crear_modal_simulacion_inversion(solicitud_query, 'FALSE');
                },200,5000);
            }
        });
    }
        
});

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector(selector) != null) {
        callback();
        return;
        }
        else {
        setTimeout(function () {
            if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
            return;
            loopSearch();
        }, checkFrequencyInMs);
        }
    })();
}

function siguiente_pregunta_preferencia(actual) {
    // body...
    let id_pregunta_preferencia_actual = "#crece-modal-pregunta-prefencia-"+actual+"-id"
    let id_pregunta_preferencia_siguiente = "#crece-modal-pregunta-prefencia-"+(actual+1)+"-id"
    $(id_pregunta_preferencia_actual).hide();
    $(id_pregunta_preferencia_siguiente).css('display', 'flex');
}

function enviar_preguntas_preferencia() {
    // body...
    let respuestas = []
    $(".respuesta-selected").each(function (){
        let id = $(this).attr("id")
        let id_respuesta = id.split("-")[2]
        respuestas.push(id_respuesta)
    });
    let inversionista = $(".active.selectable").attr("data-usuario")
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {


                window.location.href = '/inversionista/dashboard/'


        }else {

        }
    };
    xhttp.open("POST", RUTA_ENVIAR_ENCUESTA_PREFERENCIA_PERSONA, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
                                "inversionista": inversionista,
                                "lista_respuestas": respuestas,
                            })
                );
}


$(".grid-item").click(function() {
    // body...
    

    let classname = $(this).attr('class')

    if (classname === 'grid-item active respuesta-selected'){
        $(this).removeClass("active respuesta-selected")
    }
    else{
        $(this).addClass("active respuesta-selected")
    }

})


$(".grid-onlyitem-3").click(function() {
    // body...
    

    let classname = $(this).attr('class')

    $(".grid-onlyitem-3").each(function (){
        $(this).removeClass("active respuesta-selected" );
    });
        $(this).addClass("active respuesta-selected")
    

})


$(".grid-onlyitem-4").click(function() {
    // body...
    

    let classname = $(this).attr('class')

    $(".grid-onlyitem-4").each(function (){
        $(this).removeClass("active respuesta-selected");
    });
        $(this).addClass("active respuesta-selected")
    

})

 function obtener_ruta_ac_uso(){
     let pk = $("#sidebar").attr("data-usuario");

     $.ajax({
        type: 'GET',
        url: "/inversionista/ultimo_ac_uso/"+pk+"/",
        success: function(resultData) { 
            let linkAContrato = resultData.data.contrato;
            $("#link_ac_esp_modal").attr("href", linkAContrato);

            $("#link_ac_esp_modal_cambiar").attr("href", linkAContrato);
        },
        error: function(e){

        }
        
     });
 }
