let URL_SIGUIENTE_COMPLETAR_DATOS = "/registro/declaracion_fondos/?id_inversion=";
let datosDesdeBase = true;
let URL_CAMBIO_FASE_COMPLETAR_DATOS = "/registro/step_three_inversion/?id_inversion="

$(document).ready( function(){
  $(".crece-completar-datos-formulario-relacion-dependencia").show();
  hacerRequired(".crece-completar-datos-formulario-relacion-dependencia input");

  $(".crece-completar-datos-formulario-profesional-independiente").hide();
  hacerNoRequired(".crece-completar-datos-formulario-profesional-independiente input");

  $(".crece-completar-datos-formulario-auto-empleado").hide();
  hacerNoRequired(".crece-completar-datos-formulario-auto-empleado input");

  seleccionarDesdeBase("#selectBanco");
  seleccionarDesdeBase("#selectTipoCuenta");
  seleccionarDesdeBase("#selectEstadoCivil");

  seleccionarImagen()

  cargarFuenteDeIngresos();

  if(datosDesdeBase){
    $('#guardar_respuestas').hide();
    
    $(".crece-completar-datos-formulario-wrapper input").each(function(){
      $(this).prop("disabled", true);
    });
    
    $(".crece-completar-datos-formulario-wrapper select").each(function(){
      $(this).prop("disabled", true);
    });
  }

  $("#usar_dir_domicilio").change(function() {
    if(this.checked) {
      $("#direccion_empresa").val(
        $("#direccion").val()
      );

      $("#canton_empresa").val(
        $("#canton").val()
      );
    }
  });


});

function parseControlCharacters(json){
  var regex = /\\u([\d\w]{4})/gi;
  json = json.toLowerCase().replace(regex, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16)); 
  });
  return json.toUpperCase();
}

function cargarFuenteDeIngresos(){
  var ingresos = $("#selectTrabajo").attr("data-seleccion");

  if(ingresos) {
    ingresos = parseControlCharacters(ingresos);
    var dictIngresos = JSON.parse(JSON.parse(ingresos)); //Doble parse. Uno para quitar escape characters y otro para parsear el json

    if(dictIngresos.ANIOS_RELACION_DEPENDENCIA){
      $("#selectTrabajo").val("1");
      $( "#selectTrabajo" ).trigger( "change" );

      $("#empresa_relacion_dependencia").val(dictIngresos.EMPRESA_RELACION_DEPENDENCIA);
      $("#cargo_relacion_dependencia").val(dictIngresos.CARGO_RELACION_DEPENDENCIA);
      $("#anios_relacion_dependencia").val(dictIngresos.ANIOS_RELACION_DEPENDENCIA);
    }
    else if(dictIngresos.RUC_PROFESIONAL_INDEPENDIENTE){
      $("#selectTrabajo").val("2");
      $( "#selectTrabajo" ).trigger( "change" );

      $("#ruc_profesional_independiente").val(dictIngresos.RUC_PROFESIONAL_INDEPENDIENTE);
      $("#actividad_profesional_independiente").val(dictIngresos.ACTIVIDAD_PROFESIONAL_INDEPENDIENTE);
      $("#anios_profesional_independiente").val(dictIngresos.ANIOS_PROFESIONAL_INDEPENDIENTE);
    }
    else if(dictIngresos.RUC_AUTO_EMPLEADO){
      $("#selectTrabajo").val("3");
      $( "#selectTrabajo" ).trigger( "change" );

      $("#ruc_auto_empleado").val(dictIngresos.RUC_AUTO_EMPLEADO);
      $("#empresa_auto_empleado").val(dictIngresos.EMPRESA_AUTO_EMPLEADO);
      $("#actividad_auto_empleado").val(dictIngresos.ACTIVIDAD_AUTO_EMPLEADO);
    }
  }
}

function seleccionarImagen(){
  var documento = $("#labelDocumento").attr("data-documento");

  if(documento){
    var nombreDocumento = documento.split("/").pop();
    $("#labelDocumento").html(nombreDocumento);
  }
  else{
    datosDesdeBase = false;
  }
  
}

function seleccionarDesdeBase(id_selector){
  var seleccion = $(id_selector).attr("data-seleccion");

  if(seleccion){
    $(id_selector).val(seleccion);
    $(id_selector).trigger( "change" );
  }
  else{
    datosDesdeBase = false;
  }
}

