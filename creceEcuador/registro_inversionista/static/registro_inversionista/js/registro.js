let RUTA_CANTONES = '/inversionista/cantones/'
let RUTA_ACUERDO_SITIO_PDF = 'acuerdo_uso_sitio/'
let RUTA_TERMINOS_LEGALES = 'terminos_legales/'
let RUTA_POLITICAS_PRIVACIDAD = 'politicas_privacidad/'
let RUTA_PREGUNTAS = "/inversionista/preguntas/"
let RUTA_RESPUESTAS = "/inversionista/respuestas/"


var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
  
      // an array that will be populated with substring matches
      matches = [];
  
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
  
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });
  
      cb(matches);
    };
  };

var cantones = [ 'CUENCA', 'GIRON', 'GUALACEO', 'NABON', 'PAUTE', 'PUCARA', 
    'SAN FERNANDO', 'SANTA ISABEL', 'SIGSIG', 'OÑA', 'CHORDELEG', 'EL PAN', 
    'SEVILLA DE ORO', 'GUACHAPALA', 'CAMILO PONCE ENRIQUEZ', 'GUARANDA', 
    'CHILLANES', 'SAN JOSE DE CHIMBO', 'ECHEANDIA', 'SAN MIGUEL', 'CALUMA', 
    'LAS NAVES', 'AZOGUES', 'BIBLIAN', 'CAÑAR', 'LA TRONCAL', 'EL TAMBO', 
    'DELEG', 'SUSCAL', 'TULCAN', 'BOLIVAR', 'ESPEJO', 'MIRA', 'MONTUFAR', 
    'SAN PEDRO DE HUACA', 'LATACUNGA', 'LA MANA', 'PANGUA', 'PUJILI', 
    'SALCEDO', 'SAQUISILI', 'SIGCHOS', 'RIOBAMBA', 'ALAUSI', 'COLTA', 
    'CHAMBO', 'CHUNCHI', 'GUAMOTE', 'GUANO', 'PALLATANGA', 'PENIPE', 
    'CUMANDA', 'MACHALA', 'ARENILLAS', 'ATAHUALPA', 'BALSAS', 'CHILLA', 
    'EL GUABO', 'HUAQUILLAS', 'MARCABELI', 'PASAJE', 'PIÑAS', 'PORTOVELO', 
    'SANTA ROSA', 'ZARUMA', 'LAS LAJAS', 'ESMERALDAS', 'ELOY ALFARO', 'MUISNE', 
    'QUININDE', 'SAN LORENZO', 'ATACAMES', 'RIOVERDE', 'LA CONCORDIA', 'GUAYAQUIL', 
    'ALFREDO BAQUERIZO MORENO', 'BALAO', 'BALZAR', 'COLIMES', 'DAULE', 'DURAN', 
    'EL EMPALME', 'EL TRIUNFO', 'MILAGRO', 'NARANJAL', 'NARANJITO', 'PALESTINA', 
    'PEDRO CARBO', 'SAMBORONDON', 'SANTA LUCIA', 'URBINA JADO', 'YAGUACHI', 'PLAYAS', 
    'SIMON BOLIVAR', 'CORONEL MARCELINO MARIDUEÑA', 'LOMAS DE SARGENTILLO', 'NOBOL', 
    'GENERAL ANTONIO ELIZALDE', 'ISIDRO AYORA', 'IBARRA', 'ANTONIO ANTE', 'COTACACHI', 
    'OTAVALO', 'PIMAMPIRO', 'SAN MIGUEL DE URCUQUI', 'LOJA', 'CALVAS', 'CATAMAYO', 
    'CELICA', 'CHAGUARPAMBA', 'ESPINDOLA', 'GONZANAMA', 'MACARA', 'PALTAS', 
    'PUYANGO', 'SARAGURO', 'SOZORANGA', 'ZAPOTILLO', 'PINDAL', 'QUILANGA', 
    'OLMEDO', 'BABAHOYO', 'BABA', 'MONTALVO', 'PUEBLOVIEJO', 'QUEVEDO', 
    'URDANETA', 'VENTANAS', 'VINCES', 'PALENQUE', 'BUENA FE', 'VALENCIA', 
    'MOCACHE', 'QUINSALOMA', 'PORTOVIEJO', 'BOLIVAR', 'CHONE', 'EL CARMEN', 
    'FLAVIO ALFARO', 'JIPIJAPA', 'JUNIN', 'MANTA', 'MONTECRISTI', 'PAJAN', 
    'PICHINCHA', 'ROCAFUERTE', 'SANTA ANA', 'SUCRE', 'TOSAGUA', '24 DE MAYO', 
    'PEDERNALES', 'OLMEDO', 'PUERTO LOPEZ', 'JAMA', 'JARAMIJO', 'SAN VICENTE', 
    'MORONA', 'GUALAQUIZA', 'LIMON INDANZA', 'PALORA', 'SANTIAGO', 'SUCUA', 
    'HUAMBOYA', 'SAN JUAN BOSCO', 'TAISHA', 'LOGROÑO', 'PABLO VI', 'TIWINTZA', 
    'TENA', 'ARCHIDONA', 'EL CHACO', 'QUIJOS', 'CARLOS JULIO AROSEMENA', 'PASTAZA', 
    'MERA', 'SANTA CLARA', 'ARAJUNO', 'QUITO', 'CAYAMBE', 'MEJIA', 'PEDRO MONCAYO', 
    'RUMIÑAHUI', 'SAN MIGUEL DE LOS BANCOS', 'PEDRO VICENTE MALDONADO', 'PUERTO QUITO', 
    'AMBATO', 'BAÑOS', 'CEVALLOS', 'MOCHA', 'PATATE', 'QUERO', 'SAN PEDRO DE PELILEO', 
    'SANTIAGO DE PILLARO', 'TISALEO', 'ZAMORA', 'CHINCHIPE', 'NANGARITZA', 'YACUAMBI', 
    'YANTZAZA', 'EL PANGUI', 'CENTINELA DEL CONDOR', 'PALANDA', 'PAQUISHA', 'SAN CRISTOBAL', 
    'ISABELA', 'SANTA CRUZ', 'LAGO AGRIO', 'GONZALO PIZARRO', 'PUTUMAYO', 'SHUSHUFINDI', 
    'SUCUMBIOS', 'CASCALES', 'CUYABENO', 'ORELLANA', 'AGUARICO', 'LA JOYA DE LOS SACHAS', 
    'LORETO', 'SANTO DOMINGO DE LOS TSACHILAS', 'SANTA ELENA', 'LIBERTAD', 'SALINAS', 
    'LAS GOLONDRINAS', 'MANGA DEL CURA', 'EL PIEDRERO'
  ];

  $("#id_canton").typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 1,
    },
    {
      name: "canton",
      source: substringMatcher(cantones),
    }
  );

