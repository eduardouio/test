let sidebarMostrado;

  $(".crece-menu-toggle").click(function(){

      if($(window).width() > 768){
         if(sidebarMostrado){
             $("#sidebar").hide();
             $("#sidebar").css("margin-left", "-250px");
             $(".content").css("padding-left", "0px");
             $(".content-block-background").hide()
             sidebarMostrado = false;
         }
         else {
             $("#sidebar").show();
             $("#sidebar").css("margin-left", "0px");
             $(".content").css("padding-left", "250px");
             $(".content-block-background").hide()
             sidebarMostrado = true;
         }
     }   
     else {
         if(sidebarMostrado){
             $("#sidebar").hide();
             $("#sidebar").css("margin-left", "-250px");
             $(".content").css("padding-left", "0px");
             $(".content-block-background").hide()
             sidebarMostrado = false;
         }
         else {
             $("#sidebar").show();
             $("#sidebar").css("margin-left", "0px");
             $(".content").css("padding-left", "0px");
             $(".content-block-background").show()
             sidebarMostrado = true;
         }
     }

  });

  $("#crece_ocultar_sidebar, #crece_ocultar_sidebar svg").click(function(){
     $("#sidebar").hide();
     $("#sidebar").css("margin-left", "-250px");
     $(".content").css("padding-left", "0px");
     $(".content-block-background").hide()
     sidebarMostrado = false;

  });

  $(document).ready(function() {
     initSidebar();
 });

  function initSidebar() {
     if($(window).width() > 768) {
         sidebarMostrado = true;
     }
     else {
         sidebarMostrado = false;
     }
 }

  $(".content-block-background").on("touchmove", function(e) {
     e.preventDefault();
 });

  $("#sidebar").on("touchmove", function(e) {
     e.preventDefault();
 });

  $(".content-block-background").click(function(){
     $("#sidebar").hide();
     $("#sidebar").css("margin-left", "-250px");
     $(".content").css("padding-left", "0px");
     $(".content-block-background").hide()
     sidebarMostrado = false;
 });