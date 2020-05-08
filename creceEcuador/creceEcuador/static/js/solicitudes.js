let RUTA_SOLICITUDES = "/solicitudes/"
let RUTA_DETALLE_SOLICITUD ="/detalle_solicitud/"
let indice_opcion_actual = 0;
let CANTIDAD_OPCIONES_MOSTRADAS = 9;

$( document ).ready(function() {
    obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
});

$(".crece-oportunidades-siguiente").click( function() {
    obtenerOportunidadesInversion(indice_opcion_actual, CANTIDAD_OPCIONES_MOSTRADAS);
});
$(".crece-oportunidades-anterior").click( function() {
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

    $.each( data, function( indice, oportunidad ) {
        console.log( indice + ": " + oportunidad.id );

        string_operacion += stringSolicitud(oportunidad);
    });

    $(".crece-oportunidades-container").html(string_operacion);

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

function stringSolicitud(oportunidad){

    var tarjeta_oportunidad = '<div class="col-xl-4 col-lg-6 col-12">'+
    '                                    <div class="row justify-content-center">'+
    '                                        <div class="crece-oportunidades-contenedor" onclick="window.location.href = \' '+rutaDetalleSolicitud(oportunidad.id)+'\';">'+
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
    '                                                                <strong>$'+decimalAEntero(oportunidad.monto)+'</strong><br>'+
    '                                                                $'+calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado)+' recolectados de $'+decimalAEntero(oportunidad.monto)+ //TODO calcular porcentaje recolectado
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
    '                                                                </p>'+
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