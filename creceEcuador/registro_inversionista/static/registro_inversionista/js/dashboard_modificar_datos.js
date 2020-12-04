let datosDesdeBaseModificar = true;
let usuarioConfirmado

function cambiarHabilitadoInputs() {
  datosDesdeBaseModificar = !datosDesdeBaseModificar;

  var usuarioConfirmado = $("#crece-perfil").attr("data-confirmado");

  let nonEditableInputs;
  if(usuarioConfirmado == 1){
    nonEditableInputs = ["modificar_nombre", "modificar_apellidos", "modificar_cedula",
    "modificar_ruc_profesional_independiente", "modificar_titular"];
  }
  else {
    nonEditableInputs = ["modificar_titular"];
  }
  


  $(".crece-modificar-datos-formulario-wrapper input").each(function(){
    let inputName = $(this).attr("name");
    if(! nonEditableInputs.includes(inputName)){
      $(this).prop("disabled", datosDesdeBaseModificar);
    }
    
  });
  
  $(".crece-modificar-datos-formulario-wrapper select").each(function(){
    let inputName = $(this).attr("name");
    if(! nonEditableInputs.includes(inputName)){
      $(this).prop("disabled", datosDesdeBaseModificar);
    }
    
  });

  if(datosDesdeBaseModificar){
    $(".crece-modificar-datos-formulario-wrapper-boton-subir-doc").each(function(){
      $(this).addClass("label-subir-foto-desactivado");
    });
  }
  else{
    $(".crece-modificar-datos-formulario-wrapper-boton-subir-doc").each(function(){
      $(this).removeClass("label-subir-foto-desactivado");
    });
  }
  
}

function cargarContratos() {

  $.ajax({
    type: 'GET', 
    url: "/inversionista/contratos/"+$("#perfil_ver_contratos").attr("data-id")+"/", 
    success: function(result){
      let stringContratos = "";
      result.data.forEach(function(contrato){
        stringContratos += '<div class="row">'+
      '                            <div class="col-9 crece-modificar-datos-formulario-wrapper-contratos-contrato">'+
      '                              <span>'+
      '                                <a target="_blank" rel="noopener noreferrer" onclick="return previewFile(\''+contrato.contrato+'\', \''+getNombreContrato(contrato.contrato)+'\')" href="'+contrato.contrato+'">'+getNombreContrato(contrato.contrato)+'</a>'+
      '                              </span>'+
      '                            </div>'+
      '                            <div class="col-3 crece-modificar-datos-formulario-wrapper-contratos-fecha">'+
      '                              <span>'+parseDate(contrato.fecha)+'</span>'+
      '                            </div>'+
      '                          </div>';
      });

      $("#contratos_container").html(stringContratos);
      
    } 
  });


	

}

function parseDate(date){
  var today = new Date(date);
  var dd = today.getDate(); 
  var mm = today.getMonth() + 1; 

  var yyyy = today.getFullYear(); 
  if (dd < 10) { 
      dd = '0' + dd; 
  } 
  if (mm < 10) { 
      mm = '0' + mm; 
  } 
  return dd + '-' + mm + '-' + yyyy;
}

function getNombreContrato(rutaContrato){
  var arrContrato = rutaContrato.split("/");
  var nombreContratoExtension = arrContrato[arrContrato.length - 1];
  return nombreContratoExtension.split(".")[0];
}

