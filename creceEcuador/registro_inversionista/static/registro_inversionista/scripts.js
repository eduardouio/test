let RUTA_USUARIOS = "/inversionista/"
let RUTA_DASHBOARD = "/inversionista/dashboard/"
let RUTA_REENVIAR_EMAIL_CONFIRMACION = '/inversionista/reenviar_email/'


$(document).ready(function() {
    var next = getParameterByName('reset')
    if (next){
        $(".crece-login-container-form-wrapper-error").show()
        let label_error = document.getElementById("label_error")
            label_error.style.display = 'none'
        
        let label_reset_password = document.getElementById("label_mensaje_new_pass")
        label_reset_password.style.display = "block"
    }
        
});

function ingresar_enter(event) {
    // body...
    if (event.keyCode === 13) {
       event.preventDefault();
       document.getElementById("btn_ingresar").click();
      }
}

function switch_mostrar_ocultar_password() {
    // body...
    let input_password = document.getElementById("id_password");
    let div_text = document.getElementById("crece-show-hide-password")
      if (input_password.type === "password") {
        input_password.type = "text";
        div_text.innerHTML = "OCULTAR"
      } else {
        input_password.type = "password";
        div_text.innerHTML = "MOSTRAR"
      }
}

function focus_password(event) {
    // body...
     if (event.keyCode === 13) {
       event.preventDefault();
       document.getElementById("id_password").focus();
      }
    
}

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

            let label_error = document.getElementById("label_error")
            label_error.style.display = 'block'
            let label_reset_password = document.getElementById("label_mensaje_new_pass")
            label_reset_password.style.display = "none"

            mensaje = JSON.parse(this.response).mensaje
            label_error.innerHTML = mensaje
            $(".crece-login-container-form-wrapper-error").show()
        

        }else if(this.status == 400 && this.readyState == 4){

            let label_error = document.getElementById("label_error")
            label_error.style.display = 'block'

            label_error.innerHTML = "Usuario o contraseña incorrectos"
            let label_reset_password = document.getElementById("label_mensaje_new_pass")
            label_reset_password.style.display = "none"
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


function insertar_timestamps(email){
  let timestamp_span = document.getElementById("span-hora-email-id")
  let date = new Date()
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes +" "+ ampm;
  let timestamp = date.toISOString().split('T')[0] +" "+ strTime 
  timestamp_span.innerHTML = timestamp

  let timestamp_email_span = document.getElementById("span-send-to-id")
  timestamp_email_span.innerHTML = "Hemos enviado un correo a "+email


}

function reenviar_confirmacion_email() {
    // body...

    let email = $("#crece-link-confirmar-registro").attr("email")

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            insertar_timestamps(email)
            let super_container = document.getElementById("crece-login-super-container")
                super_container.style.display = 'none'
            let super_container_exitoso = document.getElementById("crece-reenviar-confirmacion-email-super-container")
                super_container_exitoso.style.display = 'block'

        }else if(this.status == 401 && this.readyState == 4){

        }
    };
    xhttp.open("POST", RUTA_REENVIAR_EMAIL_CONFIRMACION, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
                                "username": email,
                            })
                );
}