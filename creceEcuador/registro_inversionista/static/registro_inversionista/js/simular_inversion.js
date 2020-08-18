
let COMISION_COBRANZA_INSOLUTO_MENSUAL = 0.004;
let IVA = 0.12
let COMISION_ADJUDICACION_FACTOR =0.006;
let ADJUDICACION_FACTOR = 1.12
let DICCIONARIO_SIMULACION = {}
let OPORTUNIDAD = {}
let RUTA_FASE_1 ="/registro/aceptar_inversion/"

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

let crece_modal = document.getElementById("crece-modal-simular-inversion-id")
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == crece_modal) {
    crece_modal.style.display = "none";
  }
}

let span_close_modal = document.getElementById("span-close-modal-id")
span_close_modal.addEventListener('click', function () {
	// body...
	crece_modal.style.display = 'none'
})

function crear_modal_simulacion_inversion(id_oportunidad,input_modal){
  $.ajax({
      url: RUTA_SOLICITUDES+id_oportunidad+'/',
      type: 'GET',
      dataType: 'json', // added data type
      success: function(res) {
          
          if (res.data){
          	let crece_modal = document.getElementById("crece-modal-simular-inversion-id")
          	crece_modal.style.display = 'block'
          	let boton_invertir  = document.getElementById("simular-inversion-boton-invertir")
          	let input_monto_inversion = document.getElementById("input-monto-detalle-solicitud").value
          	boton_invertir.addEventListener('click', function (argument) {
          		// body...
          		go_to_fase1(res.data, input_monto_inversion)
          	})

          	let barra_porcentaje_financiado = document.getElementById("crece-operaciones-contenido-monto-barra-progreso-id")
          	let oportunidad = res.data
          	porcentaje_financiado = oportunidad.porcentaje_financiado
          	barra_porcentaje_financiado.style.width = porcentaje_financiado+'%'

          	document.getElementById('strong-monto-recolectado').innerHTML =  numeroConComas(calcularPorcentajeFinanciado(oportunidad.monto, oportunidad.porcentaje_financiado))
          	document.getElementById("span-pr-recolectado").innerHTML = oportunidad.porcentaje_financiado+'% recolectado'
          	document.getElementById("strong-monto-objetivo").innerHTML =  numeroConComas(decimalAEntero(oportunidad.monto))
          	
            calcular_tabla_inversionista(input_modal,res.data);
          }  
      },
      error: function(xhr, status, error) {
          var err = JSON.parse(xhr.responseText);
          alert("Solicitud no encontrada.");
      }
  });
}

function go_to_fase1(oportunidad, monto){
	window.location.href = ruta_fase_1(oportunidad.id, monto)
}

/*Calcula valores de las cuotas y llena la tabla de inversion*/
function calcular_tabla_inversionista(input_modal,oportunidad) {

	// body...
	let diccionario = {}
	let input_monto_inversion = 0
	if (input_modal === 'TRUE'){
		input_monto_inversion = document.getElementById("input-monto").value
		document.getElementById("input-monto-detalle-solicitud").value = input_monto_inversion
		diccionario = DICCIONARIO_SIMULACION
		oportunidad = OPORTUNIDAD
	}else{
		diccionario = hacer_tabla_amortizacion(oportunidad)
		DICCIONARIO_SIMULACION = diccionario
		OPORTUNIDAD = oportunidad
		input_monto_inversion = document.getElementById("input-monto-detalle-solicitud").value
		document.getElementById("input-monto").value = input_monto_inversion
	}

	let tabla = document.getElementById("tabla-amortizacion-id");
	let tabla_inversionista_grid = document.getElementById("crece-tabla-inversionista-id");

	/*Verificando que ya exista la tabla*/
	if (tabla.children.length > 1) {
		let last_child = tabla.lastChild

		for (var i = oportunidad.plazo - 1; i >= 0; i--) {
			let last_child = tabla.lastChild
			tabla.removeChild(last_child)
		}


		
	}
	
	
	let monto_inversion = parseInt(input_monto_inversion, 10)

	
	let lista_capital_insoluto_sol = diccionario['lista_capital_insoluto']
	let lista_cuotas_sol = diccionario['lista_cuotas']
	let lista_intereses_sol = diccionario['lista_intereses']
	let lista_capitales_sol = diccionario['lista_capitales']



	let participacion_inversionista = (monto_inversion/oportunidad.monto)
	let participacion_inversionista_porcentaje = participacion_inversionista *100
	let COMISION_ADJUDICACION = oportunidad.monto * COMISION_ADJUDICACION_FACTOR
	let cargo_adjudicacion = COMISION_ADJUDICACION * participacion_inversionista * ADJUDICACION_FACTOR //REVISAR***
	let cargo_adjudicacion_iva = cargo_adjudicacion * IVA
	let inversion_total = monto_inversion + cargo_adjudicacion + cargo_adjudicacion_iva //Verficar si se agrega el adjudicacion IVA

	
	let ganancia_total = 0;
	let pago_total = 0;
	let comision_total = 0;
	let comision_iva_total = 0;

	for (var i = 0; i < oportunidad.plazo ; i++) {
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
		comision_total_i = comision_i + comision_iva_i
		/*LLenando la tabla */
		let fila = document.createElement("tr")

		let fila_numero_cuota = '<td>'+ (i+1) +'</td>'
		let fila_capital_i= '<td>'+ FORMAT_CURRENCY.format(pago_i)+'</td>'
		let fila_intereses_i = '<td>'+ FORMAT_CURRENCY.format(interes_i)+'</td>'
		let fila_comision_total_i = '<td>'+ FORMAT_CURRENCY.format(comision_total_i)+'</td>'
		let fila_ganancia_i = '<td>'+ FORMAT_CURRENCY.format(ganancia_i)+'</td>'

		let html_fila = fila_numero_cuota + fila_capital_i + fila_intereses_i + fila_comision_total_i + fila_ganancia_i 
		
		fila.innerHTML= html_fila;
		tabla.appendChild(fila)

		

	}



	
	

}



