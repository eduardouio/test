
// esto tiene que estar despues de los formularios para que funcione

var forms = document.querySelectorAll('.crece-completar-datos-formulario form')
    forms.forEach(function (form) {
      ValidForm(form, {errorPlacement: 'after'})
    })