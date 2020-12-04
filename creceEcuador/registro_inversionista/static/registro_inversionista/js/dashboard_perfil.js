const VALID_INF_PERS_CAMPOS = 5;

$(document).ready(function(){

    
    let substringMatcher = function(strs) {
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

      $('#id_canton').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'id_canton',
        source: substringMatcher(cantones)
    });
});

$("#ver_perfil, #ver_perfil_navbar, #usuario_data_container *, .crece-usuario-imagen-seleccionada, .crece-usuario-imagen").click( function() {
    $(".crece-oportunidades").hide();
    $('#crece-detalle-operaciones-id').hide()
    $(".crece-perfil").show();

    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "/static/registro_inversionista/css/registro.css"
     }).appendTo("head");

     inicializarVerPerfil();
});

function capitalizeFirstLetter(palabra) {
    return palabra[0].toUpperCase() + palabra.slice(1).toLowerCase();
}



function guardarCambiosPerfil(id_inversionista) {

    var dictRespuestas = {};

    dictRespuestas.celular = document.getElementById("id_celular").value;
    dictRespuestas.canton = document.getElementById("id_canton").value;

    if (validar_form_modificar() === VALID_INF_PERS_CAMPOS){

        $.ajax({
            type: 'POST',
            url: "/inversionista/modificar/"+id_inversionista+"/",
            data: dictRespuestas,
            success: function(resultData) { 
                
            }
        });
    }
}

function validar_form_modificar() {
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

            }
            else{
                
                mostrar_check(input)

                 
            }
            
        }
    }

    let inputs_validos = document.getElementsByClassName("crece-form-valid-input")
    return inputs_validos.length

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
    try{
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
    catch(error) {
    }
    
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