/*Crea tabla de amortizacion del solicitante*/
function hacer_tabla_amortizacion(oportunidad) {
	// body...

	let date = new Date()
	let next_date = new Date(date.getFullYear(),date.getMonth()+1,date.getDate())
	let date_tmp = new Date()
	
	let fechas = []
	let dias = []
	

	let fecha_pago  = date.getFullYear() + "-" + (date.getMonth()+1) + "-" +date.getDate()
	let dias_transcurridos = getDuration(date-date).value
	fechas.push(fecha_pago)
	dias.push(dias_transcurridos)
	for (var i = 0; i < oportunidad.plazo; i++) {
		
		
		if(next_date.getDay() == 0){
			
			next_date.setDate(next_date.getDate() + 1) //lunes
			dias_transcurridos = getDuration(next_date-date).value
			date.setDate(next_date.getDate())
			fecha_pago  = next_date.getFullYear() + "-" + (next_date.getMonth()+1) + "-" +next_date.getDate()
			next_date.setDate(next_date.getDate()-1)
		}
		else if(next_date.getDay() == 6){
			next_date.setDate(next_date.getDate() + 2) //lunes
			dias_transcurridos = getDuration(next_date-date).value
			date.setDate(next_date.getDate())
			fecha_pago  = next_date.getFullYear() + "-" + (next_date.getMonth()+1) + "-" +next_date.getDate()
			next_date.setDate(next_date.getDate()-2)
		}else{
			dias_transcurridos = getDuration(next_date-date).value
			date.setDate(next_date.getDate())
			fecha_pago  = next_date.getFullYear() + "-" + (next_date.getMonth()+1) + "-" +next_date.getDate()
		}
		
		dias.push(dias_transcurridos)
		date.setMonth(date.getMonth()+1)
		next_date.setMonth(next_date.getMonth()+1)
		fechas.push(fecha_pago)
		
	}


	let plazo_dias = dias.reduce((a, b) => a + b, 0)
	let TASA_INTERES_ANUAL = oportunidad.tin;
	let tasa_diaria = (1+TASA_INTERES_ANUAL/plazo_dias)-1 ; // tasa diaria

	let tasa_mensual = [ Math.pow((1 + tasa_diaria),(plazo_dias/oportunidad.plazo)) ] - 1 ;
	let cuota_mensual = PMT(tasa_mensual, oportunidad.plazo, oportunidad.monto)*-1

	let tabla = document.getElementById("tabla-amortizacion-id");
	let MONTO_SOLICITANTE = parseInt(oportunidad.monto, 10)
	let capital_por_pagar_n = MONTO_SOLICITANTE
	let cuota_n = cuota_mensual 

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


		capital_n = cuota_n - intereses_n  //capital
		

		if (i == oportunidad.plazo-1){
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


	}


	let diccionario = {'lista_cuotas': lista_cuotas, 
						'lista_capital_insoluto': lista_capital_insoluto,
						'lista_intereses': lista_intereses,
						'lista_capitales':lista_capitales}

	return diccionario
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