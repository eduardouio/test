let MONTO_SOLICITANTE = 7000;
let TASA_INTERES_ANUAL = 0.22;
let PLAZO = 12;
let COMISION_COBRANZA_INSOLUTO_MENSUAL = 0.004;
let IVA = 0.12
let COMISION_ADJUDICACION = MONTO_SOLICITANTE * 0.008;
let ADJUDICACION_FACTOR = 1.12
let COlUMNAS_TABLA_INVERSIOMISTA = 5

let HOST = "http://localhost:8000/"
let RUTA_FASE_2 = HOST+"registro/fase2/"


/*Calcula valores de las cuotas y llena la tabla de inversion*/
function calcular_tabla_inversionista() {
	// body...

	
	let tabla = document.getElementById("tabla-amortizacion-id");

	/*Verificando que ya exista la tabla*/
	if (tabla.children.length > 1) {
		let last_child = tabla.lastChild

		for (var i = PLAZO - 1; i >= 0; i--) {
			let last_child = tabla.lastChild
			tabla.removeChild(last_child)
		}


		
	}



	let input_monto_inversion = document.getElementById("input-monto").value
	let monto_inversion = parseInt(input_monto_inversion, 10)


	let diccionario = hacer_tabla_amortizacion()
	let lista_capital_insoluto_sol = diccionario['lista_capital_insoluto']
	let lista_cuotas_sol = diccionario['lista_cuotas']
	let lista_intereses_sol = diccionario['lista_intereses']
	let lista_capitales_sol = diccionario['lista_capitales']



	let participacion_inversionista = (monto_inversion/MONTO_SOLICITANTE)
	let participacion_inversionista_porcentaje = participacion_inversionista *100
	let cargo_adjudicacion = COMISION_ADJUDICACION * participacion_inversionista * ADJUDICACION_FACTOR //REVISAR***
	let cargo_adjudicacion_iva = cargo_adjudicacion * IVA
	let inversion_total = monto_inversion + cargo_adjudicacion + cargo_adjudicacion_iva //Verficar si se agrega el adjudicacion IVA

	
	let ganancia_total = 0;
	let pago_total = 0;
	let comision_total = 0;
	let comision_iva_total = 0;

	for (var i = 0; i < PLAZO ; i++) {
		interes_i =  lista_intereses_sol[i] * participacion_inversionista
		capital_i = lista_capitales_sol[i] * participacion_inversionista
		comision_i = lista_capital_insoluto_sol[i] * COMISION_COBRANZA_INSOLUTO_MENSUAL * participacion_inversionista //ES EL COBRO POR USO DE LA PLATAFORMA
		comision_iva_i = comision_i * IVA
		pago_i = capital_i + interes_i
		ganancia_i = pago_i - comision_iva_i - comision_i

		/*Calculando los totales*/
		ganancia_total += ganancia_i;
		pago_total += pago_i;
		comision_total += comision_i;
		comision_iva_total += comision_iva_i

		/*LLenando la tabla */
		let fila = document.createElement("tr")

		let fila_numero_cuota = '<td>'+ (i+1) +'</td>'
		let fila_pago_i= '<td>'+ pago_i.toFixed(2)+'</td>'
		let fila_comision_i = '<td>'+ comision_i.toFixed(2)+'</td>'
		let fila_comision_iva_i = '<td>'+ comision_iva_i.toFixed(2)+'</td>'
		let fila_ganancia_i = '<td>'+ ganancia_i.toFixed(2)+'</td>'

		let html_fila = fila_numero_cuota + fila_pago_i + fila_comision_i + fila_comision_iva_i + fila_ganancia_i 
		
		fila.innerHTML= html_fila;
		tabla.appendChild(fila)
	}

	/*Llenando la fila de totales
	let fila_total = document.createElement("tr")

	let fila_Total_datos = '<td> TOTAL </td> <td>'+ pago_total.toFixed(2) + '</td></td>'+comision_total.toFixed(2)+'</td><td>'+comision_iva_total.toFixed(2)
	fila_total.innerHTML = fila_Total_datos
	tabla.appendChild(fila_total)*/


	/*Llenando los datos de adjudicacion...*/
	let div_ganancia = document.getElementById("ganancia-total");
	div_ganancia.innerHTML = ganancia_total.toFixed(2);

	let div_adjudicacion = document.getElementById("adjudicacion");
	div_adjudicacion.innerHTML = cargo_adjudicacion.toFixed(2)

	let div_adjudicacion_iva = document.getElementById("adjudicacion-iva")
	div_adjudicacion_iva.innerHTML = cargo_adjudicacion_iva.toFixed(2)

	let div_inversion_total = document.getElementById("inversion-total")
	div_inversion_total.innerHTML = inversion_total.toFixed(2)



	/****AGREGANDO BOTONES***/

	/*Agregando Boton para descargar*/
	let body_fase_2 = document.getElementById("fase-2-body-id");

	//Verificando si ya existe el boton
	if (body_fase_2.lastChild.tagName != "BUTTON"){
		let button_descargar = document.createElement("button");
		button_descargar.setAttribute("onclick", "descargar_tabla()");
		button_descargar.innerHTML = "Descargar Tabla"

		body_fase_2.appendChild(button_descargar)
	}

	/**Activando boton de Guardar**/
	let button_guardar = document.getElementById("guardar-tabla")
	button_guardar.disabled = false
	

}



