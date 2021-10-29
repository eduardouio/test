widget1();
async function widget1(){
  const widgetID = document.currentScript.id;
  const wc = "."+widgetID;

  async function getConfig(){
    let result = await fetch(document.currentScript.dataset.config);
    let config = await result.json();
    return config;
  }

  let config = await getConfig();

  defer();

  function defer(metod){
    if (window.jQuery){
      init($);
      return;
    }else{
      var script = document.createElement('script');
      script.type = "type/javascript";
      script.src = config.jqueryURL;
      document.getElementsByTagName('head')[0].appendChild(script);
      setTimeout(function(){ defer(metod); },500);
    }
  }

  function init($){
    let theHTML=
      `
      <section class="section-1" id="1">
        <div class="card">
           <header class="section-header">
            <p class="header" style="padding: 2rem 2rem 0rem;">${config.subHeader}</p>
           </header>
          <div class="card-body" style="padding: 2rem 1rem 0rem;">

           <div class="card-title">${config.bodyText}</div>

           <div class="input-group md-5 ingresos">
            <input type="text" id="valor-capital" value="$1.500,00" class="form-control col-sm-6" placeholder="Ingreso mensual" aria-label="ingresos" aria-describedby="basic-addon1">
           </div>

           <div class="col-12 slidecontainer-capital" style="margin-top:1em;" >

             <input
               id="ingreso-bruto"
               type="text"
               name="capital"
               data-slider-min="400"
               data-slider-max="100000"
               data-slider-step="100"
               data-slider-value="1500"
               />
           </div>
           <div class="container2" id="response">
               <div class="input-group md-3" style="margin-top:2em;">
                  <div id="main-response">
                    <div class="main3">
                        Tu pago adicional mensual ser&iacute;a:
                        <div class="main" style="margin-top:0em;">
                          <span id="pago-adicional">US$ 0,00</span>
                        </div>
                    </div>
                  </div>
                  <div class="" style="margin-top:1em;">
                    <div id="main-response2" class="">
                      <div class="main2">
                        <p>
                          Es decir que ahora tu pago total al mes ser&aacute; <span style="display: inline;" id="total-pagar">US$ 0,00</span>.
                          <span style="margin-right:1.25em;">Esto equivale al <b id="porcentaje">0.00%</b> de tu ingreso anual.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
               </div>
               <div class="input-group sm-3" style="margin-top:0.2em;" id="final-legend">
                  <p id="leyenda_final" style="margin-right:1em;">
                    En Ecuador solo el
                    <span style="font-weight:bold;" id="ec-perc">0.00%</span>
                    de trabajadores tienen ingresos iguales o mayores al estimado.
                  </p>
               </div>
               <div class="learn">
                 <button class="btn btn-link btn-learn" type="button">${config.btnText}</button>
               </div>
             </div>
          </div>

          <div class="card_foot" id="final-legend-pgp">
             <p id="leyenda_final_pgp" style="margin-right:1em;">
               Esta estimaci&oacute;n fue realizada en base a datos reales reportados al SRI para cada nivel de ingresos.
               Se descuentan tambi&eacute;n los aportes a la seguridad social y d&eacute;cimos.
             </p>
          </div>
         </div>
       </section>
    `;

    $(wc).append(theHTML);
    $('.btn-learn').click(function(){
      window.open(`${config.learnMoreURL}`,'_blank');
    });
    var script = document.createElement('script');
    script.textContent =
    `
    const FORMAT_CURRENCY = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
    });

    $(document).ready(function(){

    let ingreso_bruto = $("#ingreso-bruto").bootstrapSlider({
      min: 400,
      max: 100000,
      value: 1500,
      name: "capital",
      step: 100,
      ticks: [400,2000,4000,6000,8000, 10000],
      ticks_labels: ['$400', '$2.000', '$4.000', '$6.000', '$8.000', '$10.000'],
      ticks_snap_bounds: 50,
      ticks_positions: [0,20,40,60,80,100],
      ticks_tooltip: true,
      tooltip: 'show',
    });

    ingreso_bruto.on('change', function () {
      cuota_valor_final(this.value);
      mostrar_valor_solicitante(this);
     });
     ingreso_bruto.on('slide', function () {
       cuota_valor_final(this.value);
       mostrar_valor_solicitante(this);
     });
    });

  function mostrar_valor_solicitante(input) {
   let id = "valor-capital";
   let output = document.getElementById(id);
   let valor = parseInt(input.value);

   var str = FORMAT_CURRENCY.format(valor);
   var result = str.substr(str.length-3)+ str.substr(0,str.length-3);
   output.value = result.trim() ;
  }

  function cuota_valor_final(ingresos) {
   let valores = get_values(ingresos);

   let pago_adicional =  $("#pago-adicional");
   let total_pagar =  $("#total-pagar");
   let porcentaje =  $(".main2 span b");
   let pgp = $("#pgp span b");

   let leyenda_final =  document.getElementById("leyenda_final");
   let leyenda_final_pgp =  document.getElementById("leyenda_final_pgp");

   if(valores!==-1){

     var str = FORMAT_CURRENCY.format(valores['PIM']);
     var result = str.substr(str.length-3)+ str.substr(0,str.length-3)
     pago_adicional.text( result.trim() );

     let x1 = valores['PIM'] + (valores['CTA'])*ingresos;
     var str2 = FORMAT_CURRENCY.format(x1.toFixed(2));
     var result2 = str2.substr(str2.length-3)+ str2.substr(0,str2.length-3)
     total_pagar.text(result2.trim() );

     let x2 = (x1/ingresos)*100;
     porcentaje.text(x2.toFixed(2) + " %");


     leyenda_final.innerHTML = "En Ecuador, solo el <span style='font-weight:bold;'' id='ec-perc'>"+valores['ICT']+"%</span> de trabajadores tienen ingresos iguales o mayores al estimado.";

     let str3  = FORMAT_CURRENCY.format(valores['PGP']);
     var result3 = str3.substr(str3.length-3)+ str3.substr(0,str3.length-3);

     leyenda_final_pgp.innerHTML = "Esta estimaci&oacute;n fue realizada con gastos deducibles de <span id='pgp'>"+ result3 + "</span> en base a los datos reales promedio reportados al SRI para cada nivel de ingresos. Se descuentan tambi&eacute;n los aportes a la seguridad social y d&eacute;cimos.";

   }
   else{


     var str3 = FORMAT_CURRENCY.format(0.00);
     var result3 = str3.substr(str3.length-3)+ str3.substr(0,str3.length-3)

     pago_adicional.text(result3);

     total_pagar.text(result3);

     porcentaje.text(0 + " %");

     leyenda_final.innerHTML = "Eres parte del <span style='font-weight:bold;'' id='ec-perc'>96,25 %</span> de Ecuatorianos que no son afectados por la reforma tributaria.";

     leyenda_final_pgp.innerHTML = "Esta estimaci&oacute;n fue realizada en base a datos reales reportados al SRI para cada nivel de ingresos. Se descuentan tambi&eacute;n los aportes a la seguridad social y d&eacute;cimos.";
   }
  }


  var RANGE = [
     {'PIM': 15.76, 'CTA': 0.0065, 'PGP': 7659.70, 'ICT': 3.75},
     {'PIM': 23.10, 'CTA': 0.0075, 'PGP': 8132.27, 'ICT': 3.41},
     {'PIM': 29.84, 'CTA': 0.0090, 'PGP': 8491.35, 'ICT': 3.14},
     {'PIM': 35.32, 'CTA': 0.0098, 'PGP': 8835.81, 'ICT': 2.91},
     {'PIM': 42.06, 'CTA': 0.0098, 'PGP': 9457.40, 'ICT': 2.68},
     {'PIM': 52.11, 'CTA': 0.0131, 'PGP': 9704.26, 'ICT': 2.45},
     {'PIM': 57.92, 'CTA': 0.0159, 'PGP': 9827.97, 'ICT': 2.28},
     { 'PIM': 63.69, 'CTA': 0.0159,'PGP': 10320.62, 'ICT': 2.14},
     { 'PIM': 71.05, 'CTA': 0.0197,'PGP': 10329.91, 'ICT': 1.97},
     { 'PIM': 77.66, 'CTA': 0.0214,'PGP': 10594.12, 'ICT': 1.85},
     { 'PIM': 83.21, 'CTA': 0.0234,'PGP': 10712.99, 'ICT': 1.73},
     { 'PIM': 85.01, 'CTA': 0.0213,'PGP': 11064.55, 'ICT': 1.61},
     { 'PIM': 92.10, 'CTA': 0.0272,'PGP': 10905.70, 'ICT': 1.47},
     { 'PIM': 97.76, 'CTA': 0.0314,'PGP': 10839.88, 'ICT': 1.37},
     { 'PIM': 102.01, 'CTA': 0.0326, 'PGP': 10974.34, 'ICT': 1.29},
     { 'PIM': 106.78, 'CTA': 0.0344, 'PGP': 11045.28, 'ICT': 1.21},
     { 'PIM': 112.96, 'CTA': 0.0369, 'PGP': 11094.76, 'ICT': 1.13},
     { 'PIM': 120.33, 'CTA': 0.0408, 'PGP': 11028.43, 'ICT': 1.06},
     { 'PIM': 125.80, 'CTA': 0.0429, 'PGP': 11075.85, 'ICT': 1.01},
     { 'PIM': 131.83, 'CTA': 0.0460, 'PGP': 11059.14, 'ICT': 0.95},
     { 'PIM': 137.35, 'CTA': 0.0493, 'PGP': 10968.18, 'ICT': 0.9},
     { 'PIM': 143.43, 'CTA': 0.0501, 'PGP': 11207.20, 'ICT': 0.85},
     { 'PIM': 149.60, 'CTA': 0.0523, 'PGP': 11243.39, 'ICT': 0.81},
     { 'PIM': 154.86, 'CTA': 0.0561, 'PGP': 11009.18, 'ICT': 0.76},
     { 'PIM': 162.99, 'CTA': 0.0568, 'PGP': 11302.62, 'ICT': 0.73},
     { 'PIM': 169.52, 'CTA': 0.0604, 'PGP': 11066.57, 'ICT': 0.69},
     { 'PIM': 177.26, 'CTA': 0.0632, 'PGP': 10935.88, 'ICT': 0.66},
     { 'PIM': 188.96, 'CTA': 0.0639, 'PGP': 11253.66, 'ICT': 0.63},
     { 'PIM': 192.97, 'CTA': 0.0606, 'PGP': 12003.89, 'ICT': 0.60},
     { 'PIM': 204.33, 'CTA': 0.0678, 'PGP': 11259.11, 'ICT': 0.56},
     //HERE >5000
     {'PIM': 255.49, 'CTA': 0.0767,'PGP': 11417.48, 'ICT': 0.53},
     {'PIM': 373.11, 'CTA': 0.0960,'PGP': 11343.15, 'ICT': 0.35},
     {'PIM': 488.71, 'CTA': 0.1122,'PGP': 11474.56, 'ICT': 0.24},
     {'PIM': 590.79, 'CTA': 0.1272,'PGP': 11600.37, 'ICT': 0.18},
     {'PIM': 662.15, 'CTA': 0.1421,'PGP': 11494.02, 'ICT': 0.14},
     { 'PIM': 717.36, 'CTA': 0.1554, 'PGP': 11433.95, 'ICT': 0.11},
     { 'PIM': 751.93, 'CTA': 0.1685, 'PGP': 11393.22, 'ICT': 0.09},
     { 'PIM': 776.64, 'CTA': 0.1801, 'PGP': 11415.55, 'ICT': 0.07},
     { 'PIM': 802.76, 'CTA': 0.1913, 'PGP': 11723.72, 'ICT': 0.06},
     { 'PIM': 801.54, 'CTA': 0.2027, 'PGP': 11438.70, 'ICT': 0.05},
    //HERE >15000
     {'PIM': 797.51, 'CTA': 0.2262, 'PGP': 11238.40, 'ICT': 0.04},
     {'PIM': 793.89, 'CTA': 0.2549, 'PGP': 11044.38, 'ICT': 0.02},
     {'PIM': 796.24, 'CTA': 0.2736, 'PGP': 11089.76, 'ICT': 0.01},
     {'PIM': 783.86, 'CTA': 0.2859, 'PGP': 10575.65, 'ICT': 0.01},
     {'PIM': 795.09, 'CTA': 0.2934, 'PGP': 11072.07, 'ICT': 0.01},
     {'PIM': 795.28, 'CTA': 0.2947, 'PGP': 11309.02, 'ICT': 0.008},
     {'PIM': 811.48, 'CTA': 0.2983, 'PGP': 12124.31, 'ICT': 0.006},
    // > 50.000
     {'PIM': 788.30, 'CTA': 0.3163, 'PGP': 10900.37, 'ICT': 0.005},
    // HERE > 100.000
     {'PIM': 798.14, 'CTA': 0.3375, 'PGP': 10984.61, 'ICT': 0.001},
  ];

  function get_values(value){
    var index = 0;
    var length_range1 = 30;
    var length_range2 = 10;
    var length_range3 = 8;
    var length_range4 = 1;

    if(value <2000){
      return -1;
    }
    if(value >= 2000 && value < 5000){
      index = 10*((Math.floor(value/1000))-2) + Math.floor((value % 1000)/100);
    }
    else if(value == 5000 ){
      index = length_range1 -1;
    }
    else if(value > 5000 && value <= 15000){
      index = length_range1 + Math.ceil((value - 5000)/1000)-1;//Math.floor((value - 5000)/1000);
    }
    else if(value > 15000 && value <= 50000){
      index = length_range1 + length_range2 + Math.ceil((value - 15000)/5000)-1;
    }
    else if(value > 50000 && value <= 100000){
      index = length_range1 + length_range2 + length_range3 - 1;
    }
    else if(value > 100000){
      index = length_range1 + length_range2 + length_range3 + length_range4-1;
    }

    return RANGE[index];
  }

  $("#valor-capital").keyup(function(event){
    if(event.keyCode===13){
      let value1 = $("#valor-capital").val();
      let value2 = value1.replace(/[^0-9,]+/, '');
      let value3 = value2.replace('.','').replace(',', '.');
      let value = parseFloat(value3);

      if(!isNaN(value)){
          //$('#ingreso-bruto').slider('refresh', { useCurrentValue: true });

          cuota_valor_final(value);
          var str = FORMAT_CURRENCY.format(value);
          var result = str.substr(str.length-3)+ str.substr(0,str.length-3);
          $("#valor-capital").val(result.trim());

      }
    }
  });

    `
    document.body.appendChild(script);
  }
  }