$(document).ready(function(){
  if ( $('[type="date"]').prop('type') != 'date' ) {
    $('[type="date"]').datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "-99:+0",
      dateFormat: "yy-mm-dd",
      altFormat: "yy-mm-dd"
    });
}



    let encuesta_container = document.getElementById("crece-registro-encuesta-container-id")

    var xhttp3 = new XMLHttpRequest();

    xhttp3.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let respuestas = JSON.parse(this.response)

            for (var i = 0; i < respuestas.length; i++) {
                let respuesta = respuestas[i].texto
                let id_respuesta = respuestas[i].id
                let id_pregunta = "pregunta-container-"+(id_respuesta.toString()[0])
                let pregunta_container = document.getElementById(id_pregunta)
                if (pregunta_container){
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

            }
            


        }else if(this.status == 401 && this.readyState == 4){
            

        }
    };
    xhttp3.open("GET", RUTA_RESPUESTAS)
    xhttp3.send()

});


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


function registrar(argument) {
    // body...
    let usuario = document.getElementById("id_email").value
    let password = document.getElementById("id_password").value
    let nombres = document.getElementById("id_nombres").value
    let apellidos = document.getElementById("id_apellidos").value
    let email = document.getElementById("id_email").value
    let celular = document.getElementById("id_celular").value
    let cedula = document.getElementById('id_cedula').value
    let fecha_nacimiento = document.getElementById('id_fecha_nacimiento').value


    let tipo_persona = 1 
    let canton = document.getElementById("id_canton").value

    let lista_preguntas = ["¿En cuánto tiempo esperas recuperar tus inversiones?", "¿Cuánto esperas invertir a través de CRECE?",
                            "¿Qué nivel de riesgo se ajusta a su perfil?","¿Cómo conociste a CRECE?"]
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

    let inputs_validos = validar_form()
    if (inputs_validos === 9 && lista_respuestas.length === 4){
        let encuesta_dic = {"preguntas":lista_preguntas, "respuestas":lista_respuestas}
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                insertar_timestamps(email)

                let super_container = document.getElementById("crece-registro-super-container")
                super_container.style.display = 'none'

                let logo_registro_exitoso = document.getElementById("crece-logo-registro-exitoso")
                logo_registro_exitoso.style.display = 'block'
                let container_after_registro  = document.getElementById("crece-wrapper-id")
                container_after_registro.style.display = 'block'


              


            }else if(this.status == 400 && this.readyState == 4){
                
                let response = JSON.parse(this.response)
                let mensaje = response.mensaje
                let tipo_error = response.tipo_error
                let id_input = "id_"+tipo_error
                let input_error = document.getElementById(id_input)
                mostrar_times(input_error)
                let id_error = "crece-mensaje-invalid-input-"+tipo_error
                let label_error = document.getElementById(id_error)
                label_error.style.display = "block"
                label_error.innerHTML = mensaje
                $('#crece-registrarse').html('Registrarme').removeClass('disabled');
                $("#crece-registrarse").removeAttr("disabled");

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
                                    'fecha_nacimiento':fecha_nacimiento,
                                })
                    );
    }else if(inputs_validos === 9 && lista_respuestas.length != 4){

            let mensaje = "Debe Llenar la encuesta"
            let times_encuesta = document.getElementById("times-encuesta-id")
            times_encuesta.style.display = "inline-block"
            document.getElementById('crece-registro-encuesta-container-id').focus();
            
            let label_error = document.getElementById("label_error_encuesta")
            label_error.innerHTML = mensaje
            $(".crece-login-container-form-wrapper-error-encuesta").show()
            $('#crece-registrarse').html('Registrarme').removeClass('disabled');
            $("#crece-registrarse").removeAttr("disabled");
            $("#crece-registro-encuesta-container-id").focus()
    }else{
         $('#crece-registrarse').html('Registrarme').removeClass('disabled');
         $("#crece-registrarse").removeAttr("disabled");
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



let span_acuerto_sitio = document.getElementById('span-acuerdo-uso-sitio') 

span_acuerto_sitio.addEventListener("click", function () {
    // body...
    descargar_acuerdo_uso_sitio()
})



function descargar_acuerdo_uso_sitio() {
 
    var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var file = new Blob([this.response], { 
                                            type: 'application/pdf' 
                    });

                    var link = document.createElement("a");
                    link.href = window.URL.createObjectURL(file);
                    link.download = "Acuerdo Uso de Sitio - Inversionistas.pdf";
                    document.body.appendChild(link);
                    link.click()

                }
            };

            xhttp.open('GET', RUTA_ACUERDO_SITIO_PDF, true)

            xhttp.responseType = "blob"
            xhttp.send()

    
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

            xhttp.open('GET', RUTA_TERMINOS_LEGALES, true)

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

            xhttp.open('GET', RUTA_POLITICAS_PRIVACIDAD, true)

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




