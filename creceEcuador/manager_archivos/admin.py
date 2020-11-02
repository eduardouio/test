from django.contrib import admin
from . import models
from django.utils.safestring import mark_safe


class TransferenciaAdmin(admin.ModelAdmin):
    def file_link(self, obj):
        if obj.url_documento:
            return mark_safe("<a href='%s' download='%s'>Descargar Archivo</a>" % (("/"+obj.url_documento.url), str(obj.id_inversion)))
        else:
            return "No attachment"
    file_link.allow_tags = True
    file_link.short_description = 'File Download'

    list_filter = (
        'estado',
    )

    list_display = ('id_inversion','url_documento','file_link', 'fecha_aprobacion', 'usuario_aprobacion', 'estado')

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
        return template_response

admin.site.register(models.TransferenciaInversion , TransferenciaAdmin)