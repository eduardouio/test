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

    list_display = ('id_inversion','url_documento','file_link', 'fecha_aprobacion', 'usuario_aprobacion', 'estado')

admin.site.register(models.TransferenciaInversion , TransferenciaAdmin)