
let COMISION_COBRANZA_INSOLUTO_MENSUAL = 0.004;
let IVA = 0.12
let COMISION_ADJUDICACION_FACTOR =0.007;
let ADJUDICACION_FACTOR = 1.12
let DICCIONARIO_SIMULACION = {}
let OPORTUNIDAD = {}
let COMISION_BANCO = 0.4
let COMISIONES_BANCARIAS = 0.22
let RUTA_FASE_1 ="/registro/aceptar_inversion/"
let RUTA_PAGOS = '/registro/pagos/'
let RUTA_CAMBIAR_MONTO_INVERSION = '/registro/cambiar_monto_inversion/'
let RUTA_TA_SIMULACION = "/registro/ta_simulacion/"
let INPUT_MONTO_INVERSION = 0

const FORMAT_CURRENCY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const FORMAT_PERCENT = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 0,
   	maximumFractionDigits: 2
})

function ruta_fase_1(id, monto){
    return RUTA_FASE_1+"?id="+id+"&monto="+monto;
}









function crear_modal_simulacion_inversion(id_oportunidad,input_modal){
  $.ajax({
      url: RUTA_SOLICITUDES+id_oportunidad+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){

          	if (!verificar_valores_inversion("detalle-solicitud", res.data)){
          		return false
          	}
          	$("#input-monto").keydown(function(e) {
                  if(e.key==='.'){
                    event.preventDefault();
                  }
                });

                 $("#input-monto").keyup(function(e) {
                  let numero = $(this).val();
                  numero = limpiarNumero(numero);
                  $(this).val('$'+numberWithCommas(numero));
                });
          	  $(".crece-modal").show();
			  $("#crece-modal-simular-inversion-id").css('display', 'flex');
			  $("#aceptar-inversion-modal-dashboard").hide();
			  $("#subir_transferencia_wrapper").hide();
			  $("#completar_datos_wrapper").hide();
			  $("#crece-declaracion-body-id").hide();
			  $("#cambiar-monto-inversion-modal-dashboard").hide()
          	
          	let barra_porcentaje_financiado = document.getElementById("crece-operaciones-contenido-monto-barra-progreso-id")
          	let oportunidad = res.data
          	porcentaje_financiado = oportunidad.porcentaje_financiado
          	barra_porcentaje_financiado.style.width = porcentaje_financiado+'%'

          	document.getElementById('strong-monto-recolectado').innerHTML =  numeroConComas(calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado))
          	document.getElementById("span-pr-recolectado").innerHTML = oportunidad.porcentaje_financiado+'% recolectado'
          	document.getElementById("strong-monto-objetivo").innerHTML =  numeroConComas(decimalAEntero(oportunidad.monto))

            calcular_tabla_inversionista(input_modal,res.data)

    //         let boton_invertir  = document.getElementById("simular-inversion-boton-invertir")
				// boton_invertir.addEventListener('click', function (argument) {
			 //  		// body...
			 //  		crear_modal_aceptar_inversion(oportunidad.id,"aceptar-inversion-inicio",INPUT_MONTO_INVERSION)
			 //  	})
           $("#simular-inversion-boton-invertir").click(function () {
           	// body...
           		crear_modal_aceptar_inversion(oportunidad.id,"aceptar-inversion-inicio",INPUT_MONTO_INVERSION)
           })
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          alert("Solicitud no encontrada.");
      }
  });
}

function crear_modal_aceptar_inversion(id_oportunidad,input_modal,monto){
  $.ajax({
      url: RUTA_SOLICITUDES+id_oportunidad+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){
          	$(".crece-modal").show();
			  $("#aceptar-inversion-modal-dashboard").css('display', 'flex');
			  $("#subir_transferencia_wrapper").hide();
			  $("#completar_datos_wrapper").hide();
			  $("#crece-declaracion-body-id").hide();
			  $("#crece-modal-simular-inversion-id").hide()
			  $("#cambiar-monto-inversion-modal-dashboard").hide()

			  $("#input-monto-aceptar-inversion").keydown(function(e) {
                  if(e.key==='.'){
                    event.preventDefault();
                  }
                });

                 $("#input-monto-aceptar-inversion").keyup(function(e) {
                  let numero = $(this).val();
                  numero = limpiarNumero(numero);
                  $(this).val('$'+numberWithCommas(numero));
                });


          	let boton_invertir = document.getElementById("aceptar-inversion-button-invertir")

          	$("#aceptar-inversion-button-invertir").attr("disabled", false)
          	$("#label_error_aceptar_inversion").hide()
            calcular_tabla_inversionista(input_modal,res.data,monto);
               	// boton_invertir.addEventListener('click', function () {
               	// 	// body...
               	// 	go_to_fase2(res.data)
               	// })
            $("#aceptar-inversion-button-invertir").click(function () {
            	// body...
            	go_to_fase2(res.data)
            })
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          alert("Solicitud no encontrada.");
      }
  });
}


