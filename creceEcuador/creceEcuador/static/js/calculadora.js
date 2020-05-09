let MONTO_SOLICITANTE=0;
let TASA_INTERES_ANUAL = 0;

$(document).ready(function(){
     
     /*Solicitante*/
  	let slider_capital = document.getElementById("rango-capital");
  	let slider_plazo = document.getElementById("rango-plazo");
  	let slider_tasa = document.getElementById("rango-tasa");

  	mostrar_valor(slider_capital)
  	mostrar_valor(slider_plazo)
  	mostrar_valor(slider_tasa)
  	calcular_cuota()

  	slider_capital.addEventListener('input', function () {
		// body...
		mostrar_valor(this)
		calcular_cuota()
	}, false)


	
	slider_plazo.addEventListener('input', function () {
		// body...
		mostrar_valor(this)
		calcular_cuota()
	}, false)
  	

  	
	slider_tasa.addEventListener('input', function () {
		// body...
		mostrar_valor(this)
		calcular_cuota()
	}, false)


  	/*Inversionista*/
  	
  	let capital_inversionista = document.getElementById("rango-capital'inversionista");
  	let plazo_inversionista = document.getElementById("rango-plazo'inversionista");

  	mostrar_valor_inversionista(capital_inversionista);
  	mostrar_valor_inversionista(plazo_inversionista);
  	calcular_cuota_inversionista()

	capital_inversionista.addEventListener('input', function () {
		// body...
		mostrar_valor_inversionista(this);
		calcular_cuota_inversionista();
	}, false)

	plazo_inversionista.addEventListener('input', function () {
		// body...
		mostrar_valor_inversionista(this);
		calcular_cuota_inversionista()

	}, false)

	
});


function calcular_cuota() {
	// body...
	let inputs = document.getElementsByClassName("slider");

	let capital = parseInt(inputs[0].value);
	let plazo = parseInt(inputs[1].value);
	let tasa_interes_anual = parseInt(inputs[2].value)/100;
	
	
	
	let tasa_diaria = tasa_interes_anual/360;
	let tasa_mensual = [ Math.pow((1 + tasa_diaria),(360/12)) ] - 1 ;
	let cuota_mensual = PMT(tasa_mensual, plazo, capital)*-1;


	let div_cuota =  document.getElementById("cuota-valor")
	div_cuota.innerHTML = "$"+cuota_mensual.toFixed(2)

	MONTO_SOLICITANTE = capital

	TASA_INTERES_ANUAL = tasa_interes_anual
}


function mostrar_valor(input) {

	let id = "valor-"+input.name
	let output = document.getElementById(id);
	 //var slider_capital = document.getElementById("rango-capital");
	output.innerHTML = parseInt(input.value);
	 //valor_capital.innerHTML = slider_capital.value;
}

function mostrar_valor_inversionista(input) {
	// body...
	let id = "valor-"+input.name+"-inversionista"
	let output = document.getElementById(id);
	 //var slider_capital = document.getElementById("rango-capital");
	output.innerHTML = parseInt(input.value);
	 //valor_capital.innerHTML = slider_capital.value;
}


function calcular_cuota_inversionista(){
	let inputs = document.getElementsByClassName("inversionista inversionista-slider");
	let capital_inversionista = parseInt(inputs[0].value);
	let plazo_inversionista = parseInt(inputs[1].value);


	let participacion_inversionista = (capital_inversionista/MONTO_SOLICITANTE);

	let tasa_diaria = TASA_INTERES_ANUAL/360;
	let tasa_mensual = [ Math.pow((1 + tasa_diaria),(360/12)) ] - 1 ;

	let cuota_mensual_solicitante = PMT(tasa_mensual, plazo_inversionista, MONTO_SOLICITANTE)*-1;

	let interes_solicitante = MONTO_SOLICITANTE * tasa_mensual;
	let capital_solicitante = cuota_mensual_solicitante - interes_solicitante

	let capital_inversionista_cuota =  capital_solicitante * participacion_inversionista;
	let interes_inversionista_cuota = interes_solicitante * participacion_inversionista;


	let cuota_mensual_inversionista = capital_inversionista_cuota + interes_inversionista_cuota;

	let div_cuota =  document.getElementById("cuota-valor-inversionista")
	div_cuota.innerHTML = "$"+cuota_mensual_inversionista.toFixed(2)


}


/*** Funcion PMT (el mismo codigo esta en fases_inversiones/scripts.js ****/
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



