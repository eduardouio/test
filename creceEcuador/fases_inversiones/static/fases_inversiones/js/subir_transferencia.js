const TEXTO_DEFAULT_LABEL_TRANSF = "Archivos PDF, JPG o PNG";
const TEXTO_LARGE_FILE_SIZE = TEXTO_DEFAULT_LABEL_TRANSF+'</br><span style="color:red;">El archivo debe ser de 4MB o menos.</span>';
let URL_SIGUIENTE_SUBIR_TRANSFERENCIA = "/registro/fase_final/?id_inversion=";


$(document).ready(function(){
    let monto = $("#texto_monto").attr("data-monto");
    $("#texto_monto").html(numeroConComas(monto));
});


$("#comprobante_transferencia").on('change', function() {
    if(this.files[0]){
        var filesize = ((this.files[0].size/1024)/1024).toFixed(4); // MB

        if (this.files[0].name != "item" && typeof this.files[0].name != "undefined" && filesize <= 4) { 
            $("#labelDocumentoTransferencia").html(this.files[0].name);
        }

        else{
            $("#comprobante_transferencia").val("");
            $("#labelDocumentoTransferencia").html(TEXTO_LARGE_FILE_SIZE);

        }

    }
    else{
        $("#labelDocumentoTransferencia").html(TEXTO_DEFAULT_LABEL_TRANSF);
    }
    
});

$("#selectBancoTransferencia").on('change', function(){
    let url = url_bancos[this.value]
    if(url){
        window.open(url);
    }
        
});

function checkInputsTransferencia() {
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
            $('#comprobante_transferencia').val('')
            window.location.href = URL_SIGUIENTE_SUBIR_TRANSFERENCIA+id_inversion;
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

function numeroConComas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if(parts[1] && parts[1].length === 1){
        parts[1] = parts[1] + "0"
    }
    return parts.join(".");
}

const url_bancos = {
    'BANCO GUAYAQUIL':'https://bancavirtual.bancoguayaquil.com/BMultiPersonas/indexAlternativoP.html',
    'BANCO PACIFICO':'https://www.intermatico.com/ebanking/',
    'BANCO PICHINCHA':'https://bancaweb.pichincha.com/bancapersonal/login.do?sessionDataKey=5206662c-f2f2-466c-a9db-abdd6d7977ed&tenantDomain=carbon.super&relyingParty=ANZyNecUPtALG39bDxtKJYGxLXca',
    'BANCO BOLIVARIANO':'https://www10.bolivariano.com/banca_corporativa/pag_inicio.asp',
    'BANCO PRODUBANCO':'https://www.produbanco.com/produnet/',
    'BANCO DINERS':'https://www.dinersclub.com.ec/portal/',
    'BANCO AMAZONAS':'https://www4.bancoamazonas.com/Administration.WebUI/Pages/General/Login.aspx?ReturnUrl=%2f',
    'BANCO AUSTRO':'https://www.baustroonline.com/AppInt/BaustroOnline/bancavirtual/personas/',
    'BANCO GENERAL RUMIÑAHUI':'https://bgr.ec/web/guest/login',
    'BANCO INTERNACIONAL':'https://www.bancointernacional.com.ec/mcm-web-baninter/login.jsp',
    'BANCO SOLIDARIO':'https://virtual-solidario.com/BankPlus/VBankPlusSite/Account/Login/BancaPorInternet',
    'BANCO MACHALA':'https://www3.bancomachala.com/BancaenLinea/Users/Loginnv.aspx?ReturnUrl=%2fBancaEnLinea%2fUser%2fLoginnv.aspx',
    'BANCO LOJA':'https://www.bancodeloja.fin.ec/Informaci%C3%B3n/Nuestra-Cobertura/Banca-Electr%C3%B3nica',
    'BANCO PROCREDIT':'https://bancadirecta.bancoprocredit.com.ec/Login',
    'BANCO LITORAL':'https://www.virtuallitoral.com/VirtualAbanks/servlet/com.virtualabanksxevo3.hvx0000033',
    'BANCO VISIONFUND ECUADOR':'',
    'BANCO CODESARROLLO':'https://codeweb.bancodesarrollo.fin.ec/Personas/#/login',
    'BANCO CAPITAL':'',
    'BANCO COMERCIAL DE MANABI':'https://www.bcmanabi.fin.ec:446/webbanking/',
    'BANCO COOPNACIONAL':'https://www.bancocoopnacional.com/',
    'BANCO DELBANK':'http://delbank.fin.ec/#',
}