function crear_modal_tabla_solicitud_valida(id_inversion, id_solicitud) {
	// body...
	$.ajax({
      url: RUTA_PAGOS+id_inversion+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){

          	  $(".crece-modal").show();
			  $("#crece-modal-tabla-solicitud-vigente-id").css('display', 'flex');
			  $("#crece-modal-simular-inversion-id").hide();
			  $("#aceptar-inversion-modal-dashboard").hide();
			  $("#subir_transferencia_wrapper").hide();
			  $("#completar_datos_wrapper").hide();
			  $("#crece-declaracion-body-id").hide();
			  $("#cambiar-monto-inversion-modal-dashboard").hide()
          	
          	
          	let lista_pagos = res.data.lista_pagos
          	let monto_inversion = res.data.monto
          	let adjudicacion_total = res.data.adjudicacion_total
          	id_interes_ganados = "#solicitud-valida-intereses-ganados-"+id_inversion
            let intereses_ganados = $(id_interes_ganados).html()
          	$("#intereses-ganados-tabla-vigente-id").html(intereses_ganados)
          	id_capital_cobrado = "#solicitud-valida-capital-cobrado-"+id_inversion
            let capital_cobrado = $(id_capital_cobrado).html()
            $("#capital-cobrado-tabla-vigente-id").html(capital_cobrado)
            llenar_tabla_solicitud_valida(lista_pagos, monto_inversion, adjudicacion_total)
           
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          alert("Solicitud no encontrada.");
      }
  });
}


function crear_modal_cambiar_monto_inversion(id_solicitud,input_modal,monto, id_inversion) {
	// body...
	$.ajax({
      url: RUTA_SOLICITUDES+id_solicitud+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){
			obtener_ruta_ac_uso();
          	$(".crece-modal").show();
			  $("#cambiar-monto-inversion-modal-dashboard").css('display', 'flex');
			  $("#subir_transferencia_wrapper").hide();
			  $("#completar_datos_wrapper").hide();
			  $("#crece-declaracion-body-id").hide();
			  $("#crece-modal-simular-inversion-id").hide()
			  $("#aceptar-inversion-modal-dashboard").hide();
			  $("#final_inversion_wrapper").hide();

			  $("#input-cambiar-monto-inversion").keydown(function(e) {
                  if(e.key==='.'){
                    event.preventDefault();
                  }
                });

                 $("#input-cambiar-monto-inversion").keyup(function(e) {
                  let numero = $(this).val();
                  numero = limpiarNumero(numero);
                  $(this).val('$'+numberWithCommas(numero));
                });


          	let boton_cambiar_monto_inversion = document.getElementById("cambiar-monto-inversion-button")
          	$("#cambiar-monto-inversion-button").attr("disabled", false)
          	$("#label_error_cambiar_monto_inversion").hide()
            calcular_tabla_inversionista(input_modal,res.data,monto);
               	boton_cambiar_monto_inversion.addEventListener('click', function () {
               		// body...
               		go_to_fase2(res.data, 'cambiar-monto-inversion', id_inversion)
               	})
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          alert("Solicitud no encontrada.");
      }
  });

}

function format_proxima_fecha_pago(fecha) {
  // body...
  lista = fecha.split("-")
  dia = lista[2]
  mes = lista[1]
  year = lista[0]
  return dia+"/"+mes+"/"+year
}