/*Crea tabla de amortizacion del solicitante*/
function hacer_tabla_amortizacion() {
	// body...
	let tasa_diaria = TASA_INTERES_ANUAL/360 ; // tasa diaria

	let tasa_mensual = [ Math.pow((1 + tasa_diaria),(360/12)) ] - 1 ;

	

	let cuota_mensual = PMT(tasa_mensual, PLAZO, MONTO_SOLICITANTE)*-1


	let tabla = document.getElementById("tabla-amortizacion-id");
	let capital_por_pagar_n = MONTO_SOLICITANTE
	let cuota_n = cuota_mensual 

	let capital_TOTAL =0
	let cuota_TOTAL = 0
	let intereses_TOTAL = 0

	let lista_capital_insoluto = [7000]
	let lista_cuotas = []
	let lista_intereses = []
	let lista_capitales = []

	for (var i = 0; i < PLAZO; i++) {
		let fila = document.createElement("tr")
		
		
		/*Intereses mensual*/
		intereses_n = capital_por_pagar_n*tasa_mensual
		intereses_TOTAL += intereses_n
		lista_intereses.push(intereses_n)


		capital_n = cuota_n - intereses_n  //capital
		

		if (i == PLAZO-1){
			capital_n = MONTO_SOLICITANTE - capital_TOTAL //capital mensual
			cuota_n = capital_n + intereses_n //cuota a pagar
			
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


		/*
		let fila_numero_cuota = '<td>'+ (i+1) +'</td>'
		let fila_cuota_n = '<td>'+ cuota_n.toFixed(2)+'</td>'
		let fila_capital_n = '<td>'+ capital_n.toFixed(2)+'</td>'
		let fila_intereses_n = '<td>'+ intereses_n.toFixed(2)+'</td>'
		let fila_capital_insoluto = '<td>'+ capital_por_pagar_n.toFixed(2)+'</td>'




		let html_fila = fila_numero_cuota + fila_cuota_n + fila_capital_n + fila_intereses_n + fila_capital_insoluto 
		
		fila.innerHTML= html_fila;
		tabla.appendChild(fila)*/

	}

	/*
	let fila_total = document.createElement("tr")

	let fila_Total_datos = '<td> TOTAL </td> <td>'+ cuota_TOTAL.toFixed(2) + '</td></td>'+capital_TOTAL.toFixed(2)+'</td><td>'+intereses_TOTAL.toFixed(2)
	fila_total.innerHTML = fila_Total_datos
	tabla.appendChild(fila_total)*/

	let diccionario = {'lista_cuotas': lista_cuotas, 
						'lista_capital_insoluto': lista_capital_insoluto,
						'lista_intereses': lista_intereses,
						'lista_capitales':lista_capitales}

	return diccionario
}


/*Guardar tabla y enviarla al servidor*/
function guardar_tabla(argument) {
	// body...

	let id_user = 2;
	let id_solicitud = 1;
	let date = new Date()
	let fecha_pago  = date.getFullYear() + "-" + (date.getMonth()+1) + "-" +date.getDate()


	let monto = document.getElementById("input-monto").value
	let adjudicacion = document.getElementById("adjudicacion").textContent;
	let adjudicacion_iva = document.getElementById("adjudicacion-iva").textContent;
	let inversion_total = document.getElementById("inversion-total").textContent;
	let ganancia_total = document.getElementById("ganancia-total").textContent;

	let inversion = {"monto": monto, 
						"id_user": id_user,
						"id_solicitud": id_solicitud,
						"adjudicacion": adjudicacion,
						"adjudicacion_iva": adjudicacion_iva,
						"inversion_total": inversion_total,
						"ganancia_total": ganancia_total
					}

		
	let pagos = [];
	let tabla = document.getElementById("tabla-amortizacion-id");
	let tabla_childrens = tabla.children


	for (var i = 0; i < PLAZO; i++) {

		let fila_i = tabla_childrens[i+1];
		let fila_i_childrens = fila_i.children;

		let pago = fila_i_childrens[1].textContent;
		let comision = fila_i_childrens[2].textContent;
		let comision_iva = fila_i_childrens[3].textContent;
		let ganancia = fila_i_childrens[4].textContent;
		

		
		let orden = {"orden": i+1,
						"fecha":fecha_pago,
						"pago": pago,
						"comision": comision,
						"comision_iva": comision_iva,
						"ganancia": ganancia,
					}

		date.setDate(date.getDate() + 30)
		fecha_pago  = date.getFullYear() + "-" + (date.getMonth()+1) + "-" +date.getDate()

		pagos.push(orden);

	}

	/*		{
				"inversion": 
				{
					"monto": "1400.23",
					"id_user": "2",
					"id_solicitud": "1",
					"adjudicacion": "16.00",
					"adjudicacion_iva": "1.92",
					"inversion_total": "2017.92",
					"ganancia_total": "2221.10"
				},
				"pagos":
				[ 
					{ "orden":"1",
						"fecha": "2020-05-23",
						"pago": "227.86",
						"comision": "9.00",
						"comision_iva": "1.08",
						"ganancia": "217.787"
					} 
				]
			}
	*/

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

    	response_data = JSON.parse(this.response)
      	alert(response_data.mensaje)

   		}
  	};
	xhttp.open("POST", RUTA_FASE_2, true);
	xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify({
								"inversion": inversion,
								"pagos": pagos,
							})
				);


}

