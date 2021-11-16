from django.db.models.signals import post_save, pre_save
from django_fsm import TransitionNotAllowed

from fases_inversiones.models import Inversion, crear_pagos_para_ta_supuesta, enviarEmailPagos
from lib.tablaAmortizacion import crear_ta_supuesta_por_inversion
from solicitudes.models import Solicitud

def iniciar_creacion_ta_supuestas(sender, instance, **kwargs):
    try:
        if(instance.porcentaje_financiado == 100 and instance.fecha_finalizacion != None and not instance.ta_created):
            inversiones = Inversion.objects.filter(id_solicitud=instance)

            for inversion in inversiones:
                if inversion.fase_inversion == "GOING":
                    crear_pagos_para_ta_supuesta(inversion, instance)
                    enviarEmailPagos(inversion)
                else:
                    inversion.fase_inversion = "ABANDONED"
            crear_ta_supuesta_por_inversion(instance)
            instance.ta_created = True
            instance.save()
    except Solicitud.DoesNotExist:
        print("Solicitud nueva")

def cambiar_estado_solicitud(sender, instance, **kwargs):
    try:
        solicitud_en_base = Solicitud.objects.get(pk=instance.pk)

        if (
                instance.porcentaje_financiado != solicitud_en_base.porcentaje_financiado and instance.porcentaje_financiado == 100):
            inversiones = Inversion.objects.filter(id_solicitud=instance)

            for inversion in inversiones:
                try:
                    inversion.validate()

                    print("Inversion transition: ", str(inversion))

                except TransitionNotAllowed:
                    print("Inversion no transition: ", str(inversion))
                    pass
                inversion.save()

    except Solicitud.DoesNotExist:
        print("Solicitud nueva")


pre_save.connect(cambiar_estado_solicitud, sender=Solicitud)
post_save.connect(iniciar_creacion_ta_supuestas, sender=Solicitud)