function inicializarVerPerfil(){

  $("#modificar_usar_dir_domicilio").change(function() {
    if(this.checked) {
      $("#modificar_direccion_empresa").val(
        $("#modificar_direccion").val()
      );

      $("#modificar_canton_empresa").val(
        $("#modificar_canton").val()
      );
    }
  });

  $(".crece-modificar-datos-formulario-wrapper-editar, div.crece-modificar-datos-formulario-wrapper-editar *").click(function() {
    cambiarHabilitadoInputs();
  });

  $(".crece-modificar-datos-formulario-relacion-dependencia").show();
  hacerRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

  $(".crece-modificar-datos-formulario-profesional-independiente").hide();
  hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

  $(".crece-modificar-datos-formulario-auto-empleado").hide();
  hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");

  seleccionarDesdeBase("#modificar_selectBanco");
  seleccionarDesdeBase("#modificar_selectTipoCuenta");
  seleccionarDesdeBase("#modificar_selectEstadoCivil");
  limpiar_password()
  cambiar_fecha_nacimiento()

  seleccionarImagenModificar()

  cargarFuenteDeIngresosModificar();

  if(datosDesdeBaseModificar){
    $('#modificar_guardar_respuestas').hide();
    
    $(".crece-modificar-datos-formulario-wrapper input").each(function(){
      $(this).prop("disabled", true);
    });
    
    $(".crece-modificar-datos-formulario-wrapper select").each(function(){
      $(this).prop("disabled", true);
    });

    $(".crece-modificar-datos-formulario-wrapper-boton-subir-doc").each(function(){
      $(this).addClass("label-subir-foto-desactivado");
    });
  }


  $("#selectable_informacion_personal").click(function(){
    $("#selectable_informacion_personal").addClass("active");
    $("#selectable_informacion_laboral").removeClass("active");
    $("#selectable_cuenta_bancaria").removeClass("active");
    $("#selectable_contratos_aceptados").removeClass("active");
    $("#selectable_cambiar_password").removeClass("active");

    $("#perfil_modificar_informacion_personal").css("display", "flex");
    $("#perfil_modificar_informacion_laboral").hide();
    $("#perfil_modificar_cuenta_bancaria").hide();
    $("#perfil_ver_contratos").hide();
    $("#perfil_cambiar_password").hide();

    cambiar_fecha_nacimiento();
  });

  $("#selectable_informacion_laboral").click(function(){
    $("#selectable_informacion_laboral").addClass("active");
    $("#selectable_informacion_personal").removeClass("active");
    $("#selectable_cuenta_bancaria").removeClass("active");
    $("#selectable_contratos_aceptados").removeClass("active");
    $("#selectable_cambiar_password").removeClass("active");

    $("#perfil_modificar_informacion_personal").hide();
    $("#perfil_modificar_informacion_laboral").css("display", "flex");
    $("#perfil_modificar_cuenta_bancaria").hide();
    $("#perfil_ver_contratos").hide();
    $("#perfil_cambiar_password").hide();
  });

  $("#selectable_cuenta_bancaria").click(function(){
    $("#selectable_cuenta_bancaria").addClass("active");
    $("#selectable_informacion_laboral").removeClass("active");
    $("#selectable_informacion_personal").removeClass("active");
    $("#selectable_contratos_aceptados").removeClass("active");
    $("#selectable_cambiar_password").removeClass("active");

    $("#perfil_modificar_informacion_personal").hide();
    $("#perfil_modificar_informacion_laboral").hide()
    $("#perfil_modificar_cuenta_bancaria").css("display", "flex");
    $("#perfil_ver_contratos").hide();
    $("#perfil_cambiar_password").hide();
  });

  $("#selectable_contratos_aceptados").click(function(){
    $("#selectable_contratos_aceptados").addClass("active");
    $("#selectable_informacion_laboral").removeClass("active");
    $("#selectable_cuenta_bancaria").removeClass("active");
    $("#selectable_informacion_personal").removeClass("active");
    $("#selectable_cambiar_password").removeClass("active");

    $("#perfil_modificar_informacion_personal").hide();
    $("#perfil_modificar_informacion_laboral").hide()
    $("#perfil_modificar_cuenta_bancaria").hide();
    $("#perfil_ver_contratos").css("display", "flex");
    $("#perfil_cambiar_password").hide();

    cargarContratos();
  });

  $("#selectable_cambiar_password").click(function(){
    $("#selectable_cambiar_password").addClass("active");
    $("#selectable_contratos_aceptados").removeClass("active");
    $("#selectable_informacion_laboral").removeClass("active");
    $("#selectable_cuenta_bancaria").removeClass("active");
    $("#selectable_informacion_personal").removeClass("active");

    $("#perfil_modificar_informacion_personal").hide();
    $("#perfil_modificar_informacion_laboral").hide()
    $("#perfil_modificar_cuenta_bancaria").hide();
    $("#perfil_ver_contratos").hide();
    $("#perfil_cambiar_password").css("display", "flex");

    limpiar_password();
    
  });

  function cambiar_fecha_nacimiento() {
    // body...
    let fecha_nacimiento = $("#modificar_fecha_nacimiento").attr("value-date");

    
    let date = new Date(fecha_nacimiento)
    if (isValidDate(date)){
      var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        let date_local = date.toLocaleDateString('es-MX', options)
        $("#modificar_fecha_nacimiento").val(formatDate(fecha_nacimiento))
      }
  }
    
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [year, month, day].join('-');
  }

  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  function limpiar_password() {
    // body...
    document.getElementById("id_password").value="";
    document.getElementById("id_confirmar_password").value = "";
    $("#label_mensaje_new_pass").hide();
    $("#crece-mensaje-invalid-input-password").hide();
    $("#crece-mensaje-invalid-input-confirmar-password").hide();
    $("#times-password-id").hide();
    $("#check-password-id").hide();
    $("#check-confirmar-password-id").hide();
    $("#times-confirmar-password-id").hide();


    let input_password_confirmar = document.getElementById("id_confirmar_password");
    let div_text_confirmar = document.getElementById("crece-show-hide-confirmar-password")
    input_password_confirmar.type = "password";
    div_text_confirmar.innerHTML = "MOSTRAR";

    let input_password = document.getElementById("id_password");
        let div_text = document.getElementById("crece-show-hide-password")
        input_password.type = "password";
    div_text.innerHTML = "MOSTRAR";

  }

  $("#modificar_selectEstadoCivil").change(function(){
    if (this.value === "casado" || this.value === "union libre") {
        $(".crece-modificar-datos-formulario-conyugue").show();
        hacerRequired(".crece-modificar-datos-formulario-conyugue input");
    }
    else{
        $(".crece-modificar-datos-formulario-conyugue").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-conyugue input");
    }
  });

  $("#modificar_selectTrabajo").change(function(){
    if (this.value == 1) {
        $(".crece-modificar-datos-formulario-relacion-dependencia").show();
        hacerRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }
    else if(this.value == 2){
        $(".crece-modificar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").show();
        hacerRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }
    else if(this.value == 3){
        $(".crece-modificar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").show();
        hacerRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }

    else {
        $(".crece-modificar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }
  });

  $("#modificar_foto_cedula").on('change', function() {
    $(".crece-modificar-datos-formulario-wrapper-boton-subir-label").html(this.files[0].name);
  });

  $("#modificar_foto_perfil").on('change', function() {
    $("#labelDocumento").html(this.files[0].name);
    enviarImagenPerfilModificar(false);
  });

  $('.crece-modificar-datos-formulario form').submit(function(e){
      e.preventDefault();
  });

  $(".modificar_guardar_datos").click(function(){
    if(!datosDesdeBaseModificar){
      if(checkInputsModificar()){
        var dictRespuestas = obtenerRespuestasModificar()
        enviarDatosModificar(dictRespuestas, false);
      }
    } 
    var dictRespuestas = obtenerRespuestasModificar()
  });

  $("#modificar_siguiente").click(function(){
    if(!datosDesdeBaseModificar){
      if(checkInputsModificar()){
        var dictRespuestas = obtenerRespuestasModificar()
        enviarDatosModificar(dictRespuestas, true);
      }
    } 

  });

  $('#modificar_canton').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'modificar_canton',
    source: substringMatcher(cantones)
  });

  $('#modificar_canton_empresa').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'modificar_canton_empresa',
    source: substringMatcher(cantones)
  });

  $('#modificar_provincia').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'modificar_provincia',
    source: substringMatcher(provincias)
  });


}