function llenar_tabla_solicitud_valida(lista_pagos, monto, adjudicacion_total) {
	// body...

	let tabla = document.getElementById("tabla-vigente-id");
	/*Verificando que ya exista la tabla*/
		if (tabla.children.length > 1) {
			let last_child = tabla.lastChild
			for (var i = tabla.children.length - 1; i >= 1; i--) {
				let last_child = tabla.lastChild
				tabla.removeChild(last_child)
			}


		
		}	
	for (var i = 0 ; i < lista_pagos.length; i++) {
		let pago = lista_pagos[i]
		let fecha_pago = pago.fecha
		let num_cuota = pago.orden
		let capital_i = pago.pago
		let ganancia_i = pago.ganancia
		let comision_iva_i = pago.comision_iva
		let comision_i = pago.comision
		let comision_total_i = comision_i + comision_iva_i
		let pago_i = ganancia_i + comision_iva_i + comision_i
		let interes_i = pago_i - capital_i
		let estado_i = pago.estado_pago
		fecha_pago = format_proxima_fecha_pago(fecha_pago)
		
		/*LLenando la tabla */
		let fila = document.createElement("tr")

		let fila_numero_cuota = '<td>'+ (num_cuota) +'</td>'
		let fila_fecha_pago = '<td>'+ (fecha_pago) +'</td>'
		let fila_capital_i= '<td>'+ FORMAT_CURRENCY.format(capital_i)+'</td>'
		let fila_intereses_i = '<td>'+ FORMAT_CURRENCY.format(interes_i)+'</td>'
		let fila_comision_total_i = '<td>'+ FORMAT_CURRENCY.format(comision_total_i)+'</td>'
		let fila_ganancia_i = '<td>'+ FORMAT_CURRENCY.format(ganancia_i)+'</td>'
		let fila_estado_i = '<td>'+ (estado_i)+'</td>'

		let html_fila = fila_fecha_pago + fila_numero_cuota + fila_capital_i + fila_intereses_i + fila_comision_total_i + fila_ganancia_i + fila_estado_i
		
		fila.innerHTML= html_fila;
		tabla.appendChild(fila)
		
	}
	let div_monto_invertir = document.getElementById("monto-invertir-tabla-vigente-id")
	div_monto_invertir.innerHTML = '$'+numberWithCommas(monto)
	lista_pagos_anterior = lista_pagos

	
	
}

function go_to_fase1(oportunidad, monto){
	window.location.href = ruta_fase_1(oportunidad.id, monto)
}

function go_to_fase2(oportunidad,input_modal, id_inversion){
	
	firmar_ac_uso();
	if (input_modal === 'cambiar-monto-inversion'){
		guardar_nuevo_monto_inversion(oportunidad, id_inversion)
	}else{
		guardar_tabla(oportunidad)
	}
	
	

}

function firmar_ac_uso(){
	let dictRespuestas = {
		"nombres": $("#nombre").val(),
		"apellidos": $("#apellidos").val(),
		"cedula": $("#cedula").val()
	}
	$.ajax({
		type: 'POST',
		url: "/inversionista/firma_contrato_ac_uso/",
		data: dictRespuestas,
		success: function(resultData) { 
		}
	});
}

function guardar_nuevo_monto_inversion(oportunidad, id_inversion) {
	// body...
	let monto_cambiar = limpiarNumero(document.getElementById("input-cambiar-monto-inversion").value)

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	let id_solicitud = oportunidad.id
    	response_data = JSON.parse(this.response)
    	inversion_total = response_data.data.inversion_total
    		monto_inversion_actual = monto_cambiar
    		$(".crece-flujo-inversionista-paso-uno").removeClass("crece-flujo-inversionista-paso-selected");
    		$(".crece-flujo-inversionista-paso-uno").addClass("crece-flujo-inversionista-paso-completado");

    		$(".crece-flujo-inversionista-paso-dos").removeClass("crece-flujo-inversionista-paso-completado");
    		$(".crece-flujo-inversionista-paso-dos").addClass("crece-flujo-inversionista-paso-selected");
      	  $(CLASE_MODAL).show();
          $(ID_FASE_ACEPTAR).hide();
          $(ID_CAMBIAR_MONTO_INVERSION).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();
          $(ID_COMPLETA_DATOS).css('display', 'flex');
          $(ID_DECLARACION_FONDOS).hide();
          
          $("#texto_monto").html(inversion_total);
   		}
  	};
	xhttp.open("POST", RUTA_CAMBIAR_MONTO_INVERSION, true);
	xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify({
								"id_inversion": id_inversion,
								"monto_cambiar": monto_cambiar,
							})
				);

}

