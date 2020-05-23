$(".crece-menu-toogle").click(function(){
    var x = document.getElementById("crece-header-id");
     if (x.className === "container crece-header-contenido") {
        x.className += " mobile";
      } else {
        x.className = "container crece-header-contenido";
      }
  });