function parseControlCharacters(json){
  var regex = /\\u([\d\w]{4})/gi;
  json = json.toLowerCase().replace(regex, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16)); 
  });
  return json.toUpperCase();
}

function cargarFuenteDeIngresosModificar(){
  var ingresos = $("#modificar_selectTrabajo").attr("data-seleccion");

  if(ingresos) {
    ingresos = parseControlCharacters(ingresos);
    var dictIngresos = JSON.parse(JSON.parse(ingresos)); //Doble parse. Uno para quitar escape characters y otro para parsear el json

    if(dictIngresos.ANIOS_RELACION_DEPENDENCIA){
      $("#modificar_selectTrabajo").val("1");
      $( "#modificar_selectTrabajo" ).trigger( "change" );

      $("#modificar_empresa_relacion_dependencia").val(dictIngresos.EMPRESA_RELACION_DEPENDENCIA);
      $("#modificar_cargo_relacion_dependencia").val(dictIngresos.CARGO_RELACION_DEPENDENCIA);
      $("#modificar_anios_relacion_dependencia").val(dictIngresos.ANIOS_RELACION_DEPENDENCIA);
    }
    else if(dictIngresos.RUC_PROFESIONAL_INDEPENDIENTE){
      $("#modificar_selectTrabajo").val("2");
      $( "#modificar_selectTrabajo" ).trigger( "change" );

      $("#modificar_ruc_profesional_independiente").val(dictIngresos.RUC_PROFESIONAL_INDEPENDIENTE);
      $("#modificar_actividad_profesional_independiente").val(dictIngresos.ACTIVIDAD_PROFESIONAL_INDEPENDIENTE);
      $("#modificar_anios_profesional_independiente").val(dictIngresos.ANIOS_PROFESIONAL_INDEPENDIENTE);
    }
    else if(dictIngresos.RUC_AUTO_EMPLEADO){
      $("#modificar_selectTrabajo").val("3");
      $( "#modificar_selectTrabajo" ).trigger( "change" );

      $("#modificar_ruc_auto_empleado").val(dictIngresos.RUC_AUTO_EMPLEADO);
      $("#modificar_empresa_auto_empleado").val(dictIngresos.EMPRESA_AUTO_EMPLEADO);
      $("#modificar_actividad_auto_empleado").val(dictIngresos.ACTIVIDAD_AUTO_EMPLEADO);
    }
  }
}

