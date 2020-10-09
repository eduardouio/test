from django.db import models
# Create your models here.

class EventoUsuario(models.Model):
    opciones_tipo_accion = [
        ("login", "login"),
        ("logout", "logout"),
        ("rec_contrasena", "rec_contrasena")
    ]

    accion = models.CharField(max_length=20, choices=opciones_tipo_accion)
    timestamp = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(to="registro_inversionista.Usuario", on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.accion + " | " + str(self.usuario)+ " | " + str(self.timestamp)

class EventoInversionista(models.Model):
    opciones_tipo_accion = [
        ("iniciar_inversion", "iniciar_inversion"),
        ("OPEN_to_CONFIRM_INVESTMENT", "OPEN_to_CONFIRM_INVESTMENT"),
        ("CONFIRM_INVESTMENT_to_FILL_INFO", "CONFIRM_INVESTMENT_to_FILL_INFO"),
        ("FILL_INFO_to_ORIGIN_MONEY", "FILL_INFO_to_ORIGIN_MONEY"),
        ("ORIGIN_MONEY_to_PENDING_TRANSFER", "ORIGIN_MONEY_to_PENDING_TRANSFER"),
        ("PENDING_TRANSFER_to_TRANSFER_SUBMITED", "PENDING_TRANSFER_to_TRANSFER_SUBMITED"),
        ("TRANSFER_SUBMITED_to_DECLINED", "TRANSFER_SUBMITED_to_DECLINED"),
        ("TO_BE_FUND_to_ABANDONED", "TO_BE_FUND_to_ABANDONED"),
        ("TO_BE_FUND_to_GOING", "TO_BE_FUND_to_GOING"),
        ("GOING_to_FINISHED", "GOING_to_FINISHED"),
    ]

    accion = models.CharField(max_length=50, choices=opciones_tipo_accion)
    timestamp = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(to="registro_inversionista.Usuario", on_delete=models.DO_NOTHING)
    inversion = models.ForeignKey(to="fases_inversiones.Inversion", on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.accion + " | " + str(self.usuario) + " | " + self.inversion.id_solicitud.operacion + " | " + str(self.timestamp)