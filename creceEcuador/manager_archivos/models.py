from django.db import models
from django.conf import settings
from fases_inversiones.models import Inversion
from django.db.models.signals import pre_save
from django.core.exceptions import ValidationError

class TransferenciaInversion(models.Model):
    id_transferencia = models.AutoField(primary_key=True)
    id_inversion = models.ForeignKey(Inversion, on_delete=models.CASCADE)
    url_documento = models.FileField(blank=False, null=False, upload_to="transferencia")
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_aprobacion = models.DateField(null=True, blank=True)
    usuario_aprobacion = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    estado = models.IntegerField(default=0)
    
    
    class Meta:
        verbose_name = "Transferencia de Inversion"
        verbose_name_plural = "Transferencias de Inversion"

    def __str__(self):
        usuario = self.id_inversion.id_user
        solicitud = self.id_inversion.id_solicitud
        if (self.estado == 1):
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", Confirmado: $" + str(self.id_inversion.monto) 
        else:
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", No confirmado: $" + str(self.id_inversion.monto)  
                

#Signals
def setear_porcentaje_en_solicitud_cambiar_estado_inversion(sender, instance, **kwargs):
    if(instance.estado == 1):
        #validar que los otros campos necesarios hayan sido llenados
        if(not instance.fecha_aprobacion or not instance.usuario_aprobacion):
            raise ValidationError("Llenar fecha de aprobacion y definir usuario que aprueba.")
        print("confirmado")

        inversion = instance.id_inversion
        solicitud = inversion.id_solicitud


        #Actualizar la solicitud con el nuevo monto financiado
        porcentaje_inversion = 100 * float(inversion.monto)/float(solicitud.monto)
        if(porcentaje_inversion < 0 or porcentaje_inversion > 100 ):
            raise ValidationError("Monto de inversion negativo o mayor que el monto de solicitud")
        if (float(solicitud.porcentaje_financiado) + porcentaje_inversion > 100):
            raise ValidationError("Monto de inversion excede monto restante de la solicitud.")

        solicitud.porcentaje_financiado = porcentaje_inversion + float(solicitud.porcentaje_financiado)
        solicitud.save()

        #Cambiar estado de inversion
        inversion.estado = 1
        inversion.save()
    else:
        print("no confirmado")

# Se conecta la señal con el modelo TransferenciaInversion
pre_save.connect(setear_porcentaje_en_solicitud_cambiar_estado_inversion, sender=TransferenciaInversion) 