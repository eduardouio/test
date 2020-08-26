let RUTA_SOLICITUDES_API ="/solicitudes/";


function ver_detalle_solicitud(fase_inversion,id_inversion,id_oportunidad){
    $.ajax({
        url: RUTA_SOLICITUDES_API+id_oportunidad+'/',
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            
            if (res.data){
                crearDetalleInversion(fase_inversion,id_inversion,res.data);
            }  
        },
        error: function(xhr, status, error) {
            var err = JSON.parse(xhr.responseText);
            alert("Solicitud no encontrada.");
        }
    });
}


function mostrar_detalle_continuar_simular(fase_inversion,id_oportunidad,id_solicitud) {
    // body...
    $('#crece-detalle-operaciones-id').show()
    if(fase_inversion === "FILL_INFO"){
    return (`
      <h3>Termina tu inversión</h3>
      <!-- input invierte-->
      <div class="crece-detalle-operaciones-invierte-botones">                                                    
          <div class="crece-detalle-operaciones-invierte-botones-azul">
              <div class="row justify-content-center">
                   
      <a href="#" onclick="completar_datos_modal(`+id_oportunidad+`)">Continuar</a>
              </div>
          </div>
              
      </div>
      `
      
      
      
    );
  }

  else if(fase_inversion === "ORIGIN_MONEY"){
    return (`
      <h3>Termina tu inversión</h3>
      <!-- input invierte-->
      <div class="crece-detalle-operaciones-invierte-botones">                                                    
          <div class="crece-detalle-operaciones-invierte-botones-azul">
              <div class="row justify-content-center">
                   
     <a href="#" onclick="declaracion_fondos_modal(`+id_oportunidad+`)">Continuar</a>
              </div>
          </div>
              
      </div>
      `

      

    );
  }

  else if(fase_inversion === "PENDING_TRANSFER"){
    return (`
      <h3>Termina tu inversión</h3>
      <!-- input invierte-->
      <div class="crece-detalle-operaciones-invierte-botones">                                                    
          <div class="crece-detalle-operaciones-invierte-botones-azul">
              <div class="row justify-content-center">
                   
      <a href="#" onclick="subir_transferencia_modal(`+id_oportunidad +`)">Continuar</a>
              </div>
          </div>
              
      </div>
      `


    );
  }
  else{
    return (`
      <h3>Calcula tu ganancia</h3>
      <!-- input invierte-->
      <div class="crece-detalle-operaciones-invierte-monto col-12">
          <div>
              <label for="monto" style="display: contents;">$</label>
              <input id="input-monto-detalle-solicitud" name="monto" type="text" min="0">
          </div>
      </div>

      <div class="crece-detalle-operaciones-invierte-botones">                                                    
          <div class="crece-detalle-operaciones-invierte-botones-azul">
              <div class="row justify-content-center">
                          <div class="col-lg-12">
                            <label id="label_error_simular_inversion_detalle_solicitud">
                              Valor no permitido
                            </label>
                          </div>
                   <button id="crece-boton-simular-detalle-solicitud" type="button" onclick="crear_modal_simulacion_inversion(`+id_solicitud+`,'FALSE')"> Simular</button>
              </div>
          </div>
              
      </div>
      `
    );
  }
}


function crearDetalleInversion(fase_inversion,id_inversion,oportunidad) {
    var html_string = '<div class="row justify-content-center crece-detalle-operaciones-header">'+
'                        <div class="crece-detalle-operaciones-header-imagen-blur" id="crece-detalle-operaciones-header-imagen-blur-id" style="background-image: url(\' /'+encodeURIComponent(oportunidad.imagen_url)+ '\');">'+
'                        </div>'+
'                        <div class="crece-detalle-operaciones-header-gradiente" >'+
'                           <div class="row justify-content-center crece-detalle-operaciones-header-gradiente-imagen" >'+
'                               <div class="col-auto" >'+
'                                   <div class="crece-detalle-operaciones-header-gradiente-imagen-autor" style="background-image: url(\' /'+oportunidad.imagen_url+'\');">'+
'                                   </div>'+
'                               </div>'+
'                               <div class="col-12 col-sm-auto" >'+
'                                   <div class="row justify-content-center" >'+
'                                       <h1>'+oportunidad.autor+'</h1>'+
'                                   </div>'+
'                                   <div class="row justify-content-center" >'+
'                                       <h2>'+oportunidad.categoria+'</h2>'+
'                                   </div>'+
'                               </div>'+
'                           </div>'+
'                        </div>'+
'                    </div>'+
''+
'                    <div class="row justify-content-center fondo-gris">'+
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
'                                                            <strong>Tir</strong>'+
'                                                        </div>'+
'                                                        <div class="col-6 col-sm-3 crece-operaciones-contenido-informacion-subrayado">'+
'                                                            <span>'+ oportunidad.tir+'%</span>'+
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
'                                                            <strong>Ticker</strong>'+
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
                                                `<div class="col-10 crece-operaciones-contenido-historia">
                                                    <h2>Identificación y contacto</h2>
                                                    <div class="row">
                                                      <div clas="col-12">
                                                        <p>`+oportunidad.autor+`
                                                        </p>
                                                      </div>
                                                    </div>
                                                 </div>
                                                `+
                                                `<div class="col-10 crece-operaciones-contenido-historia">
                                                    <h2>Detalles de la solicitud</h2>
                                                    <div class="row">
                                                      <div clas="col-12">
                                                        <p>`+oportunidad.operacion+`
                                                        </p>
                                                      </div>
                                                    </div>
                                                 </div>
                                                `+
                                                `<div class="col-10 crece-operaciones-contenido-historia">
                                                    <h2>Garantias de la solicitud</h2>
                                                    <div class="row">
                                                      <div clas="col-12">
                                                        <p>`+oportunidad.garantias+`
                                                        </p>
                                                      </div>
                                                    </div>
                                                 </div>
                                                `+
                                                `<div class="col-10 crece-operaciones-contenido-historia">
                                                    <h2>Visita agente CRECE</h2>
                                                    <div class="row">
                                                      <div clas="col-12">
                                                        <p>`+oportunidad.visita_agente_CRECE+`
                                                        </p>
                                                      </div>
                                                    </div>
                                                 </div>
                                                `+
                                                 `<div class="col-10 crece-operaciones-contenido-historia">
                                                    <h2>Condiciones de la solicitud</h2>
                                                    <div class="row">
                                                      <div clas="col-12">
                                                        <p>`+oportunidad.condiciones+`
                                                        </p>
                                                      </div>
                                                    </div>
                                                 </div>
                                                `+
                                                `<div class="col-10 crece-operaciones-contenido-historia">
                                                    <h2>Más información de `+oportunidad.autor+`</h2>
                                                    <div class="row">
                                                      <div clas="col-12">
                                                        <p>`+oportunidad.mas_informacion_autor+`
                                                        </p>
                                                      </div>
                                                    </div>
                                                 </div>
                                                `+
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
                                                mostrar_detalle_continuar_simular(fase_inversion,id_inversion,oportunidad.id)+
'                                             </div>'+
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

let section_operaciones = document.getElementById("crece-oportunidades-id")
section_operaciones.style.display = 'none'
    $(".crece-detalle-operaciones").html(html_string) ;

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
