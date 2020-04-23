from django.db import models
from django.conf import settings
from fases_inversiones.models import Inversion

class TransferenciaInversion(models.Model):
    id_transferencia = models.AutoField(primary_key=True)
    id_inversion = models.ForeignKey(Inversion, on_delete=models.CASCADE)
    url_documento = models.ImageField(blank=False, null=False, upload_to="transferencia")
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_aprobacion = models.DateField(null=True, blank=True)
    usuario_aprobacion = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    estado = models.IntegerField(default=0)
    
    
    class Meta:
        verbose_name = "Transferencia de Inversion"
        verbose_name_plural = "Transferencias de Inversion"