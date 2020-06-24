let RUTA_USUARIOS = "/inversionista/"
let RUTA_DASHBOARD = "/inversionista/dashboard/"



function go_to_dashboard(user) {
	// body...
	usuario = user

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

function login(argument) {
    // body...

    let usuario = document.getElementById("id_username").value

    let password = document.getElementById("id_password").value
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {


            var next = getParameterByName('next')
            if(next){
                window.location.href = next
            }
            else{
                window.location.href = RUTA_DASHBOARD
            }


        }else if(this.status == 401 && this.readyState == 4){
            console.log(this)

            let label_error = document.getElementById("label_error")
            label_error.innerHTML = "Usuario o contraseña incorrectos"
            $(".crece-login-container-form-wrapper-error").show()
        }
    };
    xhttp.open("POST", "/inversionista/login/", true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
                                "username": usuario,
                                "password": password,
                            })
                );



}

function mostrar_inversionista(argument) {
    // body...
    let botones = document.getElementById("botones")

    botones.style.display='none'
    let dashboard = document.getElementById("dashboard")

    dashboard.style.display = 'block'

    $("header").hide();
    $("footer").hide()
}



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}