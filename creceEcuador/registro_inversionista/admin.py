from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.Usuario)
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
