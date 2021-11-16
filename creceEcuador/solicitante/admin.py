from django.contrib import admin
from . import models
from django.utils.html import format_html
from django.urls import reverse
# Register your models here.
admin.site.register(models.EncuestaSolicitudTemporal)
admin.site.register(models.UsuarioSolicitanteTemporal)
admin.site.register(models.SolicitantesPreAprobados)


class Cuotas_ta_supuestaAdmin(admin.ModelAdmin):
    list_display = (
        'id_solicitud',
        "num_cuota" ,
        "estado", 
        "Ta_Actions"
        )
    list_filter = (
            "id_solicitud",
        )
    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         url(
    #             r'^(?P<account_id>.+)/deposit/$',
    #             self.admin_site.admin_view(self.process_deposit),
    #             name='account-deposit',
    #         ),
    #         url(
    #             r'^(?P<account_id>.+)/withdraw/$',
    #             self.admin_site.admin_view(self.process_withdraw),
    #             name='account-withdraw',
    #         ),
    #     ]
    #     return custom_urls + urls
    def Ta_Actions(self, obj):
        return format_html(
            '<a class="button">Simular</a>&nbsp;',
        )
admin.site.register(models.Cuotas_ta_supuesta, Cuotas_ta_supuestaAdmin)
admin.site.register(models.Cuotas_ta_real)

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