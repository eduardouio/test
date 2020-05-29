from django.contrib import admin

from .models import CategoriaSolicitud, TipoCredito, Solicitud, CalificacionSolicitante

# Register your models here.
admin.site.register(CategoriaSolicitud)
admin.site.register(TipoCredito)
admin.site.register(Solicitud)

admin.site.register(CalificacionSolicitante)
