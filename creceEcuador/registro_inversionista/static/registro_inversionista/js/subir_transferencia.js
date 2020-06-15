$('.crece-confirmar-transferencia-formulario form').submit(function(e){
    e.preventDefault();
    
    if(checkInputs()){
        enviarComprobanteTransferencia();
    }
});

function checkInputs() {
    var es_valido = true;
    $('input').filter('[required]').each(function() {
      if ($(this).val() === '') {
        alert("llene todos los campos");
        es_valido = false;
        return false;
      }
    });
    return es_valido;
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


function enviarComprobanteTransferencia(){
    var myFormData = new FormData();
    const archivo = $('#comprobante_transferencia').prop('files')[0];
    myFormData.append("url_documento",archivo );

    let id_inversion = obtenerIdInversion();

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
            alert("Save Complete") 
        },
        error: function(){
            alert("Archivo incorrecto. Intente de nuevo");
        }
    });
}

function renombrarArchivo(nombre_nuevo, nombre_anterior_con_extension){
    var arreglo_nombre = nombre_anterior_con_extension.split(".");
    var extension = arreglo_nombre[arreglo_nombre.length - 1];
    return nombre_nuevo + "." + extension;
}