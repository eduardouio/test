from django.db import models
from django.conf import settings
from fases_inversiones.models import Inversion
from django.db.models.signals import pre_save, post_save
from django.core.exceptions import ValidationError
from django_fsm import TransitionNotAllowed

class TransferenciaInversion(models.Model):
    estado_confirmada = 1
    estado_xConfirmar = 0
    estado_declinada = -1
    opciones_estado = [
        (estado_confirmada,"Confirmada"),
        (estado_xConfirmar, "Por confirmar"),
        (estado_declinada, "Declinada")
    ]

    id_transferencia = models.AutoField(primary_key=True)
    id_inversion = models.ForeignKey(Inversion, on_delete=models.CASCADE)
    url_documento = models.FileField(blank=False, null=False, upload_to="transferencia")
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_aprobacion = models.DateField(null=True, blank=True)
    usuario_aprobacion = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    estado = models.IntegerField(choices= opciones_estado, default=0)
    
    
    class Meta:
        verbose_name = "Transferencia de Inversion"
        verbose_name_plural = "Transferencias de Inversion"

    def __str__(self):
        usuario = self.id_inversion.id_user
        solicitud = self.id_inversion.id_solicitud
        if (self.estado == 1):
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", Confirmado: $" + str(self.id_inversion.monto) 
        elif (self.estado == -1):
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", Declinado: $" + str(self.id_inversion.monto) 
        else:
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", Por confirmar: $" + str(self.id_inversion.monto)  
                

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
        

        #Cambiar estado de inversion
        inversion.estado = 1

        try:
            inversion.approve_transfer()

        except TransitionNotAllowed:
            print("Estado no se puede cambiar")

        inversion.save()
        solicitud.save()
    else:
        print("no confirmado")


#Signals
def cambiar_estado_transferencia_declinada(sender, instance, **kwargs):
    if(instance.estado == -1):

        transf_en_db = TransferenciaInversion.objects.get(pk=instance.pk)

        if (transf_en_db.estado != -1):
            inversion = instance.id_inversion
            try:
                print("cambiando estados declinado")
                inversion.decline_transfer()
                inversion.decline_to_pending()
                inversion.save()


            except TransitionNotAllowed:
                print("Estado no se puede cambiar")
            
    else:
        print("no declinado")

#Signals
def cambiar_estado_inversion_transferencia_creada(sender, instance, created, **kwargs):
    if(created):
        inversion = instance.id_inversion
        
        try:
            inversion.validate_transfer()
        except TransitionNotAllowed:
            print("Estado no se puede cambiar")
        
        inversion.save()

# Se conecta la señal con el modelo TransferenciaInversion
pre_save.connect(setear_porcentaje_en_solicitud_cambiar_estado_inversion, sender=TransferenciaInversion) 
pre_save.connect(cambiar_estado_transferencia_declinada, sender=TransferenciaInversion) 
post_save.connect(cambiar_estado_inversion_transferencia_creada, sender=TransferenciaInversion)