function seleccionarImagenModificar(){
  var documento = $("#modificar_labelDocumento").attr("data-documento");

  if(documento){
    var nombreDocumento = documento.split("/").pop();
    $("#modificar_labelDocumento").html(nombreDocumento);
  }
  else{
    datosDesdeBaseModificar = false;
  }
  
}

function seleccionarDesdeBase(id_selector){
  var seleccion = $(id_selector).attr("data-seleccion");

  if(seleccion){
    $(id_selector).val(seleccion);
    $(id_selector).trigger( "change" );
  }
  else{
    datosDesdeBaseModificar = false;
  }
}

$("#modificar_selectEstadoCivil").change(function(){
    if (this.value === "casado" || this.value === "union libre") {
        $(".crece-modificar-datos-formulario-conyugue").show();
        hacerRequired(".crece-modificar-datos-formulario-conyugue input");
    }
    else{
        $(".crece-modificar-datos-formulario-conyugue").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-conyugue input");
    }
});

$("#modificar_selectTrabajo").change(function(){
    if (this.value == 1) {
        $(".crece-modificar-datos-formulario-relacion-dependencia").show();
        hacerRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }
    else if(this.value == 2){
        $(".crece-modificar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").show();
        hacerRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }
    else if(this.value == 3){
        $(".crece-modificar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").show();
        hacerRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }

    else {
        $(".crece-modificar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-relacion-dependencia input");

        $(".crece-modificar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-profesional-independiente input");

        $(".crece-modificar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-modificar-datos-formulario-auto-empleado input");
    }
});

$("#modificar_foto_cedula").on('change', function() {
  $(".crece-modificar-datos-formulario-wrapper-boton-subir-label").html(this.files[0].name);
});

$('.crece-modificar-datos-formulario form').submit(function(e){
    e.preventDefault();
});

