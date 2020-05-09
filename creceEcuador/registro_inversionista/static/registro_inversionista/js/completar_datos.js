$("input[name='conyugue']").change(function(){
    if ($(this).val() == 1) {
        $(".crece-completar-datos-formulario-conyugue").show();
        hacerRequired(".crece-completar-datos-formulario-conyugue input");
    }
    else{
        $(".crece-completar-datos-formulario-conyugue").hide();
        hacerNoRequired(".crece-completar-datos-formulario-conyugue input");
    }
});

$("input[name='fuente-ingresos']").change(function(){
    if ($(this).val() == 1) {
        $(".crece-completar-datos-formulario-relacion-dependencia").show();
        hacerRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-completar-datos-formulario-auto-empleado input");
    }
    else if($(this).val() == 2){
        $(".crece-completar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").show();
        hacerRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").hide();
        hacerNoRequired(".crece-completar-datos-formulario-auto-empleado input");
    }
    else {
        $(".crece-completar-datos-formulario-relacion-dependencia").hide();
        hacerNoRequired(".crece-completar-datos-formulario-relacion-dependencia input");

        $(".crece-completar-datos-formulario-profesional-independiente").hide();
        hacerNoRequired(".crece-completar-datos-formulario-profesional-independiente input");

        $(".crece-completar-datos-formulario-auto-empleado").show();
        hacerRequired(".crece-completar-datos-formulario-auto-empleado input");
    }
});

$('.crece-completar-datos-formulario form').submit(function(e){
    e.preventDefault();
    
    if(checkInputs()){
        var dictRespuestas = obtenerRespuestas()
        enviarDatos(dictRespuestas)
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

      var conyuge = $("input[name='conyugue']:checked").val();

      if(conyuge === "1"){
        dictRespuestas.conyuge = conyuge;
        dictRespuestas.nombres_conyuge = $("#nombre_conyugue").val();
        dictRespuestas.apellidos_conyuge = $("#apellidos_conyugue").val();
        dictRespuestas.cedula_conyuge = $("#cedula_conyugue").val();
      }

      
      dictRespuestas.direccion_domicilio = $("#direccion").val();
      dictRespuestas.provincia = $("#provincia").val();
      dictRespuestas.canton = $("#canton").val();
      dictRespuestas.telefono_domicilio = $("#telf_domicilio").val();

      var fuente_ingresos = $("input[name='fuente-ingresos']:checked").val()

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

      dictRespuestas.fuente_ingresos = dictFuenteIngresos;


      dictRespuestas.direccion_fuente_ingresos = $("#direccion_empresa").val();
      dictRespuestas.canton_fuentes_ingresos = $("#canton_empresa").val();
      dictRespuestas.ingresos_mensuales = $("#ingresos_aproximados").val();

      dictRespuestas.banco = $("#banco").val();
      dictRespuestas.numero_cuenta = $("#numero_cuenta").val();
      dictRespuestas.tipo_cuenta = $("input[name='tipo_cuenta']:checked").val();

      return dictRespuestas;
  }

  function checkInputs() {
    var es_valido = true;
    $('input').filter('[required]').each(function() {
      if ($(this).val() === '') {
        alert("llene todos los campos");
        es_valido = false;
        return false;
      }
    });

    if(!$("input[name='conyugue']:checked").val()){
        alert("Seleccione si tiene cónyugue");
        return false;
    }

    if(!$("input[name='fuente-ingresos']:checked").val()){
        alert("Seleccione su fuente de ingresos");
        return false;
    }

    if(!$("input[name='tipo_cuenta']:checked").val()){
        alert("Seleccione el tipo de su cuenta bancaria");
        return false;
    }

    return es_valido;
  }

  function enviarDatos(dictRespuestas) {
    $.ajax({
        type: 'POST',
        url: "/inversionista/fase1/",
        data: dictRespuestas,
        success: function(resultData) { 
            enviarImagenCedula();
        }
    });
  }

    function enviarImagenCedula(){
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
                alert("Save Complete") 
            },
            error: function(){
                alert("Imagen incorrecta. Intente de nuevo");
            }
        });
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