$("#selectEstadoCivil").change(function(){
    if (this.value === "casado" || this.value === "union libre") {
        $(".crece-completar-datos-formulario-conyugue").show();
        hacerRequired(".crece-completar-datos-formulario-conyugue input");
    }
    else{
        $(".crece-completar-datos-formulario-conyugue").hide();
        hacerNoRequired(".crece-completar-datos-formulario-conyugue input");
    }
});

$("#selectTrabajo").change(function(){
    if (this.value == 1) {
        $(".crece-completar-datos-formulario-relacion-dependencia").show();
        hacerRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-completar-datos-formulario-auto-empleado input");
    }
    else if(this.value == 2){
        $(".crece-completar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").show();
        hacerRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-completar-datos-formulario-auto-empleado input");
    }
    else if(this.value == 3){
        $(".crece-completar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").show();
        hacerRequired(".crece-completar-datos-formulario-auto-empleado input");
    }

    else {
        $(".crece-completar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-completar-datos-formulario-auto-empleado input");
    }
});

$("#foto_cedula").on('change', function() {
  $(".crece-completar-datos-formulario-wrapper-boton-subir-label").html(this.files[0].name);
});

$('.crece-completar-datos-formulario form').submit(function(e){
    e.preventDefault();
});

$("#guardar_respuestas").click(function(){
  if(!datosDesdeBase){
    if(checkInputs()){
      var dictRespuestas = obtenerRespuestas()
      enviarDatos(dictRespuestas, false);
    }
  } 

});