/*Descargar tabla*/
function descargar_tabla() {
	// body...

	/*Consiguiendo datos del header*/
	let monto = document.getElementById("input-monto").value
	let adjudicacion = document.getElementById("adjudicacion").textContent;
	let adjudicacion_iva = document.getElementById("adjudicacion-iva").textContent;
	let inversion_total = document.getElementById("inversion-total").textContent;
	let ganancia_total = document.getElementById("ganancia-total").textContent;


	/*Consiguiendo los datos de la tabla*/
	let tabla = document.getElementById("tabla-amortizacion-id");
	let tabla_childrens = tabla.children


	let datos_tabla = [] 

	for (var i = 0; i < PLAZO; i++) {

		let fila_i = tabla_childrens[i+1];
		let fila_i_childrens = fila_i.children;


		let pago = fila_i_childrens[1].textContent;
		let comision = fila_i_childrens[2].textContent;
		let comision_iva = fila_i_childrens[3].textContent;
		let ganancia = fila_i_childrens[4].textContent;

		/*Llenando las listas*/
		let list_tmp = []
		list_tmp.push(i+1)
		list_tmp.push(pago)
		list_tmp.push(comision)
		list_tmp.push(comision_iva)
		list_tmp.push(ganancia)

		datos_tabla.push(list_tmp)


	}



	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var file = new Blob([this.response], { 
        						type: 'application/pdf' 
    	});

    	var link = document.createElement("a");
		link.href = window.URL.createObjectURL(file);
		link.download = "Tabla Inversion.pdf";
		document.body.appendChild(link);
		link.click()

   		}
  	};
	xhttp.open("POST", RUTA_FASE_2, true);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.responseType = "blob"
	xhttp.send(JSON.stringify({
								"datos_tabla": datos_tabla, 
							})
				);

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