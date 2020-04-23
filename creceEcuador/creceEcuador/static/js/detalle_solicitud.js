let HOST = "http://localhost:8000/"
let RUTA_SOLICITUDES = HOST+"solicitudes/";


$( document ).ready(function() {
    let id_oportunidad = obtenerId();

    if(id_oportunidad){
        console.log(id_oportunidad);
        obtenerDetallesOportunidadInversion(id_oportunidad);
    }
    //
});

function obtenerId(){
    var dicQuerystring = obtenerMapaQueryString();
    return dicQuerystring.id;

}

function obtenerMapaQueryString(){
    return decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((values, [ key, value ]) => {
        values[ key ] = value
        return values
    }, {})
}

function obtenerDetallesOportunidadInversion(id_oportunidad){
    $.ajax({
        url: RUTA_SOLICITUDES+id_oportunidad+'/',
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            console.log("success");
            console.log(res.data.length);
            
            if (res.data){
                console.log(res.data);
                crearDetalleInversion(res.data);
            }  
        },
        error: function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            alert("Solicitud no encontrada.");
            console.log(err.message);
        }
    });
}

function crearDetalleInversion(oportunidad) {
    var html_string = '<div class="container">'+
    ''+
    '                        <div class="crece-detalle-operaciones-titulo">'+
    '                            <h1>'+
    '                                '+oportunidad.autor+', '+oportunidad.categoria+
    '                            </h1>'+
    '                        </div>'+
    ''+
    '                        <div class="crece-detalle-operaciones-descripcion">'+
    '                            <div class="row">'+
    '                                <div class="col-5 crece-detalle-operaciones-descripcion-img-container">'+
    '                                    <img src='+oportunidad.imagen_url+'>'+
    '                                </div>'+
    '                                <div class="col-7">'+
    '                                    <h5>'+
    '                                     '+oportunidad.operacion+
    '                                    </h5>'+
    '                                   <h6><a href="'+oportunidad.url+'">Sitio web</a></h6>'+
    '                                </div>'+
    '                            </div>'+
    '                        </div>'+
    ''+
    '                        <div class="crece-detalle-operaciones-cifras">'+
    '                            <div class="row">'+
    '                                <div class="col-4">'+
    '                                    <div class="crece-detalle-operaciones-cifras-cuadro-lateral allign-center">'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-lateral-titulo">'+
    '                                            <h6>Monto</h6>'+
    '                                        </div>'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-lateral-cifra">'+
    '                                            <h1>$'+ oportunidad.monto+'</h1>'+
    '                                        </div>'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-lateral-porcentaje-fundado">'+
    '                                            <h6>Operación</h6>'+
    '                                            <div class="crece-detalle-operaciones-cifras-cuadro-lateral-porcentaje-fundado-barra">'+
    '                                               '+ decimalAPorcentaje(oportunidad.porcentaje_financiado)+'%'+
    '                                            </div>'+
    '                                        </div>'+
    '                                    </div>'+
    '                                </div>'+
    '                                <div class="col-4">'+
    '                                    <div class="crece-detalle-operaciones-cifras-cuadro-central">'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-central-titulo">'+
    '                                            <h6>Plazo</h6>'+
    '                                        </div>'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-central-cifra">'+
    '                                            <h1>'+oportunidad.plazo+'</h1>'+
    '                                        </div>'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-lateral-subtitulo">'+
    '                                            <h6>Días</h6>'+
    '                                        </div>'+
    '                                    </div>'+
    '                                </div>'+
    '                                <div class="col-4">'+
    '                                    <div class="crece-detalle-operaciones-cifras-cuadro-lateral">'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-lateral-titulo">'+
    '                                            <h6>TIR</h6>'+
    '                                        </div>'+
    '                                        <div class="crece-detalle-operaciones-cifras-cuadro-lateral-cifra">'+
    '                                            <h1>'+oportunidad.tir+'%</h1>'+
    '                                        </div>'+
    '                                    </div>'+
    '                                </div>'+
    '                            </div>'+
    '                        </div>'+
    ''+
    '                        <div class="crece-detalle-operaciones-historial">'+
    '                            <div class="row">'+
    '                                <div class="col-12 crece-detalle-operaciones-operaciones-historial-titulo">'+
    '                                    <h3>Historial del Solcitante</h3>'+
    '                                </div>'+
    '                            </div>'+
    '                            <div class="row">'+
    '                                <div class="col-9">'+
    '                                    <h2>'+
    '                                        Solicitudes Totales:  2'+
    '                                    </h2>'+
    '                                    <h2>'+
    '                                        Operaciones Terminadas:  1'+
    '                                    </h2>'+
    '                                    <h2>'+
    '                                        Días de mora:  0'+
    '                                    </h2>'+
    '                                </div>'+
    '                                <div class="col 3">'+
    '                                    <div class="col-12">'+
    '                                        <h3>'+
    '                                            75%'+
    '                                        </h3>'+
    '                                    </div>'+
    '                                    <div class="col-12">'+
    '                                        <h6>'+
    '                                            Calificación'+
    '                                        </h6>'+
    '                                    </div>'+
    '                                </div>'+
    '                            </div>'+
    '                        </div>'+
    ''+
    '                        <div class="crece-detalle-operaciones-boroninvertir">'+
    '                            <button>'+
    '                                Invertir'+
    '                            </button>'+
    '                        </div>'+
    '                    </div>';


    $(".crece-detalle-operaciones").html(html_string) ;
    console.log("html seteado")
}


function decimalAPorcentaje(decimal){
    return decimal.split(".")[1];
}