function verificar_valores_inversion(modo, oportunidad) {
	// body...
	let id = ""
	
	if (modo === "detalle-solicitud"){
		id = "input-monto-detalle-solicitud"
	}
	else if(modo==='aceptar-inversion'){
		id = "input-monto-aceptar-inversion"	
	}
	else if(modo==='cambiar-monto-inversion'){
		id = 'input-cambiar-monto-inversion'
	}
	else{
		id = "input-monto"
	}
	
	let input_monto_inversion = limpiarNumero(document.getElementById(id).value);
	let monto_maximo = oportunidad.monto * 0.9 
	let total_financiado = parseFloat(oportunidad.monto)*(parseFloat(oportunidad.porcentaje_financiado)/100);
	let monto_por_financiar = oportunidad.monto - total_financiado

	if (parseInt(oportunidad.porcentaje_financiado) < 100){
		if (input_monto_inversion < 350 || input_monto_inversion>monto_maximo || input_monto_inversion>monto_por_financiar){
			let tabla_id = "tabla-amortizacion-id"
			if (modo==='aceptar-inversion'){
				$("#label_error_aceptar_inversion").show()
				tabla_id = "tabla-amortizacion-aceptar-inversion-id"
				$("#adjudicacion-total").html("")
				$("#inversion-total").html("")
				$("#aceptar-inversion-button-invertir").attr("disabled", true)
			}
			else if(modo==='cambiar-monto-inversion'){
				$("#label_error_cambiar_monto_inversion").show()
				tabla_id = "tabla-amortizacion-cambiar-monto-inversion-id"
				$("#adjudicacion-total-cambiar-monto-inversion").html("")
				$("#inversion-total-cambiar-monto-inversion").html("")
				$("#cambiar-monto-inversion-button").attr("disabled", true)
				
			}
			else{
				$("#label_error_simular_inversion_detalle_solicitud").show()
				$("#label_error_simular_inversion_modal").show()
			}
			
			let tabla = document.getElementById(tabla_id);
			/*Verificando que ya exista la tabla*/
			if (tabla.children.length > 1) {
				let last_child = tabla.lastChild

				for (var i = oportunidad.plazo - 1; i >= 0; i--) {
					let last_child = tabla.lastChild
					tabla.removeChild(last_child)
				}


				
			}
			return false
		}
		$("#label_error_simular_inversion_detalle_solicitud").hide()
		$("#label_error_simular_inversion_modal").hide()
		$("#label_error_aceptar_inversion").hide()
		$("#aceptar-inversion-button-invertir").attr("disabled", false)
		$("#label_error_cambiar_monto_inversion").hide()
		$("#cambiar-monto-inversion-button").attr("disabled", false)
	}
	else  {
		$("#label_error_simular_inversion_detalle_solicitud").html("Esta solicitud ya ha sido completada")
		$("#label_error_simular_inversion_detalle_solicitud").show()
		return false
	}
	

	return true
}

