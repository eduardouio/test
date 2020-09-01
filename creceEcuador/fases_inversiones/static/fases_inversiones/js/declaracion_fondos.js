let RUTA_ACEPTAR_DECLARACION= "/registro/aceptar_declaracion_fondos/"
let URL_SIGUIENTE_DECLARACION = "/registro/subir_transferencia/?id_inversion="
let URL_CAMBIO_FASE_DECLARACION = "/registro/step_four_inversion/?id_inversion="



function aceptar_declaracion_fondos() {
    // body...
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            var file = new Blob([this.response], { 
                                    type: 'application/pdf' 
            });

            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(file);
            link.download = "Contrato.pdf";
            document.body.appendChild(link);
            link.click();
            cambio_fase_inversion(obtenerIdInversion());

        }
    };
    xhttp.open("POST", RUTA_ACEPTAR_DECLARACION, true);
    //xhttp.setRequestHeader("Content-type", "text/html;charset=UTF-8");
    xhttp.send();


}

function cambio_fase_inversion(id_inversion){
    $.ajax({
        type: 'POST',
        url: URL_CAMBIO_FASE_DECLARACION+id_inversion, 
        data: {},
        success: function(resultData) { 
            window.location.href = URL_SIGUIENTE_DECLARACION+id_inversion;
        },
        error: function(){
            alert("Error en el cambio de estado de la inversión");
        }
    });
}

function obtenerIdInversion(){
  var dicQuerystring = obtenerMapaQueryString();
  return dicQuerystring.id_inversion;

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