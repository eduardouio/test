let RUTA_CANTONES = '/inversionista/cantones/'
let RUTA_ACUERDO_SITIO_PDF = 'acuerdo_uso_sitio/'
let RUTA_TERMINOS_LEGALES = 'terminos_legales/'
let RUTA_POLITICAS_PRIVACIDAD = 'politicas_privacidad/'
let RUTA_PREGUNTAS = "/inversionista/preguntas/"
let RUTA_RESPUESTAS = "/inversionista/respuestas/"

$(document).ready(function(){
    let select_canton = document.getElementById("id_canton")

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let cantones = JSON.parse(this.response)

            for (var i = 0; i < cantones.length; i++) {
                let canton = cantones[i].nombre
                let opcion = document.createElement("option")
                opcion.value = canton
                opcion.innerHTML = canton
                select_canton.appendChild(opcion) 
            }
            


        }else if(this.status == 401 && this.readyState == 4){
            console.log(this)

        }
    };
    xhttp.open("GET", RUTA_CANTONES, true);
    xhttp.send();



    let encuesta_container = document.getElementById("crece-registro-encuesta-container-id")

    // var xhttp2 = new XMLHttpRequest();
    // let html_pregunta = 
    // xhttp2.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         let preguntas = JSON.parse(this.response)

    //         for (var i = 0; i < preguntas.length; i++) {
    //             let pregunta = preguntas[i].texto
    //             let html_pregunta = `<div class="col-12 col-sm-6 col-lg-6 col-md-6 crece-registro-container-encuesta-pregunta crece-registro-container-form-wrapper" id="pregunta-container-`+(i+1)+`">
    //                                     <div class="row">
    //                                       <div class="col-12 crece-registro-encuesta-pregunta" id="pregunta-`+(i+1)+`"> <strong>`
    //                                       +pregunta+`</strong>
    //                                       </div>
    //                                     </div>
                                        
    //                                 </div>`
                
    //             encuesta_container.innerHTML += html_pregunta
               

    //         }
            


    //     }else if(this.status == 401 && this.readyState == 4){
    //         console.log(this)

    //     }
    // };
    // xhttp2.open("GET", RUTA_PREGUNTAS)
    // xhttp2.send()


    var xhttp3 = new XMLHttpRequest();

    xhttp3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let respuestas = JSON.parse(this.response)

            for (var i = 0; i < respuestas.length; i++) {
                let respuesta = respuestas[i].texto
                let id_respuesta = respuestas[i].id
                let id_pregunta = "pregunta-container-"+(id_respuesta.toString()[0])
                let pregunta_container = document.getElementById(id_pregunta)
                let input_respuesta = `<input type="radio" id="male" name="gender" value="male">`
                let row = document.createElement("div")
                row.setAttribute("class", "row")
                let html_respuesta = `
                                        
                                          <div class="col-12 crece-registro-encuesta-respuesta parent-`+id_pregunta+`">
                                              <input type="radio" id="respuesta-`+id_respuesta+`" name="respuesta-name-`+id_pregunta+`" value="`+respuesta+`">
                                              <label for="respuesta-`+id_respuesta+`">`+respuesta+`</label><br>
            
                                          </div>
                                        
                                        
                                    ` 
                row.innerHTML = html_respuesta

                pregunta_container.appendChild(row)

            }
            


        }else if(this.status == 401 && this.readyState == 4){
            console.log(this)

        }
    };
    xhttp3.open("GET", RUTA_RESPUESTAS)
    xhttp3.send()

});