/*Calcula valores de las cuotas y llena la tabla de inversion*/
function calcular_tabla_inversionista(input_modal,oportunidad,monto) {

	// body...
	let diccionario = {}
	let input_monto_inversion = 0
	if (input_modal === 'simulacion-inversion'){
		input_monto_inversion = limpiarNumero(document.getElementById("input-monto").value)
		document.getElementById("input-monto-detalle-solicitud").value = numberWithCommas(input_monto_inversion)
		diccionario = DICCIONARIO_SIMULACION
		oportunidad = OPORTUNIDAD
		if (!verificar_valores_inversion("",oportunidad)){
			return false
		}
	}else if(input_modal === 'aceptar-inversion'){
		input_monto_inversion = limpiarNumero(document.getElementById("input-monto-aceptar-inversion").value)
		diccionario = DICCIONARIO_SIMULACION
		oportunidad = OPORTUNIDAD
		if (!verificar_valores_inversion(input_modal,oportunidad)){
			return false
		}
		
	}else if (input_modal === 'cambiar-monto-inversion'){
		input_monto_inversion =  limpiarNumero(document.getElementById("input-cambiar-monto-inversion").value)
		diccionario = DICCIONARIO_SIMULACION
		oportunidad = OPORTUNIDAD
		if (!verificar_valores_inversion(input_modal,oportunidad)){
			return false
		}
	}
	else{

		diccionario = hacer_tabla_amortizacion(oportunidad)
		DICCIONARIO_SIMULACION = diccionario
		OPORTUNIDAD = oportunidad
		if (input_modal === 'aceptar-inversion-inicio'){

			input_monto_inversion = monto
			document.getElementById("input-monto-aceptar-inversion").value = '$'+numberWithCommas(input_monto_inversion)
		}else if (input_modal === 'cambiar-monto-inversion-inicio'){
			input_monto_inversion = monto
			document.getElementById("input-cambiar-monto-inversion").value = '$'+numberWithCommas(input_monto_inversion)
		}
		else{
			input_monto_inversion = limpiarNumero(document.getElementById("input-monto-detalle-solicitud").value);

		}
		document.getElementById("input-monto").value = '$'+numberWithCommas(input_monto_inversion)
	}
	INPUT_MONTO_INVERSION = input_monto_inversion
	let tabla_id = ''
	if(input_modal === 'aceptar-inversion-inicio' || input_modal === 'aceptar-inversion'){
		tabla_id = "tabla-amortizacion-aceptar-inversion-id"
	}else if(input_modal==='cambiar-monto-inversion-inicio' || input_modal === "cambiar-monto-inversion"){
		tabla_id = "tabla-amortizacion-cambiar-monto-inversion-id"
	}
	else{
		tabla_id = "tabla-amortizacion-id"
	}
	let tabla = document.getElementById(tabla_id);
	/*Verificando que ya exista la tabla*/
	if (tabla){
		if (tabla.children.length > 1) {
			let last_child = tabla.lastChild
			for (var i = tabla.children.length - 1; i >= 1; i--) {
				let last_child = tabla.lastChild
				tabla.removeChild(last_child)
			}


		
		}	
	
	}
	
	let monto_inversion = parseInt(input_monto_inversion, 10)

	
	let lista_capital_insoluto_sol = diccionario['lista_capital_insoluto']
	let lista_cuotas_sol = diccionario['lista_cuotas']
	let lista_intereses_sol = diccionario['lista_intereses']
	let lista_capitales_sol = diccionario['lista_capitales']
	let dias = diccionario['dias']


	let participacion_inversionista = (monto_inversion/oportunidad.monto)
	let participacion_inversionista_porcentaje = participacion_inversionista *100
	let COMISION_ADJUDICACION = oportunidad.monto * COMISION_ADJUDICACION_FACTOR
	let cargo_adjudicacion = COMISION_ADJUDICACION * participacion_inversionista //REVISAR***
	let cargo_adjudicacion_iva = cargo_adjudicacion * IVA
	let inversion_total = monto_inversion + cargo_adjudicacion + cargo_adjudicacion_iva //Verficar si se agrega el adjudicacion IVA

	
	let ganancia_total = 0;
	let pago_total = 0;
	let comision_total = 0;
	let comision_iva_total = 0;
	let interes_total = 0;

	for (var i = 0; i < oportunidad.plazo ; i++) {
		interes_i =  lista_intereses_sol[i] * participacion_inversionista - COMISION_BANCO
		capital_i = lista_capitales_sol[i] * participacion_inversionista
		let dias_transcurridos = dias[i+1]
		comision_i = lista_capital_insoluto_sol[i] * COMISION_COBRANZA_INSOLUTO_MENSUAL/30*dias_transcurridos * participacion_inversionista //ES EL COBRO POR USO DE LA PLATAFORMA
		comision_iva_i = comision_i * IVA
		pago_i = capital_i + interes_i
		ganancia_i = pago_i - comision_iva_i - comision_i

		/*Calculando los totales*/
		ganancia_total += ganancia_i;
		pago_total += pago_i;
		comision_total += comision_i;
		comision_iva_total += comision_iva_i
		comision_total_i = comision_i + comision_iva_i
		interes_total += interes_i;

		/*LLenando la tabla */
		let fila = document.createElement("tr")

		let fila_numero_cuota = '<td>'+ (i+1) +'</td>'
		let fila_capital_i= '<td>'+ FORMAT_CURRENCY.format(capital_i)+'</td>'
		let fila_intereses_i = '<td>'+ FORMAT_CURRENCY.format(interes_i)+'</td>'
		let fila_comision_total_i = '<td>'+ FORMAT_CURRENCY.format(comision_total_i)+'</td>'
		let fila_ganancia_i = '<td>'+ FORMAT_CURRENCY.format(ganancia_i)+'</td>'

		let html_fila = fila_numero_cuota + fila_capital_i + fila_intereses_i + fila_comision_total_i + fila_ganancia_i 
		
		fila.innerHTML= html_fila;
		tabla.appendChild(fila)

		

	}

	$("#total-a-recibir-simulacion").html(FORMAT_CURRENCY.format(ganancia_total));
	$("#container-mensaje-ganancia").html(
		'<p> Invirtiendo '+ FORMAT_CURRENCY.format(input_monto_inversion) +' ganarías ' +FORMAT_CURRENCY.format(ganancia_total - input_monto_inversion) +
		' en ' + oportunidad.plazo + ' meses. ¡Invierte ahora!</p>'
	);

	if (input_modal === 'aceptar-inversion-inicio' || input_modal === 'aceptar-inversion'){
		let div_adjudicacion_total = document.getElementById("adjudicacion-total")
		cargo_adjudicacion_total = cargo_adjudicacion+cargo_adjudicacion_iva
		div_adjudicacion_total.innerHTML = FORMAT_CURRENCY.format(cargo_adjudicacion_total)

		let div_inversion_total = document.getElementById("inversion-total")
		div_inversion_total.innerHTML = FORMAT_CURRENCY.format(inversion_total)

		$("#total-a-recibir").html( FORMAT_CURRENCY.format(ganancia_total) );

		
		let div_ganancia = document.getElementById("ganancia-total");
		div_ganancia.innerHTML = ganancia_total.toFixed(2);
		let div_adjudicacion = document.getElementById("adjudicacion");
		div_adjudicacion.innerHTML = cargo_adjudicacion.toFixed(2)
		let div_adjudicacion_iva = document.getElementById("adjudicacion-iva")
		div_adjudicacion_iva.innerHTML = cargo_adjudicacion_iva.toFixed(2)
	}

	else if (input_modal === 'cambiar-monto-inversion-inicio' || input_modal === 'cambiar-monto-inversion'){
		let div_adjudicacion_total = document.getElementById("adjudicacion-total-cambiar-monto-inversion")
		cargo_adjudicacion_total = cargo_adjudicacion+cargo_adjudicacion_iva
		div_adjudicacion_total.innerHTML = FORMAT_CURRENCY.format(cargo_adjudicacion_total)

		let div_inversion_total = document.getElementById("inversion-total-cambiar-monto-inversion")
		div_inversion_total.innerHTML = FORMAT_CURRENCY.format(inversion_total)

		$("#inversion-total-cambiar-monto-recibido").html( FORMAT_CURRENCY.format(ganancia_total) );
		
		let div_ganancia = document.getElementById("ganancia-total-cambiar-monto-inversion");
		div_ganancia.innerHTML = ganancia_total.toFixed(2);
		let div_adjudicacion = document.getElementById("adjudicacion-cambiar-monto-inversion");
		div_adjudicacion.innerHTML = cargo_adjudicacion.toFixed(2)
		let div_adjudicacion_iva = document.getElementById("adjudicacion-iva-cambiar-monto-inversion")
		div_adjudicacion_iva.innerHTML = cargo_adjudicacion_iva.toFixed(2)
	}



	
	

}



