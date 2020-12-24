from django.contrib import admin
from . import models
from django.http import HttpResponse
import csv
# Register your models here.
#admin.site.register(models.Usuario)
admin.site.register(models.Encuesta)
admin.site.register(models.Pregunta)
admin.site.register(models.Respuesta)
admin.site.register(models.Cuenta_bancaria)
admin.site.register(models.Conyuge)
admin.site.register(models.Banco)
admin.site.register(models.Fuente_ingresos)
admin.site.register(models.Canton)
admin.site.register(models.Contrato)
admin.site.register(models.VersionContrato)

class ExportCsvMixin:
    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response
    export_as_csv.short_description = "Export Selected"

@admin.register(models.Usuario)
class UsuarioInversionistaAdmin(admin.ModelAdmin, ExportCsvMixin):
    actions = ["export_as_csv"]
