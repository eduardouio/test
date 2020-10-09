let RUTA_ENVIAR_ENCUESTA_PREFERENCIA_PERSONA = '/inversionista/encuesta_preferencia_persona/'

let sidebarMostrado;

let contratoAcUsoFirmado;

  $(".crece-menu-toggle").click(function(){

      if($(window).width() > 768){
         if(sidebarMostrado){
             $("#sidebar").hide();
             $("#sidebar").css("margin-left", "-250px");
             $(".content").css("padding-left", "0px");
             $(".content-block-background").hide()
             sidebarMostrado = false;
         }
         else {
             $("#sidebar").show();
             $("#sidebar").css("margin-left", "0px");
             $(".content").css("padding-left", "250px");
             $(".content-block-background").hide()
             sidebarMostrado = true;
         }
     }   
     else {
         if(sidebarMostrado){
             $("#sidebar").hide();
             $("#sidebar").css("margin-left", "-250px");
             $(".content").css("padding-left", "0px");
             $(".content-block-background").hide()
             sidebarMostrado = false;
         }
         else {
             $("#sidebar").show();
             $("#sidebar").css("margin-left", "0px");
             $(".content").css("padding-left", "0px");
             $(".content-block-background").show()
             sidebarMostrado = true;
         }
     }

  });

  $("#crece_ocultar_sidebar, #crece_ocultar_sidebar svg").click(function(){
     $("#sidebar").hide();
     $("#sidebar").css("margin-left", "-250px");
     $(".content").css("padding-left", "0px");
     $(".content-block-background").hide()
     sidebarMostrado = false;

  });

  $(document).ready(function() {
     initSidebar();
     contratoAcUsoFirmado = $("#sidebar").attr("data-firmar-contrato");
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
     $(".content-block-background").hide()
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
        
});

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
