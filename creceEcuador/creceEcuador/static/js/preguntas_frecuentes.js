


$(document).ready(function(){

	let preguntas_container = document.getElementsByClassName("pregunta-frecuente");
	let respuestas_container = document.getElementsByClassName("respuesta-frecuente")

	for (var i = 0; i < preguntas_container.length; i++) {
		pregunta = preguntas_container[i];
		respuesta = respuestas_container[i];

		pregunta.setAttribute("id", "pregunta-"+i);
		respuesta.setAttribute("id", "respuesta-"+i);

		pregunta.addEventListener("click", function () {
			// body...
			mostrar_respuesta(this);
		})

	}
});


function mostrar_respuesta(pregunta) {
	// body...
	let id = pregunta.id.split("-")[1];
	let child = pregunta.children[0];
	let parent = pregunta.parentNode;
	
	if( pregunta.className == "col pregunta-frecuente"){

		pregunta.className += " desplegado";
		child.className = "fa fa-angle-up";
		let respuesta_container = document.getElementById("respuesta-"+id);

		respuesta_container.style.display = "block";
		//respuesta_container.style.height = "200px";

	} else{
		pregunta.className = "col pregunta-frecuente";
		child.className = "fa fa-angle-down";
		let respuesta_container = document.getElementById("respuesta-"+id);

		respuesta_container.style.display = "none";
		//respuesta_container.style.height = "100%";
	}

	
}


function agregar_pregunta_frecuente() {
	// body...


}