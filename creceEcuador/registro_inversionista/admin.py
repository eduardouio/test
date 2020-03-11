from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.Usuario)
admin.site.register(models.Encuesta)
admin.site.register(models.Pregunta)
admin.site.register(models.Respuesta)