$("#siguiente").click(function(){
  if(!datosDesdeBase){
    if(checkInputs()){
      var dictRespuestas = obtenerRespuestas()
      enviarDatos(dictRespuestas, true);
    }
  } 
  else {
    cambio_fase_inversion_completar_datos(id_inversion_modal);
  }

});

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

  var provincias = ['Azuay', 'Bolivar', 'Cañar', 'Carchi', 'Cotopaxi', 'Chimborazo',
    'El Oro', 'Esmeraldas', 'Guayas', 'Imbabura', 'Loja', 'Los Rios', 'Manabi', 
    'Morona Santiago', 'Napo', 'Pastaza', 'Pichincha', 'Tungurahua', 'Zamora Chinchipe',
    'Galápagos', 'Sucumbios', 'Orellana', 'Santo Domingo de los Tsachilas', 'Santa Elena',

];
  

  $('#canton').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'canton',
    source: substringMatcher(cantones)
  });

  $('#canton_empresa').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'canton_empresa',
    source: substringMatcher(cantones)
  });

  $('#provincia').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'provincia',
    source: substringMatcher(provincias)
  });

  function obtenerRespuestas(){
      var dictRespuestas = {}
      dictRespuestas.nombre = $("#nombre").val();
      dictRespuestas.apellidos = $("#apellidos").val();
      dictRespuestas.cedula = $("#cedula").val();
      dictRespuestas.celular = $("#celular").val();

      var estado_civil = $("#selectEstadoCivil").children("option:selected").val();

      dictRespuestas.estado_civil = estado_civil;
      if(estado_civil === "casado" || estado_civil === "union libre"){
        dictRespuestas.nombres_conyuge = $("#nombre_conyugue").val();
        dictRespuestas.apellidos_conyuge = $("#apellidos_conyugue").val();
        dictRespuestas.cedula_conyuge = $("#cedula_conyugue").val();
      }

      
      dictRespuestas.direccion_domicilio = $("#direccion").val();
      dictRespuestas.provincia = $("#provincia").val();
      dictRespuestas.canton = $("#canton").val();
      dictRespuestas.telefono_domicilio = $("#telf_domicilio").val();

      var fuente_ingresos = $("#selectTrabajo").children("option:selected").val();

      var dictFuenteIngresos = {};
    
      if (fuente_ingresos == 1){
        dictFuenteIngresos.empresa_relacion_dependencia = $("#empresa_relacion_dependencia").val();
        dictFuenteIngresos.cargo_relacion_dependencia = $("#cargo_relacion_dependencia").val();
        dictFuenteIngresos.anios_relacion_dependencia = $("#anios_relacion_dependencia").val();
      }
      else if (fuente_ingresos == 2){
        dictFuenteIngresos.ruc_profesional_independiente = $("#ruc_profesional_independiente").val();
        dictFuenteIngresos.actividad_profesional_independiente = $("#actividad_profesional_independiente").val();
        dictFuenteIngresos.anios_profesional_independiente = $("#anios_profesional_independiente").val();
      }
      else if (fuente_ingresos == 3){
        dictFuenteIngresos.empresa_auto_empleado = $("#empresa_auto_empleado").val();
        dictFuenteIngresos.ruc_auto_empleado = $("#ruc_auto_empleado").val();
        dictFuenteIngresos.actividad_auto_empleado = $("#actividad_auto_empleado").val();
      }

      dictRespuestas.fuente_ingresos = JSON.stringify(dictFuenteIngresos);


      dictRespuestas.direccion_fuente_ingresos = $("#direccion_empresa").val();
      dictRespuestas.canton_fuentes_ingresos = $("#canton_empresa").val();
      dictRespuestas.ingresos_mensuales = $("#ingresos_aproximados").val();

      dictRespuestas.titular = $("#titular").val();
      dictRespuestas.banco = $("#selectBanco").children("option:selected").val();
      dictRespuestas.numero_cuenta = $("#numero_cuenta").val();
      dictRespuestas.tipo_cuenta = $("#selectTipoCuenta").children("option:selected").val();
      
      return dictRespuestas;
  }

  function focusAndInvalidate(element){
    let id = $(element).attr('id');
    location.href = "#"+id;
    $(element).addClass("invalid");
  }

  function checkInputs() {
    var es_valido = true;
    $('.crece-completar-datos-formulario-wrapper input').filter('[required]').each(function() {

      if ($(this).val() === '') {
        focusAndInvalidate(this);
        $("#completar_datos_wrapper .error").html("Llene todos los campos");
        $("#completar_datos_wrapper .error-container").css("display", "flex");
        
        es_valido = false;
        return false;
      }
      else {
        if (this.name === 'cedula' && !validar_cedula(this)){

          
          focusAndInvalidate(this);
          $("#completar_datos_wrapper .error").html("Ingrese su cédula correctamente");
          $("#completar_datos_wrapper .error-container").css("display", "flex");

          es_valido = false;
          return false;

        }
        else if (this.name === 'cedula_conyugue' && !validar_cedula(this)){
          focusAndInvalidate(this);

          $("#completar_datos_wrapper .error").html("Ingrese la cédula de su cónyugue correctamente");
          $("#completar_datos_wrapper .error-container").css("display", "flex");

          es_valido = false;
          return false;

        }

        else if(this.name === 'canton' && !cantones.includes(this.value)) {
          focusAndInvalidate(this);

          $("#completar_datos_wrapper .error").html("Ingrese un cantón válido");
          $("#completar_datos_wrapper .error-container").css("display", "flex");

          this.classList.add("invalid");
          es_valido = false;
          return false;
        }

        else if(this.name === 'canton_empresa' && !cantones.includes(this.value)) {
          focusAndInvalidate(this);

          $("#completar_datos_wrapper .error").html("Ingrese un cantón válido");
          $("#completar_datos_wrapper .error-container").css("display", "flex");

          this.classList.add("invalid");
          es_valido = false;
          return false;
        }
        else if(this.name === 'provincia' && !provincias.includes(this.value)) {
          focusAndInvalidate(this);

          $("#completar_datos_wrapper .error").html("Ingrese una provincia válida");
          $("#completar_datos_wrapper .error-container").css("display", "flex");
         
          this.classList.add("invalid");
          es_valido = false;
          return false;
        }
        else if(this.name === 'celular' && this.value.length != 10) {
          focusAndInvalidate(this);
          $("#completar_datos_wrapper .error").html("Ingrese un celular válido");
          $("#completar_datos_wrapper .error-container").css("display", "flex");

          this.classList.add("invalid");
          es_valido = false;
          return false;
        }
        else {
          $(this).removeClass("invalid");
        }
      }
    });

    if (!$('#foto_cedula').prop('files')[0]){
      $("#completar_datos_wrapper .error").html("Por favor, suba una foto o un archivo PDF de su documento de identidad.");
      $("#completar_datos_wrapper .error-container").css("display", "flex");

      es_valido = false;
      return false;
    }

    if(es_valido){
      $("#completar_datos_wrapper .error-container").hide();
    }
    
    return es_valido;
  }

  function enviarDatos(dictRespuestas, redirect) {
    $.ajax({
        type: 'POST',
        url: "/inversionista/fase1/",
        data: dictRespuestas,
        success: function(resultData) { 
            enviarImagenCedula(redirect);
        }
    });
  }

    function enviarImagenCedula(redirect){
        var myFormData = new FormData();
        const imagen = $('#foto_cedula').prop('files')[0];
        myFormData.append("img",imagen );

        const cedula = $("#cedula").val();
        var nombre_imagen = renombrarArchivo(cedula, imagen.name);

        $.ajax({
            url: '/inversionista/cedula/'+nombre_imagen,  
            type: 'POST',
            processData: false,
            contentType: false,
            dataType : 'json',
            data: myFormData,
            success: function () {
              $("#completar_datos_wrapper .error-container").hide();
              if(redirect){
                cambio_fase_inversion_completar_datos(id_inversion_modal);
              }
              else{
                
              }
            },
            error: function(){
              $("#completar_datos_wrapper .error").html("No se pudo cargar la imagen. Intente de nuevo.");
              $("#completar_datos_wrapper .error-container").css("display", "flex");
            }
        });
    }

  function cambio_fase_inversion_completar_datos(id_inversion){
    if(fase_inversion_actual != "FILL_INFO") {
      $(CLASE_MODAL).show();
      $(ID_DECLARACION_FONDOS).css('display', 'flex');
      $(ID_COMPLETA_DATOS).hide();
      $(ID_SUBIR_TRANSFERENCIA).hide();

      habilitarClicks();

      habilitarLinksAnteriores(fase_inversion_actual,3);

      setPasoInversionistaActualOrigin(3);

      $(".crece-flujo-inversionista-paso-cuatro, "+
            ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");

    }
    else {
      $.ajax({
        type: 'POST',
        url: URL_CAMBIO_FASE_COMPLETAR_DATOS+id_inversion, 
        data: {},
        success: function(resultData) { 
          $("#completar_datos_wrapper .error-container").hide();
          $(CLASE_MODAL).show();
          $(ID_DECLARACION_FONDOS).css('display', 'flex');
          $(ID_COMPLETA_DATOS).hide();
          $(ID_SUBIR_TRANSFERENCIA).hide();

          fase_inversion_actual = "ORIGIN_MONEY";

          habilitarClicks();

          habilitarLinksAnteriores(fase_inversion_actual,3);

          setPasoInversionistaActualOrigin(3);

          $(".crece-flujo-inversionista-paso-cuatro, "+
                ".crece-flujo-inversionista-paso-cuatro span").prop("onclick", null).off("click");
        },
        error: function(){
          $("#completar_datos_wrapper .error").html("No se pudo cambiar el estado de la inversión.");
          $("#completar_datos_wrapper .error-container").css("display", "flex");
        }
      });
    }
    
  }

function obtenerIdInversion(){
  var dicQuerystring = obtenerMapaQueryString();
  return dicQuerystring.id_inversion;

}

function obtenerMapaQueryString(){
    return decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((values, [ key, value ]) => {
        values[ key ] = value
        return values
    }, {})
}

  function hacerRequired(selector){
      $(selector).each( function() {
        $(this).attr("required", true);
      });
  }

  function hacerNoRequired(selector){
    $(selector).each( function() {
      $(this).attr("required", false);
    });
}

function renombrarArchivo(nombre_nuevo, nombre_anterior_con_extension){
    var arreglo_nombre = nombre_anterior_con_extension.split(".");
    var extension = arreglo_nombre[arreglo_nombre.length - 1];
    return nombre_nuevo + "." + extension;
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
            return true
          }else{
            textbox.classList.add("invalid");
            return false
          }
          
        }else{
          // imprimimos en consola si la region no pertenece
          textbox.classList.add("invalid");
          return false
        }
     }else{
        //imprimimos en consola si la cedula tiene mas o menos de 10 digitos
        textbox.classList.add("invalid");
        return false

     }    
  
}