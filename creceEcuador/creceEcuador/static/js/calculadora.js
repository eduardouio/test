
const CASE_CAPITAL = "CAPITAL"
const CASE_PLAZO = "PLAZO"
const CASE_PORCENTAJE = "PORCENTAJE"


const LIST_TIR_ANUAL = [0.178, 0.206, 0.215, 0.221, 0.226, 0.229, 0.232, 0.235, 0.237, 0.238, 0.240, 0.241, 0.242, 0.243, 0.244, 0.245]
const LIST_TASA = [0.0391, 0.0491, 0.0592, 0.0693, 0.0795, 0.0898, 0.1002, 0.1106, 0.1212, 0.1318, 0.1424, 0.1532, 0.1640, 0.1749, 0.1859, 0.1970]


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


$(document).ready(function(){
     
     /*Solicitante*/
  	let slider_capital = document.getElementById("rango-capital");
  	let slider_plazo = document.getElementById("rango-plazo");
  	let slider_tasa = document.getElementById("rango-tasa");

  	mostrar_valor(slider_capital, CASE_CAPITAL)
  	mostrar_valor(slider_plazo, CASE_PLAZO)
  	mostrar_valor(slider_tasa, CASE_PORCENTAJE)
  	calcular_cuota()

  	slider_capital.addEventListener('input', function () {
		// body...
		mostrar_valor(this, CASE_CAPITAL)
		calcular_cuota()
	}, false)


	
	slider_plazo.addEventListener('input', function () {
		// body...
		mostrar_valor(this, CASE_PLAZO)
		calcular_cuota()
	}, false)
  	

  	
	slider_tasa.addEventListener('input', function () {
		// body...
		mostrar_valor(this, CASE_PORCENTAJE)
		calcular_cuota()
	}, false)


  	/*Inversionista*/
  	
  	let capital_inversionista = document.getElementById("rango-capital'inversionista");
  	let plazo_inversionista = document.getElementById("rango-plazo'inversionista");

  	mostrar_valor_inversionista(capital_inversionista, CASE_CAPITAL);
  	mostrar_valor_inversionista(plazo_inversionista, CASE_PLAZO);
  	calcular_valor_final_inversionista();

	capital_inversionista.addEventListener('input', function () {
		// body...
		mostrar_valor_inversionista(this, CASE_CAPITAL);
		calcular_valor_final_inversionista();
	}, false)

	plazo_inversionista.addEventListener('input', function () {
		// body...
		mostrar_valor_inversionista(this, CASE_PLAZO);
		calcular_valor_final_inversionista();

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
	let cuota_mensual = FORMAT_CURRENCY.format(PMT(tasa_mensual, plazo, capital)*-1);


	let div_cuota =  document.getElementById("cuota-valor")
	div_cuota.innerHTML = cuota_mensual


}


function mostrar_valor(input, formato) {

	let id = "valor-"+input.name
	let output = document.getElementById(id);
	let valor = ''
	switch (formato){

		case CASE_CAPITAL:
			valor = FORMAT_CURRENCY.format(parseInt(input.value))
			break;
		case CASE_PLAZO:
			valor = parseInt(input.value)+" meses"
			break;
		case CASE_PORCENTAJE:
			valor = FORMAT_PERCENT.format(parseInt(input.value)/100)
			break;
		default:
			console.log("ERROR")

	}
	

	output.innerHTML = valor;
	 //valor_capital.innerHTML = slider_capital.value;
}

function mostrar_valor_inversionista(input, formato) {
	// body...
	let id = "valor-"+input.name+"-inversionista"
	let output = document.getElementById(id);
	let valor = ''
	switch (formato){

		case CASE_CAPITAL:
			valor = FORMAT_CURRENCY.format(parseInt(input.value))
			break;
		case CASE_PLAZO:
			valor = parseInt(input.value)+" meses"
			break;
		default:
			console.log("ERROR")

	}
	output.innerHTML = valor;
	 //valor_capital.innerHTML = slider_capital.value;
}

/*
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


	let cuota_mensual_inversionista = FORMAT_CURRENCY.format(capital_inversionista_cuota + interes_inversionista_cuota);

	let div_cuota =  document.getElementById("cuota-valor-inversionista")
	div_cuota.innerHTML = cuota_mensual_inversionista


}

*/

function calcular_valor_final_inversionista() {
	// body...
	let inputs = document.getElementsByClassName("inversionista inversionista-slider");
	let capital_inversionista = parseInt(inputs[0].value);
	let plazo_inversionista = parseInt(inputs[1].value);
	let index = plazo_inversionista - 3 //-3 porque es el minimo plazo que puede ingresar
	let tasa = LIST_TASA[index]
	let base = 1+tasa;
	let valor_final_inversionista = capital_inversionista * base 
	let valor_final_formatted = FORMAT_CURRENCY.format(valor_final_inversionista);
	let div_cuota =  document.getElementById("cuota-valor-inversionista")
	div_cuota.innerHTML = valor_final_formatted

	let tir = FORMAT_PERCENT.format(LIST_TIR_ANUAL[index])
	let div_tir = document.getElementById("tir-valor-inversionista");
	div_tir.innerHTML = tir


	/*AGregando valor a las comparaciones*/

	let div_comparacion_crece = document.getElementById("comparacion-crece")
	div_comparacion_crece.innerHTML =  valor_final_formatted


	
	base = (1 + (0.045 / plazo_inversionista) ) 
	let exponent = plazo_inversionista

	let valor_final_bancos = capital_inversionista * [ Math.pow( base, exponent ) ]

	let valor_final_bancos_formatted = FORMAT_CURRENCY.format(valor_final_bancos)
	let div_comparacion_banco = document.getElementById("comparacion-bancos")
	div_comparacion_banco.innerHTML = valor_final_bancos_formatted

	render_progress_bar(valor_final_inversionista, valor_final_bancos)

}

function render_progress_bar(valor_crece, valor_banco) {
	// body...
	let div_progress_banco =  document.getElementById("banco-progress-id")
	let div_progress_crece =  document.getElementById("crece-progress-id")

	if( valor_crece > valor_banco){
		let diferencia = valor_banco / valor_crece

		let porcentaje = FORMAT_PERCENT.format(diferencia)

		

		div_progress_banco.style.width = porcentaje
		div_progress_crece.style.width = "100%"
	} else{
		let diferencia = valor_crece / valor_banco

		let porcentaje = FORMAT_PERCENT.format(diferencia)



		div_progress_crece.style.width = porcentaje
		div_progress_banco.style.width = "100%"
	}


}




function format(input)
{
var num = input.value.replace(/\./g,'');
if(!isNaN(num)){
num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
num = num.split('').reverse().join('').replace(/^[\.]/,'');
input.value = num;
}
  
else{ alert('Solo se permiten numeros');
input.value = input.value.replace(/[^\d\.]*/g,'');
}
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



