 $('.copyButton').tooltip({
    trigger: 'click',
    placement: 'bottom'
  });

  function setTooltip(btn,message) {
    $(btn).tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
  }

  function hideTooltip(btn) {
    setTimeout(function() {
      $(btn).tooltip('hide');
     }, 3000);
  }
  var clipboard =  new Clipboard(".copyButton", {
                        text: function(trigger) {
                          return linkACopiar(trigger); 
                        }
                      });

  clipboard.on('success', function(e) {
     setTooltip(e.trigger,'¡Copiado!');
     hideTooltip(e.trigger);
  });

  clipboard.on('error', function(e) {
    console.log(e);
});

function linkACopiar(element) {		
    let host = "";		
    if(document.location.port){		
      host = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port		
    }		
    else{		
      host = window.location.protocol + "//" + window.location.hostname		
    }	
    return host + element.getAttribute('data-clipboard-text');				
  }