from django.db.models.signals import post_save

from fases_inversiones.models import Inversion
from solicitante.models import Cuotas_ta_real

def cambiar_a_finished(sender, instance, **kwargs):
    if(instance.capital_insoluto == 0):

        solicitud = instance.id_pago_ta_supuesta.id_solicitud
        inversiones = Inversion.objects.filter(id_solicitud=solicitud)

        for inversion in inversiones:
            if inversion.fase_inversion == "GOING":
                inversion.finish()
                inversion.save()

post_save.connect(cambiar_a_finished, sender=Cuotas_ta_real)