/*Crea tabla de amortizacion del solicitante*/
function hacer_tabla_amortizacion(oportunidad) {

	// body...
	let fecha_publicacion_solicitud = oportunidad.fecha_publicacion
	let fecha_split = fecha_publicacion_solicitud.split("-")
	let start_date = new Date(fecha_split[0], fecha_split[1]-1, fecha_split[2])
	
	let next_date = new add_months(start_date,1)
	let temp_date = new Date(fecha_split[0], fecha_split[1]-1, fecha_split[2])
	
	let fechas = []
	let dias = []
	


	let dias_transcurridos = getDuration(start_date - start_date).value
	dias.push(dias_transcurridos)
	for (var i = 0; i < oportunidad.plazo; i++) {
		
		if(next_date.getDay() == 0){
			
			next_date.setDate(next_date.getDate() + 1) //lunes
			dias_transcurridos = getDuration(next_date - temp_date).value 
			temp_date = new Date(next_date.getFullYear(), next_date.getMonth(), next_date.getDate())
			fecha_pago  = next_date.getFullYear() + "-" + (next_date.getMonth()) + "-" +next_date.getDate()
			next_date.setDate(next_date.getDate()-1)
		}
		else if(next_date.getDay() == 6){
			next_date.setDate(next_date.getDate() + 2) //lunes
			dias_transcurridos = getDuration(next_date - temp_date).value 
			temp_date = new Date(next_date.getFullYear(), next_date.getMonth(), next_date.getDate())
			fecha_pago  = next_date.getFullYear() + "-" + (next_date.getMonth()) + "-" +next_date.getDate()
			next_date.setDate(next_date.getDate()-2)
		}else{
			dias_transcurridos = getDuration(next_date - temp_date).value
			temp_date = new Date(next_date.getFullYear(), next_date.getMonth(), next_date.getDate())
			fecha_pago  = next_date.getFullYear() + "-" + (next_date.getMonth()) + "-" +next_date.getDate()
		}
		
		dias.push(dias_transcurridos)
		next_date = add_months(start_date, i+2)
		fechas.push(fecha_pago)
		
	}



	let ultima_fecha = fechas[7]
	let primera_fecha = fechas[0]

	let plazo_dias = dias.reduce((a, b) => a + b, 0)
	let TASA_INTERES_ANUAL = oportunidad.tin;
	if( TASA_INTERES_ANUAL > 1){

		TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100
	}

	let tasa_diaria = (1+TASA_INTERES_ANUAL/365)-1 ; // tasa diaria

	let tasa_mensual = [ Math.pow((1 + tasa_diaria),(plazo_dias/oportunidad.plazo)) ] - 1 ;
	let cuota_mensual = PMT(tasa_mensual, oportunidad.plazo, oportunidad.monto)*-1
	let tabla = document.getElementById("tabla-amortizacion-id");
	let MONTO_SOLICITANTE = parseInt(oportunidad.monto, 10)
	let capital_por_pagar_n = MONTO_SOLICITANTE
	let cuota_n = cuota_mensual + COMISIONES_BANCARIAS

	let capital_TOTAL =0
	let cuota_TOTAL = 0
	let intereses_TOTAL = 0

	let lista_capital_insoluto = [MONTO_SOLICITANTE]
	let lista_cuotas = []
	let lista_intereses = []
	let lista_capitales = []

	for (var i = 0; i < oportunidad.plazo; i++) {
		//let fila = document.createElement("tr")
		
		
		/*Intereses mensual*/
		let dias_transcurridos = dias[i+1]
		
		tasa_mensual = [ Math.pow((1 + tasa_diaria),dias_transcurridos) ] - 1
		intereses_n = capital_por_pagar_n*tasa_mensual
		
		intereses_TOTAL += intereses_n
		lista_intereses.push(intereses_n)


		capital_n = cuota_mensual - intereses_n  //capital
		

		if (i == oportunidad.plazo-1){
			capital_n = MONTO_SOLICITANTE - capital_TOTAL //capital mensual
			cuota_n = capital_n + intereses_n + COMISIONES_BANCARIAS //cuota a pagar
			
		}

		/*Capital total y llenando la lista de capital mensual*/
		capital_TOTAL += capital_n
		lista_capitales.push(capital_n)

		/*Cuota total y llenando la lista de cuotas mensuales*/
		lista_cuotas.push(cuota_n)
		cuota_TOTAL += cuota_n

		/*Capital por Pagar mensual*/
		capital_por_pagar_n = capital_por_pagar_n - capital_n
		lista_capital_insoluto.push(capital_por_pagar_n)


	}


	let diccionario = {'lista_cuotas': lista_cuotas, 
						'lista_capital_insoluto': lista_capital_insoluto,
						'lista_intereses': lista_intereses,
						'lista_capitales':lista_capitales,
						'dias':dias}

	return diccionario
}



