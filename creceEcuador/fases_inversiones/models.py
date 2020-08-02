from django.db import models
from solicitudes.models import Solicitud
from registro_inversionista.models import Usuario
from django_fsm import FSMField, transition
from django_fsm import TransitionNotAllowed
from django.db.models.signals import pre_save
# Create your models here.

FASES_INVERSION = ('OPEN', 'FILL_INFO', 'CONFIRM_INVESTMENT', 'ORIGIN_MONEY', 'PENDING_TRANSFER', 'TRANSFER_SUBMITED','TO_BE_FUND', 'VALID', 'ABANDONED','GOING', 'FINISHED','DECLINED')
FASES_INVERSION = list(zip(FASES_INVERSION, FASES_INVERSION))
class Inversion(models.Model):
    estado_confirmada = 1
    estado_xConfirmar = 0
    opciones_estado = [
        (estado_confirmada,"Confirmada"),
        (estado_xConfirmar, "Por confirmar")
    ]

    id_user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE)
    monto = models.FloatField()
    adjudicacion = models.FloatField()
    adjudicacion_iva = models.FloatField(default=None)
    inversion_total = models.FloatField()
    ganancia_total = models.FloatField()
    estado = models.IntegerField(choices=opciones_estado, default=0)
    fase_inversion = FSMField(default=FASES_INVERSION[0][0], choices=FASES_INVERSION)

    @transition(field=fase_inversion, source='OPEN', target='FILL_INFO')
    def start(self):

        pass
    #FASES_INVERSION = ('OPEN', 'FILL_INFO', 'CONFIRM_INVESTMENT', 'ORIGIN_MONEY', 'PENDING_TRANSFER', 'TRANSFER_SUBMITED','TO_BE_FUND', 'VALID', 'ABANDONED','GOING', 'FINISHED','DECLINED')
    @transition(field=fase_inversion, source='FILL_INFO', target='CONFIRM_INVESTMENT')
    def step_two(self):
        pass

    @transition(field=fase_inversion, source='CONFIRM_INVESTMENT', target='ORIGIN_MONEY')
    def step_three(self):
        pass

    @transition(field=fase_inversion, source='ORIGIN_MONEY', target='PENDING_TRANSFER')
    def step_four(self):
        pass

    @transition(field=fase_inversion, source='PENDING_TRANSFER', target='TRANSFER_SUBMITED')
    def validate_transfer(self):
        pass

    @transition(field=fase_inversion, source='TRANSFER_SUBMITED', target='DECLINED')
    def decline_transfer(self):
        pass

    @transition(field=fase_inversion, source='TRANSFER_SUBMITED', target='TO_BE_FUND')
    def approve_transfer(self):
        pass

    @transition(field=fase_inversion, source='TO_BE_FUND', target='ABANDONED')
    def invalid_project(self):
        pass

    @transition(field=fase_inversion, source='TO_BE_FUND', target='GOING')
    def validate(self):
        pass

    @transition(field=fase_inversion, source='GOING', target='FINISHED')
    def finish(self):
        pass

    class Meta:
        verbose_name = "Inversion"
        verbose_name_plural = "Inversiones"

    def __str__(self):
        usuario = self.id_user
        solicitud = self.id_solicitud
        if (self.estado == 1):
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", Confirmado: $" + str(self.monto) 
        else:
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", No confirmado: $" + str(self.monto)  
                
class Pago_detalle(models.Model):
    estado_pagado = 1
    estado_pendiente = 0
    estado_retrasado = -1
    opciones_estado = [
        (estado_pagado,"Pagado"),
        (estado_pendiente, "Pendiente"),
        (estado_retrasado, "Retrasado")
    ]

    id_inversion = models.ForeignKey(Inversion, on_delete=models.CASCADE)
    orden = models.IntegerField()
    fecha = models.DateField()
    pago = models.FloatField()
    comision = models.FloatField()
    comision_iva = models.FloatField()
    ganancia = models.FloatField()
    estado = models.IntegerField(choices=opciones_estado, default=0)
    
    

    class Meta:
        verbose_name = "Pago_detalle"
        verbose_name_plural = "Pago_detalles"

    # def __str__(self):
    #     pass

#Signals
def cambiar_estado_inversion_aprovada(sender, instance, **kwargs):
    if(instance.estado == 1):
        try:
            instance.validate_transfer()
        except TransitionNotAllowed:
            print("Estado no se puede cambiar")
        

pre_save.connect(cambiar_estado_inversion_aprovada, sender=Inversion) 
