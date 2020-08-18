let RUTA_ACEPTAR_DECLARACION= "/registro/aceptar_declaracion_fondos/"




function aceptar_declaracion_fondos() {
    // body...
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this)
            var file = new Blob([this.response], { 
                                    type: 'application/pdf' 
            });

            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(file);
            link.download = "Contrato.pdf";
            document.body.appendChild(link);
            link.click()

        }
    };
    xhttp.open("POST", RUTA_ACEPTAR_DECLARACION, true);
    //xhttp.setRequestHeader("Content-type", "text/html;charset=UTF-8");
    xhttp.send();
}

