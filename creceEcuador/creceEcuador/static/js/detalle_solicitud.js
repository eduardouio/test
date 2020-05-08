let HOST = "http://localhost:8000/"
let RUTA_SOLICITUDES = HOST+"solicitudes/";


$( document ).ready(function() {
    let id_oportunidad = obtenerId();

    if(id_oportunidad){
        obtenerDetallesOportunidadInversion(id_oportunidad);
    }

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
    var html_string = '<div class="row justify-content-center crece-detalle-operaciones-header" style="background-image: url(\' '+oportunidad.imagen_url+'\');">'+
'                        <div class="crece-detalle-operaciones-header-gradiente" >'+
'                            <h1>'+oportunidad.autor+', '+oportunidad.categoria+'</h1>'+
'                        </div>'+
'                    </div>'+
''+
'                    <div class="row justify-content-center">'+
'                        <div class="col-xl-8 col-lg-10 col-11">'+
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
'                                                                '+calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado)+
'                                                            </strong>'+
'                                                            <span>'+ oportunidad.porcentaje_financiado+'% recolectado</span>'+
'                                                        </div>'+
'                                                        <div class="col-6 crece-operaciones-contenido-datos-barra-objetivo">'+
'                                                            <strong>'+
'                                                                $'+decimalAEntero(oportunidad.monto)+
'                                                            </strong>'+
'                                                            <span>Objetivo</span>'+
'                                                        </div>'+
'                                                    </div>'+
'                                                </div>'+
'        '+
'                                                <!-- Informacion -->'+
'                                                <div class="col-10 crece-operaciones-contenido-informacion">'+
'                                                    <h2>Información del Préstamo</h2>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6">'+
'                                                            <strong>Monto</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6">'+
'                                                            <span>$'+decimalAEntero(oportunidad.monto)+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6">'+
'                                                            <strong>Plazo</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6">'+
'                                                            <span>'+oportunidad.plazo+' Días</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6">'+
'                                                            <strong>Tir</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6">'+
'                                                            <span>'+ oportunidad.tir+'%</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6">'+
'                                                            <strong>Tipo de Financiamiento</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6">'+
'                                                            <span>'+oportunidad.tipo_credito+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
'        '+
'                                                    <!-- Item informacion-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-6">'+
'                                                            <strong>Categoría del Negocio</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6">'+
'                                                            <span>'+oportunidad.categoria+'</span>'+
'                                                        </div>'+
'                                                    </div>'+
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
'                                                    Al invertir estás contribuyendo al crecimiento de las PYMES de nuestro país.'+
'                                                </p>'+
'                                                <!-- input invierte-->'+
'                                                <div class="crece-detalle-operaciones-invierte-monto col-12">'+
'                                                    <div>'+
'                                                        <label for="monto">$</label><input id="monto_inversion" name="monto" type="text" min="0" max="3700">'+
'                                                    </div>'+
'                                                </div>'+
''+
'                                                <div class="crece-detalle-operaciones-invierte-botones">'+
'                                                    <div class="crece-detalle-operaciones-invierte-botones-blanco">'+
'                                                        <div class="row justify-content-center">'+
'                                                            <a href="#">Simular Inversión</a>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                    <div class="crece-detalle-operaciones-invierte-botones-azul">'+
'                                                        <div class="row justify-content-center">'+
'                                                            <a href="#">Invertir</a>'+
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
'                                            <!--radial progress-->'+
'                                            <div class="row justify-content-center crece-detalle-operaciones-historial-calificacion">'+
'                                                <div class="progress-radial progress-75">'+
'                                                    <div class="overlay">75%</div>'+
'                                                </div>'+
'                                            </div>'+
'                                            <!--Label radial progress bar-->'+
'                                            <div class="row justify-content-center">'+
'                                                <h5>Calificación</h5>'+
'                                            </div>'+
'                                            <!-- datos historial-->'+
'                                            <div class="row justify-content-center crece-detalle-operaciones-historial-datos">'+
'                                                <div class="col-12">'+
'                                                    <!-- Item datos-->'+
'                                                    <div class="row">'+
'                                                        <div class="col-10">'+
'                                                            <h4>'+
'                                                                Solicitudes Totales'+
'                                                            </h4>'+
'                                                        </div>'+
'                                                        <div class="col-2">'+
'                                                            <h5>'+
'                                                                2'+
'                                                            </h5>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                     <!-- Item datos-->'+
'                                                     <div class="row">'+
'                                                        <div class="col-10">'+
'                                                            <h4>'+
'                                                                Opreaciones Terminadas'+
'                                                            </h4>'+
'                                                        </div>'+
'                                                        <div class="col-2">'+
'                                                            <h5>'+
'                                                                1'+
'                                                            </h5>'+
'                                                        </div>'+
'                                                    </div>'+
''+
'                                                     <!-- Item datos-->'+
'                                                     <div class="row">'+
'                                                        <div class="col-10">'+
'                                                            <h4>'+
'                                                                Días de Mora'+
'                                                            </h4>'+
'                                                        </div>'+
'                                                        <div class="col-2">'+
'                                                            <h5>'+
'                                                                0'+
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
    $(".crece-detalle-operaciones").html(html_string) ;

    $('#monto_inversion').focus(
        function(){
            $(this).parent('div').css('border-color','#005B7A');
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