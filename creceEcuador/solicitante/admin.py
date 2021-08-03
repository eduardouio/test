from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.EncuestaSolicitudTemporal)
admin.site.register(models.UsuarioSolicitanteTemporal)
admin.site.register(models.SolicitantesPreAprobados)


class SolicitudTemporalAdmin(admin.ModelAdmin):
    list_filter = (
        'estado',
    )

    """
    def change_view(self, request, object_id=None, form_url='',
                extra_context=None):
        # get the default template response
        template_response = super().change_view(request, object_id, form_url,
                                                extra_context)
        # here we simply hide the div that contains the save and delete buttons
        if object_id:
            try:
                transferencia =  models.TransferenciaInversion.objects.get(pk=object_id)
                if transferencia.estado < 0:
                    template_response.content = template_response.rendered_content.replace(
                    '<div class="submit-row">',
                    '<div class="submit-row" style="display: none">')

            except models.TransferenciaInversion.DoesNotExist:
                print("No existe inversion")
        return template_response"""

admin.site.register(models.SolicitudTemporal , SolicitudTemporalAdmin)