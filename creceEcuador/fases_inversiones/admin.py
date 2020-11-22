from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.Inversion)
admin.site.register(models.Pago_detalle)
admin.site.register(models.Pagos_ta_supuesta)
admin.site.register(models.Pagos_ta_real)