function validar_cedula(textbox){
  
  /**
     * Algoritmo para validar cedulas de Ecuador
     * @Author : Victor Diaz De La Gasca.
     * @Fecha  : Quito, 15 de Marzo del 2013 
     * @Email  : vicmandlagasca@gmail.com
     * @Pasos  del algoritmo
     * 1.- Se debe validar que tenga 10 numeros
     * 2.- Se extrae los dos primero digitos de la izquierda y compruebo que existan las regiones
     * 3.- Extraigo el ultimo digito de la cedula
     * 4.- Extraigo Todos los pares y los sumo
     * 5.- Extraigo Los impares los multiplico x 2 si el numero resultante es mayor a 9 le restamos 9 al resultante
     * 6.- Extraigo el primer Digito de la suma (sumaPares + sumaImpares)
     * 7.- Conseguimos la decena inmediata del digito extraido del paso 6 (digito + 1) * 10
     * 8.- restamos la decena inmediata - suma / si la suma nos resulta 10, el decimo digito es cero
     * 9.- Paso 9 Comparamos el digito resultante con el ultimo digito de la cedula si son iguales todo OK sino existe error.     
     */
     let cedula = textbox.value
     let times_cedula = document.getElementById("times-cedula-id")
     let check_cedula = document.getElementById("check-cedula-id")
     //Preguntamos si la cedula consta de 10 digitos
     if(cedula.length == 10){
        
        //Obtenemos el digito de la region que sonlos dos primeros digitos
        var digito_region = cedula.substring(0,2);
        
        //Pregunto si la region existe ecuador se divide en 24 regiones
        if( digito_region >= 1 && digito_region <=24 ){
          
          // Extraigo el ultimo digito
          var ultimo_digito   = cedula.substring(9,10);

          //Agrupo todos los pares y los sumo
          var pares = parseInt(cedula.substring(1,2)) + parseInt(cedula.substring(3,4)) + parseInt(cedula.substring(5,6)) + parseInt(cedula.substring(7,8));

          //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
          var numero1 = cedula.substring(0,1);
          var numero1 = (numero1 * 2);
          if( numero1 > 9 ){ var numero1 = (numero1 - 9); }

          var numero3 = cedula.substring(2,3);
          var numero3 = (numero3 * 2);
          if( numero3 > 9 ){ var numero3 = (numero3 - 9); }

          var numero5 = cedula.substring(4,5);
          var numero5 = (numero5 * 2);
          if( numero5 > 9 ){ var numero5 = (numero5 - 9); }

          var numero7 = cedula.substring(6,7);
          var numero7 = (numero7 * 2);
          if( numero7 > 9 ){ var numero7 = (numero7 - 9); }

          var numero9 = cedula.substring(8,9);
          var numero9 = (numero9 * 2);
          if( numero9 > 9 ){ var numero9 = (numero9 - 9); }

          var impares = numero1 + numero3 + numero5 + numero7 + numero9;

          //Suma total
          var suma_total = (pares + impares);

          //extraemos el primero digito
          var primer_digito_suma = String(suma_total).substring(0,1);

          //Obtenemos la decena inmediata
          var decena = (parseInt(primer_digito_suma) + 1)  * 10;

          //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
          var digito_validador = decena - suma_total;

          //Si el digito validador es = a 10 toma el valor de 0
          if(digito_validador == 10)
            var digito_validador = 0;

          //Validamos que el digito validador sea igual al de la cedula
          if(digito_validador == ultimo_digito){
            check_cedula.style.display = 'block'
            times_cedula.style.display = 'none'
            textbox.className = 'crece-form-input crece-form-valid-input'
            return true
          }else{
            times_cedula.style.display = 'block'
            check_cedula.style.display = 'none'
            textbox.className = 'crece-form-input crece-form-invalid-input'
            return false
          }
          
        }else{
          // imprimimos en consola si la region no pertenece
          times_cedula.style.display = 'block'
            check_cedula.style.display = 'none'
            return false
        }
     }else{
        //imprimimos en consola si la cedula tiene mas o menos de 10 digitos
        check_cedula.style.display = 'none'
        times_cedula.style.display = "none"
        return false

     }    
  
}








