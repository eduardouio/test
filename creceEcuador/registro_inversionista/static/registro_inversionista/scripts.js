let HOST = "http://localhost:8000/"
let RUTA_USUARIOS = HOST+"inversionista/"
let RUTA_DASHBOARD = HOST+"inversionista/dashboard/"



function go_to_dashboard(user) {
	// body...
	usuario = user
	//location.href = "http://localhost:8000/inversionista/dashboard/";

	let botones = document.getElementById("botones")

	botones.style.display='none'

	let dashboard = document.getElementById("dashboard")

	dashboard.style.display = 'block'

	let nombre_usuario = document.getElementById("nombre-usuario")

	nombre_usuario.innerHTML = usuario.data.nombres +" "+ usuario.data.apellidos

}


function obtener_Usuario(dic_tokens, username){

    access = dic_tokens.access
    $.ajax({
        url: RUTA_USUARIOS+username,
        type: 'GET',
        dataType: 'json', // added data type
        Authorization: access,
        success: function(res) {

            go_to_dashboard(res)
        }
    });

    
}