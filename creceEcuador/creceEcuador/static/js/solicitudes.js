let HOST = "http://localhost:8000/"
let RUTA_SOLICITUDES = HOST+"solicitudes/"
let indice_opcion_actual = 0;
let CANTIDAD_OPCIONES_MOSTRADAS = 9;

$( document ).ready(function() {
    obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
});

$(".crece-operaciones-siguiente").click( function() {
    obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
});
$(".crece-operaciones-anterior").click( function() {
    console.log("indice opcion antes" + indice_opcion_actual);
    if(indice_opcion_actual > CANTIDAD_OPCIONES_MOSTRADAS){
        indice_opcion_actual = indice_opcion_actual - CANTIDAD_OPCIONES_MOSTRADAS - CANTIDAD_OPCIONES_MOSTRADAS;
        console.log("indice opcion despues" + indice_opcion_actual);
        obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
    } 
});

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
    let string_operacion_mobile = "";

    $.each( data, function( indice, oportunidad ) {
        console.log( indice + ": " + oportunidad.id );

        let inicio_operacion = '<div class="col-sm-4 col-lg-3 crece-operaciones-col">';

        let inicio_operacion_mobile = '<div class="col crece-operaciones-col">';

        // header de la operacion
        let header_operacion = '<div class="operacion-header">';
        let imagen_operacion = ' <img src="'+ oportunidad.imagen_url+ '">';
        let cierre_header_operacion = '</div>';

        let header = header_operacion + imagen_operacion + cierre_header_operacion;
        
        let inicio_autor_operacion = '<div class="operacion-autor">';
        let nombre_autor_operacion = '<p><strong>' + oportunidad.autor + '</strong></p>';
        let tipo_autor = '<p>'+oportunidad.tipo_persona+'</p>'
        let cierre_autor_operacion = '</div>';

        let autor = inicio_autor_operacion + nombre_autor_operacion + tipo_autor + cierre_autor_operacion;


        //Detalle de la operacion
        let inicio_operacion_detalle = '<div class="operacion-detalle"><div class="operacion-detalle-grid">';
            
        let inicio_detalle_id = '<div class="row1-col1"><div class="detalle-1"><strong>ID</strong></div>';
        let detalle_id = '<div>' + oportunidad.id + '</div>';
        let cierre_detalle_id = '</div>';

        let id_autor = inicio_detalle_id + detalle_id + cierre_detalle_id;

        let inicio_detalle_solicita = '<div class="row1-col2"><div class="detalle-3"><strong>Solicita</strong></div>';
        let detalle_solicita = '<div>$' + oportunidad.monto + '</div>';
        let cierre_detalle_solicita = '</div>';

        let monto_solicita = inicio_detalle_solicita + detalle_solicita + cierre_detalle_solicita;

        let inicio_detalle_tir = '<div class="row1-col3"><div class="detalle-4"><strong>Tasa (TIR)</strong></div>';
        let detalle_tir = '<div>' + oportunidad.tir + '%</div>';
        let cierre_tir = '</div>';

        let tir = inicio_detalle_tir + detalle_tir + cierre_tir;

        let inicio_detalle_cap_trabajo = '<div class="row2-col1"><div class="detalle-1"><strong>Tipo</strong></div>';
        let detalle_cap_trabajo = '<div>'+ oportunidad.tipo_credito+'</div>';
        let cierre_cap_trabajo = '</div>';

        let cap_trabajo = inicio_detalle_cap_trabajo + detalle_cap_trabajo + cierre_cap_trabajo;

        let inicio_detalle_industria = '<div class="row2-col2"><div class="detalle-1"><strong>Industria</strong></div>';
        let detalle_industria = '<div>'+ oportunidad.categoria+'</div>';
        let cierre_industria = '</div>';

        let industria = inicio_detalle_industria + detalle_industria + cierre_industria;


        let titulo_historial_solicitante = '<div class="operacion-historia-titulo"><strong>Historial del solicitante en CRECE</strong></div>';             
        
        let inicio_historial_pagados = '<div class="operacion-historia-1"><div><strong>Pagados</strong></div>';
        let detalle_historial_pagados = '<div>1/3</div>'; 
        let cierre_historial_pagados = '</div>';

        let historial_pagado = titulo_historial_solicitante + inicio_historial_pagados + detalle_historial_pagados + cierre_historial_pagados;

        let inicio_historial_vigentes = '<div class="operacion-historia-2"><div><strong>Vigentes</strong></div>';
        let detalle_historial_vigentes = '<div>2/3</div>';
        let cierre_historial_vigentes = '</div>';

        let vigentes = inicio_historial_vigentes + detalle_historial_vigentes + cierre_historial_vigentes;

        let inicio_historial_puntualidad = '<div class="operacion-historia-3"><div><strong>Puntualidad</strong></div>';
        let detalle_historial_puntualidad = '<div>95%</div>';
        let cierre_historial_puntualidad = '</div>';

        let puntualidad = inicio_historial_puntualidad + detalle_historial_puntualidad + cierre_historial_puntualidad;

        let cierre_detalle = '</div></div>';

        let detalle = inicio_operacion_detalle + id_autor + monto_solicita + tir + cap_trabajo + industria + historial_pagado + vigentes + puntualidad + cierre_detalle; 


        //progreso de la operacion
        let inicio_progreso_operacion = '<div class="operacion-historia-progreso">';

        let detalle_porcentaje = '<div class="operacion-historia-financiado">' + decimalAPorcentaje(oportunidad.porcentaje_financiado) + '% financiado</div>';

        let enlace_mas_detalles = '<div class="operacion-historia-enlace">Ver</div>'; //TODO agregar enlace real

        let cierre_progreso_operacion = '</div>';

        let progreso_operacion = inicio_progreso_operacion + detalle_porcentaje + enlace_mas_detalles + cierre_progreso_operacion;

        let cierre_operacion = '</div>';


        //Operacion completa 
        let operacion_completa = inicio_operacion + header + autor + detalle + progreso_operacion + cierre_operacion;
        let operacion_completa_mobile = inicio_operacion_mobile + header + autor + detalle + progreso_operacion + cierre_operacion;

        string_operacion += operacion_completa;
        string_operacion_mobile += operacion_completa_mobile; 
    });

    $("#crece-operaciones-contenido .row").html(string_operacion);
    $("#crece-operaciones-contenido-mobile .row").html(string_operacion_mobile);

}

function decimalAPorcentaje(decimal){
    return decimal.split(".")[1];
}