function add_months(start_date, months) {
	// body...
	month = start_date.getMonth() + months
	year = start_date.getFullYear() + Math.floor(month / 12);
    month = month % 12
    day = start_date.getDate()
    new_date = new Date(year, month, day)
    return new_date
}



/**
 * Copy of Excel's PMT function.
 * Credit: http://stackoverflow.com/questions/2094967/excel-pmt-function-in-js
 *
 * @param rate_per_period       The interest rate for the loan.
 * @param number_of_payments    The total number of payments for the loan in months.
 * @param present_value         The present value, or the total amount that a series of future payments is worth now;
 *                              Also known as the principal.
 * @param future_value          The future value, or a cash balance you want to attain after the last payment is made.
 *                              If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
 * @param type                  Optional, defaults to 0. The number 0 (zero) or 1 and indicates when payments are due.
 *                              0 = At the end of period
 *                              1 = At the beginning of the period
 * @returns {number}
 */
function PMT(rate_per_period, number_of_payments, present_value, future_value, type){
    future_value = typeof future_value !== 'undefined' ? future_value : 0;
    type = typeof type !== 'undefined' ? type : 0;

	if(rate_per_period != 0.0){
		// Interest rate exists
		var q = Math.pow(1 + rate_per_period, number_of_payments);
		return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

	} else if(number_of_payments != 0.0){
		// No interest rate, but number of payments exists
		return -(future_value + present_value) / number_of_payments;
	}

	return 0;
}




