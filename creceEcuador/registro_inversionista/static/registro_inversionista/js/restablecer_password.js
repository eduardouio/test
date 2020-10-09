let RUTA_RESTABLECER_PASSWORD = "/inversionista/restablecer_password/"
let RUTA_CONFIRMAR_RESTABLECER_PASSWORD = '/inversionista/confirmar_restablecer_password/'
let RUTA_CAMBIAR_PASSWORD_PERFIL = '/inversionista/cambiar_password/'

function restablecer_password() {
    // body...
    let usuario = document.getElementById("id_username").value

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            insertar_timestamps(usuario)
            let super_container = document.getElementById("crece-reset-password-super-container")
                super_container.style.display = 'none'

            let timeline_container = document.getElementById("crece-reset-password-envio-email-timeline")
                timeline_container.style.display = 'block'

        }else if(this.status == 404 && this.readyState == 4){

            let label_error = document.getElementById("label_error")
            $(".crece-login-container-form-wrapper-error").show()

        }
    };
    xhttp.open("POST", RUTA_RESTABLECER_PASSWORD, true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
                                "username": usuario,
                            })
                );
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


function confirmar_restablecer_password() {
    // body...
    let check_password = confirmar_password()

    if (check_password){
        var xhttp = new XMLHttpRequest();
        let new_password = document.getElementById("id_password").value
        let url = window.location.pathname.split("/")
        let uid = url[3]
        let token = url[4]

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                window.location.href = "/inversionista/login/?reset=True";

                              
                
            }else if(this.status == 404 && this.readyState == 4){
                console.log("ERROr")
                

            }
        };
        xhttp.open("POST", RUTA_CONFIRMAR_RESTABLECER_PASSWORD);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({
                                    "uid": uid,
                                    "token":token,
                                    "password": new_password,
                                })
                    );
    }
}

function cambiar_password() {
    // body...
     let check_password = confirmar_password()

     if (check_password){
        var xhttp = new XMLHttpRequest();
        let new_password = document.getElementById("id_password").value

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $('#label_mensaje_new_pass').show();
                

                              
                
            }else if(this.status == 404 && this.readyState == 4){
                console.log("ERROr")
                

            }
        };
        xhttp.open("POST", RUTA_CAMBIAR_PASSWORD_PERFIL);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({
                                    
                                    "password": new_password,
                                })
                    );
    }

}




function switch_mostrar_ocultar_password(confirmar) {
    // body...
    if (confirmar === "confirmar"){
        let input_password = document.getElementById("id_confirmar_password");
        let div_text = document.getElementById("crece-show-hide-confirmar-password")
          if (input_password.type === "password") {
            input_password.type = "text";
            div_text.innerHTML = "OCULTAR"
          } else {
            input_password.type = "password";
            div_text.innerHTML = "MOSTRAR"
          }
    }else{
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
    
}


function confirmar_password() {
    // body...
    let check_confirmar_password = document.getElementById("check-confirmar-password-id")
    let check_password = document.getElementById("check-password-id")
    let times_confirmar_password = document.getElementById("times-confirmar-password-id")
    let times_password = document.getElementById("times-password-id")
    let input_confirmar_password = document.getElementById("id_confirmar_password")
    let input_password = document.getElementById("id_password")
    let label_error_password = document.getElementById("crece-mensaje-invalid-input-password")
    let label_error_confirmar_password = document.getElementById("crece-mensaje-invalid-input-confirmar-password")

    if (!input_confirmar_password.value && !input_password.value){
        check_confirmar_password.style.display = 'none'
        times_confirmar_password.style.display = 'none'
                label_error_password.style.display = "block"
          
                label_error_confirmar_password.style.display = "block"
        return false
    }
    else if( input_confirmar_password.value === input_password.value){
        check_confirmar_password.style.display = 'block'
        check_password.style.display = 'block'
        times_confirmar_password.style.display = 'none'
        times_password.style.display = 'none'
        label_error_confirmar_password.style.display = "none"
        label_error_password.style.display = "none"
        label_error_confirmar_password.innerHTML = "Confirme su contraseña"

        return true
    }else{
        check_confirmar_password.style.display = 'none'
        times_confirmar_password.style.display = 'block'
        times_password.style.display = 'block'
        label_error_confirmar_password.style.display = "block"
                label_error_confirmar_password.innerHTML = "Las contraseñas no coinciden"
        return false
    }
}


function mostrar_check(input) {
    // body...
    input.className = 'crece-form-input crece-form-valid-input'
    let id_check_fa = "check-"+input.name+"-id"
                let check_fa = document.getElementById(id_check_fa)
                check_fa.style.display = 'block'
                let id_times_fa = "times-"+input.name+"-id"
                let times_fa = document.getElementById(id_times_fa)
                times_fa.style.display = 'none'
                let id_error = "crece-mensaje-invalid-input-"+input.name
            let label_error = document.getElementById(id_error)
            label_error.style.display = "none"
}


function mostrar_times(input) {
    // body...
    input.className = 'crece-form-input crece-form-invalid-input'
            let id_times_fa = "times-"+input.name+"-id"
            let times_fa = document.getElementById(id_times_fa)
            times_fa.style.display = 'block'
            let id_check_fa = "check-"+input.name+"-id"
            let check_fa = document.getElementById(id_check_fa)
            check_fa.style.display = 'none'

            let id_error = "crece-mensaje-invalid-input-"+input.name
            let label_error = document.getElementById(id_error)
            label_error.style.display = "block"
            input.focus()
}