function registrar(argument) {
    // body...

    let usuario = document.getElementById("id_usuario").value
    let password = document.getElementById("id_password").value
    let nombres = document.getElementById("id_nombres").value
    let apellidos = document.getElementById("id_apellidos").value
    let email = document.getElementById("id_email").value
    let celular = document.getElementById("id_celular").value
    let cedula = document.getElementById('id_cedula').value
    let tipo_persona = document.getElementById("id_tipo_persona").value
    tipo_persona = parse_tipo_persona(tipo_persona)
    let canton = document.getElementById("id_canton").value

    let lista_preguntas = ["¿En cuánto tiempo esperas recuperar tus inversiones?", "¿Cuánto esperas invertir a través de CRECE?",
                            "¿Qué nivel de riesgo se ajusta a tu perfil?","¿Cómo conociste a CRECE?"]
    let lista_respuestas = []
    let encuesta_container = document.getElementById("crece-registro-encuesta-container-id")

    for (var i = 0; i < encuesta_container.children.length; i++) {
        let pregunta_container = encuesta_container.children[i]
        let id_pregunta_container = pregunta_container.id
        let id_respuestas = "parent-"+id_pregunta_container
        let respuestas = document.getElementsByClassName(id_respuestas)
        for (var j = 0; j < respuestas.length; j++){
            respuesta = respuestas[j]

            let input_respuesta = respuesta.children[0]

            if(input_respuesta.checked){
                let label_respuesta = respuesta.children[1]
                lista_respuestas.push(input_respuesta.value)
            }else{
                
            }
        }

    }

    if(lista_respuestas.length != 4){
            let mensaje = "LLenar la encuesta"

                let label_error = document.getElementById("label_error_encuesta")
                label_error.innerHTML = mensaje
                $(".crece-login-container-form-wrapper-error-encuesta").show()
    }
    

    else if(usuario && password && nombres && apellidos && email && celular && cedula && tipo_persona && canton){
        let encuesta_dic = {"preguntas":lista_preguntas, "respuestas":lista_respuestas}
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                let registro_container = document.getElementById("crece-registro-container-id")
                registro_container.style.display = 'none'
                let mensaje = JSON.parse(this.response)
                let registro_exitoso = document.getElementById('crece-registro-exitoso-id')
                registro_exitoso.style.display = 'block'
                registro_exitoso.innerHTML = mensaje.mensaje

                // var next = getParameterByName('next')
                // if(next){
                //     window.location.href = next
                // }
                // else{
                //     window.location.href = RUTA_DASHBOARD
                // }


            }else if(this.status == 400 && this.readyState == 4){

                let mensaje = JSON.parse(this.response)

                let label_error = document.getElementById("label_error")
                label_error.innerHTML = mensaje.mensaje
                $(".crece-login-container-form-wrapper-error").show()
            }
        };
        xhttp.open("POST", "/inversionista/registro/", true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({
                                    "nombres": nombres,
                                    "password": password,
                                    "apellidos": apellidos,
                                    "usuario": usuario,
                                    "email": email,
                                    "celular": celular,
                                    "canton": canton,
                                    "tipo_persona": tipo_persona,
                                    "cedula": cedula,
                                    "encuesta": encuesta_dic,
                                })
                    );
    }else{
        let label_error = document.getElementById("label_error")
                label_error.innerHTML = "Datos incompletos"
                $(".crece-login-container-form-wrapper-error").show()
    }
    
}

function parse_tipo_persona(texto) {
    // body...
    if(texto === 'persona natural'){
        return 1
    }else{
        return 0
    }

}



let aceptar = document.getElementById("crece-acepto-contratos");
let span_acuerto_sitio = document.getElementById('span-acuerdo-uso-sitio') 
aceptar.addEventListener("input", function () {
    // body...
    let registrar = document.getElementById('crece-registrarse');
        registrar.disabled = !registrar.disabled
        if(registrar.style.opacity === "1"){

            registrar.style.opacity = "0.5"
        }else{
            registrar.style.opacity = "1"
        }
        
})

span_acuerto_sitio.addEventListener("click", function () {
    // body...
    descargar_acuerdo_uso_sitio()
})



function descargar_acuerdo_uso_sitio() {
    // body....
    let aceptar = document.getElementById("crece-acepto-contratos");
    let nombres = document.getElementById("id_nombres").value
    let apellidos = document.getElementById("id_apellidos").value
    let cedula = document.getElementById('id_cedula').value

    if (nombres  && apellidos && cedula){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this)
                    var file = new Blob([this.response], { 
                                            type: 'application/pdf' 
                    });

                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(file);
                    link.download = "Acuerdo de Uso del Sitio.pdf";
                    document.body.appendChild(link);
                    link.click()

                }
            };
            //xhttp.open("POST", RUTA_FASE_3, true);
            xhttp.open('POST', RUTA_ACUERDO_SITIO_PDF, true)
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.responseType = "blob"
            xhttp.send(JSON.stringify({
                                        "nombres": nombres,
                                        'apellidos': apellidos,
                                        "cedula": cedula,
                                    })
                        );
    }else{
        let label_error_acuerdo_sitio = document.getElementById("label_error_acuerdo_sitio")
            label_error_acuerdo_sitio.innerHTML = "Debe llenar los campos de Nombres, Apellidos y Cédula"
            $(".crece-registro-container-form-wrapper-error-acuerdo-sitio").show()   
    }
    
    
}

let span_terminos_condiciones = document.getElementById('span-terminos-condiciones') 
span_terminos_condiciones.addEventListener('click', function () {
    // body...
    descargar_terminos_condiciones()
})


function descargar_terminos_condiciones() {
    // body...
    var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var file = new Blob([this.response], { 
                                            type: 'application/pdf' 
                    });

                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(file);
                    link.download = "Terminos Legales y Condiciones.pdf";
                    document.body.appendChild(link);
                    link.click()

                }
            };
            //xhttp.open("POST", RUTA_FASE_3, true);
            xhttp.open('GET', RUTA_TERMINOS_LEGALES, true)
            //xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.responseType = "blob"
            xhttp.send()
}


let span_politicas_privacidad = document.getElementById('span-politicas-privacidad') 
span_politicas_privacidad.addEventListener('click', function () {
    // body...
    descargar_politicas_privacidad()
})


function descargar_politicas_privacidad() {
    // body...
    var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var file = new Blob([this.response], { 
                                            type: 'application/pdf' 
                    });

                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(file);
                    link.download = "Politicas de Privacidad.pdf";
                    document.body.appendChild(link);
                    link.click()

                }
            };
            //xhttp.open("POST", RUTA_FASE_3, true);
            xhttp.open('GET', RUTA_POLITICAS_PRIVACIDAD, true)
            //xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.responseType = "blob"
            xhttp.send()
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}