function getDuration(milli){
  let minutes = Math.floor(milli / 60000);
  let hours = Math.round(minutes / 60);
  let days = Math.round(hours / 24);

  return (
    (days && {value: days, unit: 'days'}) ||
    (hours && {value: hours, unit: 'hours'}) ||
    {value: minutes, unit: 'minutes'}
  )
};


function numeroConComas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function decimalAEntero(decimal){
  return decimal.split(".")[0];
}

function calcularPorcentajeFinanciado(monto, porcentaje_financiado){
  total_financiado = parseFloat(monto)*(parseFloat(porcentaje_financiado)/100);
  return Math.round( total_financiado );
}


/*Guardar tabla y enviarla al servidor*/
function guardar_tabla(oportunidad) {
	// body...
	let inversionista = $(".active.selectable").attr("data-usuario")
	let id_solicitud = oportunidad.id;
	let date = new Date()
	let fecha_pago  = date.getFullYear() + "-" + (date.getMonth()+1) + "-" +date.getDate()


	let monto = limpiarNumero(document.getElementById("input-monto-aceptar-inversion").value)
	let adjudicacion = document.getElementById("adjudicacion").textContent;
	let adjudicacion_iva = document.getElementById("adjudicacion-iva").textContent;
	let adjudicacion_total = document.getElementById("adjudicacion-total").textContent
	adjudicacion_total = adjudicacion_total.replace(/\$/g,'');
	let inversion_total = parseFloat(monto,10) + parseFloat(adjudicacion_total,10)
	// inversion_total = inversion_total.replace(/\$/g,'');
	let ganancia_total = document.getElementById("ganancia-total").textContent;

	let inversion = {"monto": monto, 
						"id_solicitud": id_solicitud,
						"adjudicacion": adjudicacion,
						"adjudicacion_iva": adjudicacion_iva,
						"inversion_total": inversion_total,
						"ganancia_total": ganancia_total,
						'id_inversionista': inversionista
					}


	

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

    	response_data = JSON.parse(this.response)
      	mostrar_completar_datos_modal(response_data.id_inversion, monto, id_solicitud, "FILL_INFO")
   		}
  	};
	xhttp.open("POST", RUTA_FASE_1, true);
	xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify({
								"inversion": inversion,
							})
				);


}

/* Completa Datos*/
function mostrar_completar_datos_modal(id_inversion, monto, id_solicitud, fase_inversion){
  id_inversion_modal = id_inversion;
  monto_inversion_actual = monto;
  id_solicitud_actual = id_solicitud;
  fase_inversion_actual = fase_inversion;
  $(CLASE_MODAL).show();
  $(ID_FASE_ACEPTAR).hide();
  $(ID_COMPLETA_DATOS).css('display', 'flex');
  $(ID_SUBIR_TRANSFERENCIA).hide();
  $(ID_DECLARACION_FONDOS).hide();
  $(ID_CAMBIAR_MONTO_INVERSION).hide();


  habilitarClicks();

  setPasoInversionistaActualFillInfo(2);

  $(".crece-flujo-inversionista-paso-tres, "+
  ".crece-flujo-inversionista-paso-tres span").prop("onclick", null).off("click");

  $(".crece-flujo-inversionista-paso-cuatro, "+
  ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");

}

function limpiarNumero(num){
	return num.toString().replace(/\D/g,'').replaceAll(',', '').replaceAll('.', '')
}