$("#modificar_guardar_respuestas").click(function(){
  if(!datosDesdeBaseModificar){
    if(checkInputsModificar()){
      var dictRespuestas = obtenerRespuestasModificar()
      enviarDatosModificar(dictRespuestas, false);
    }
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
  

  $('#modificar_canton').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'modificar_canton',
    source: substringMatcher(cantones)
  });

  $('#modificar_canton_empresa').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'modificar_canton_empresa',
    source: substringMatcher(cantones)
  });

  $('#modificar_provincia').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'modificar_provincia',
    source: substringMatcher(provincias)
  });

  function obtenerRespuestasModificar(){
      var dictRespuestas = {}
      dictRespuestas.nombre = $("#modificar_nombre").val();
      dictRespuestas.apellidos = $("#modificar_apellidos").val();
      dictRespuestas.cedula = $("#modificar_cedula").val();
      dictRespuestas.celular = $("#modificar_celular").val();

      var estado_civil = $("#modificar_selectEstadoCivil").children("option:selected").val();

      dictRespuestas.estado_civil = estado_civil;
      if(estado_civil === "casado" || estado_civil === "union libre"){
        dictRespuestas.nombres_conyuge = $("#modificar_nombre_conyugue").val();
        dictRespuestas.apellidos_conyuge = $("#modificar_apellidos_conyugue").val();
        dictRespuestas.cedula_conyuge = $("#modificar_cedula_conyugue").val();
      }

      
      dictRespuestas.direccion_domicilio = $("#modificar_direccion").val();
      dictRespuestas.provincia = $("#modificar_provincia").val();
      dictRespuestas.canton = $("#modificar_canton").val();
      dictRespuestas.telefono_domicilio = $("#modificar_telf_domicilio").val();

      var fuente_ingresos = $("#modificar_selectTrabajo").children("option:selected").val();

      var dictFuenteIngresos = {};
    
      if (fuente_ingresos == 1){
        dictFuenteIngresos.empresa_relacion_dependencia = $("#modificar_empresa_relacion_dependencia").val();
        dictFuenteIngresos.cargo_relacion_dependencia = $("#modificar_cargo_relacion_dependencia").val();
        dictFuenteIngresos.anios_relacion_dependencia = $("#modificar_anios_relacion_dependencia").val();
      }
      else if (fuente_ingresos == 2){
        dictFuenteIngresos.ruc_profesional_independiente = $("#modificar_ruc_profesional_independiente").val();
        dictFuenteIngresos.actividad_profesional_independiente = $("#modificar_actividad_profesional_independiente").val();
        dictFuenteIngresos.anios_profesional_independiente = $("#modificar_anios_profesional_independiente").val();
      }
      else if (fuente_ingresos == 3){
        dictFuenteIngresos.empresa_auto_empleado = $("#modificar_empresa_auto_empleado").val();
        dictFuenteIngresos.ruc_auto_empleado = $("#modificar_ruc_auto_empleado").val();
        dictFuenteIngresos.actividad_auto_empleado = $("#modificar_actividad_auto_empleado").val();
      }

      dictRespuestas.fuente_ingresos = JSON.stringify(dictFuenteIngresos);


      dictRespuestas.direccion_fuente_ingresos = $("#modificar_direccion_empresa").val();
      dictRespuestas.canton_fuentes_ingresos = $("#modificar_canton_empresa").val();
      dictRespuestas.ingresos_mensuales = $("#modificar_ingresos_aproximados").val();

      dictRespuestas.titular = $("#modificar_titular").val();
      dictRespuestas.banco = $("#modificar_selectBanco").children("option:selected").val();
      dictRespuestas.numero_cuenta = $("#modificar_numero_cuenta").val();
      dictRespuestas.tipo_cuenta = $("#modificar_selectTipoCuenta").children("option:selected").val();
      
      return dictRespuestas;
  }

  function focusAndInvalidate(element){
    let id = $(element).attr('id');
    location.href = "#"+id;
    $(element).addClass("invalid");
  }

  function checkInputsModificar() {
    var es_valido = true;
    $('.crece-modificar-datos-formulario-wrapper input').filter('[required]').each(function() {

      if ($(this).val() === '') {
        $("#"+this.name.substring(10)).val(this.value); //substring 10 para eliminar el prefijo modificar_
        $("#"+this.name.substring(10)).attr("value",this.value);

        return;
      }
      else {
        if (this.name === 'modificar_cedula' && !validar_cedula_modificar(this)){

          
          focusAndInvalidate(this);
          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("Ingrese su cédula correctamente");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");

          es_valido = false;
          return false;

        }
        else if (this.name === 'modificar_cedula_conyugue' && !validar_cedula_modificar(this)){
          focusAndInvalidate(this);

          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("Ingrese la cédula de su cónyugue correctamente");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");

          es_valido = false;
          return false;

        }

        else if(this.name === 'modificar_canton' && !cantones.includes(this.value)) {
          focusAndInvalidate(this);

          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("Ingrese un cantón válido");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");

          this.classList.add("invalid");
          es_valido = false;
          return false;
        }

        else if(this.name === 'modificar_canton_empresa' && !cantones.includes(this.value)) {
          focusAndInvalidate(this);

          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("Ingrese un cantón válido");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");

          this.classList.add("invalid");
          es_valido = false;
          return false;
        }
        else if(this.name === 'modificar_provincia' && !provincias.includes(this.value)) {
          focusAndInvalidate(this);

          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("Ingrese una provincia válida");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");
         
          this.classList.add("invalid");
          es_valido = false;
          return false;
        }
        else if(this.name === 'modificar_celular' && this.value.length != 10) {
          focusAndInvalidate(this);
          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("Ingrese un celular válido");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");

          this.classList.add("invalid");
          es_valido = false;
          return false;
        }
        else {
          $(this).removeClass("invalid");
          $("#"+this.name.substring(10)).val(this.value); //substring 10 para eliminar el prefijo modificar_
          $("#"+this.name.substring(10)).attr("value",this.value);
        }
      }
    });

    if(es_valido){
      $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").hide();
    }
    
    return es_valido;
  }

  function enviarDatosModificar(dictRespuestas, redirect) {
    $.ajax({
        type: 'POST',
        url: "/inversionista/fase1/",
        data: dictRespuestas,
        success: function(resultData) { 
          if($('#modificar_foto_cedula').prop('files')[0]){
            enviarImagenCedulaModificar(redirect);
          }
          else{
            cambiarHabilitadoInputs();
          } 
        },
        error: function(e){
          
          if(e.responseJSON){
            $(".crece-modificar-datos-formulario-wrapper .error-modificar").html(e.responseJSON.mensaje);
            $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");
          }
          else{
            $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("No se pudo registrar los datos.");
            $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");
          }
        }
    });
  }

    function enviarImagenCedulaModificar(redirect){
        var myFormData = new FormData();
        const imagen = $('#modificar_foto_cedula').prop('files')[0];
        myFormData.append("img",imagen );

        const cedula = $("#modificar_cedula").val();
        var nombre_imagen = renombrarArchivo(cedula, imagen.name);

        $.ajax({
            url: '/inversionista/cedula/'+nombre_imagen,  
            type: 'POST',
            processData: false,
            contentType: false,
            dataType : 'json',
            data: myFormData,
            success: function () { //TODO mostrar exito
              $("#labelDocumento").html(nombre_imagen);
              $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").hide();
              cambiarHabilitadoInputs();
            },
            error: function(){
              $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("No se pudo cargar la imagen de su cédula. Intente de nuevo.");
              $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");
            }
        });
    }

  function enviarImagenPerfilModificar(deshabilitar){
    var myFormData = new FormData();
    const imagen = $('#modificar_foto_perfil').prop('files')[0];
    myFormData.append("img",imagen );

    const cedula = $("#modificar_cedula").val();
    var nombre_imagen = renombrarArchivo(cedula, imagen.name);

    $.ajax({
        url: '/inversionista/profile_pic/'+nombre_imagen,  
        type: 'POST',
        processData: false,
        contentType: false,
        dataType : 'json',
        data: myFormData,
        success: function (response) { //TODO mostrar exito
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").hide();
          if(deshabilitar) {
            cambiarHabilitadoInputs();
          }
          
          if($(".crece-usuario-imagen.fa.fa-user-circle-o").length){
            $.each($(".crece-usuario-imagen.fa.fa-user-circle-o"), function(index, value){
              value.outerHTML = `<img class="crece-usuario-imagen-seleccionada" src="`+response.data.ruta+`"></img>`
            });
          }
          else{
            $(".crece-usuario-imagen-seleccionada").attr("src",response.data.ruta+"?t=" + new Date().getTime());
            $(".crece-usuario-imagen-navbar").attr("src",response.data.ruta+"?t=" + new Date().getTime());
          }
          
          $("#usuario_data_container *, .crece-usuario-imagen-seleccionada, .crece-usuario-imagen").click( function() {
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

        },
        error: function(){
          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("No se pudo cargar la imagen de perfil. Intente de nuevo.");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");
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
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").hide();
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
          $(".crece-modificar-datos-formulario-wrapper .error-modificar").html("No se pudo cambiar el estado de la inversión.");
          $(".crece-modificar-datos-formulario-wrapper .error-modificar-container").css("display", "flex");
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

function validar_cedula_modificar(textbox){
  
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
     let cedula = $(textbox).val();
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