function confirmar_password() {
    // body...
    let check_confirmar_password = document.getElementById("check-confirmar-password-id")
    let times_confirmar_password = document.getElementById("times-confirmar-password-id")
    let input_confirmar_password = document.getElementById("id_confirmar_password")
    let input_password = document.getElementById("id_password")

    if (!input_confirmar_password.value && !input_password.value){
        check_confirmar_password.style.display = 'none'
        times_confirmar_password.style.display = 'none'
    }
    else if( input_confirmar_password.value === input_password.value){
        check_confirmar_password.style.display = 'block'
        times_confirmar_password.style.display = 'none'
        return true
    }else{
        check_confirmar_password.style.display = 'none'
        times_confirmar_password.style.display = 'block'
        return false
    }
}




function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}



function validar_form() {
    // body...
    let inputs = document.getElementsByClassName("crece-form-input")
    

    for (var i = inputs.length - 1; i >= 0; i--) {
        let input = inputs[i]
        if(!input.value){

            input.className = 'crece-form-input crece-form-invalid-input'
            input.focus()
            mostrar_times(input)

        }else{
            if(input.name === 'email' && !validateEmail(input.value)){
                
                mostrar_times(input)
                let id_error = "crece-mensaje-invalid-input-"+input.name
                let label_error = document.getElementById(id_error)
                label_error.style.display = "block"
                label_error.innerHTML = "Ingrese un correo electrónico válido"

            }else if (input.name === 'cedula' && !validar_cedula(input)){
                mostrar_times(input)
                let id_error = "crece-mensaje-invalid-input-"+input.name
                let label_error = document.getElementById(id_error)
                label_error.style.display = "block"
                label_error.innerHTML = "Ingrese una cédula válida"

                
            }else if (input.name === 'confirmar-password' && !confirmar_password()){
                mostrar_times(input)
                let id_error = "crece-mensaje-invalid-input-"+input.name
                let label_error = document.getElementById(id_error)
                label_error.style.display = "block"
                label_error.innerHTML = "Las contraseñas no coinciden"

            }else if (input.name === "fecha-nacimiento" && !validar_fecha_nacimiento(input)){
                mostrar_times(input)
                let id_error = "crece-mensaje-invalid-input-"+input.name
                let label_error = document.getElementById(id_error)
                label_error.style.display = "block"
                label_error.innerHTML = "Fecha de nacimiento no valida"
            }else if (input.name === "canton" && !(cantones.includes(input.value.toUpperCase()))){
                mostrar_times(input)
                let id_error = "crece-mensaje-invalid-input-"+input.name
                let label_error = document.getElementById(id_error)
                label_error.style.display = "block"
                label_error.innerHTML = "Ciudad fuera de los límites permitidos. Por favor ingresa una ciudad dentro de Ecuador."
                // $('#crece-registrarse').html('Registrarme').removeClass('disabled');
                // $("#crece-registrarse").removeAttr("disabled");
            }else{
                mostrar_check(input)

                 
            }
            
        }
    }

    let inputs_validos = document.getElementsByClassName("crece-form-valid-input")

    return inputs_validos.length

}

function validar_fecha_nacimiento(input) {
  // body...
  console.log(input);
  console.log(input.value);
  year = input.value.split("-")[0]
  if (year.length > 4){
    return false
  }
  return true

}

function mostrar_check(input) {
    // body...
    if (input.required){
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

}


function mostrar_times(input) {
    // body...
    if (input.required){
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
    // $('#crece-registrarse').html('Registrarme').removeClass('disabled');
    // $("#crece-registrarse").removeAttr("disabled");
   
}


function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}


setInputFilter(document.getElementById("id_cedula"), function(value) {
  return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});

setInputFilter(document.getElementById("id_celular"), function(value) {
  return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});


$('#crece-registrarse').click(function() {
    
  $('#crece-registrarse').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Cargando...').addClass('disabled');
  $("#crece-registrarse").attr("disabled","True")
  setTimeout(() => registrar(), 2000)
});