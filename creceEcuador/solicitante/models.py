from django.db import models
from django.conf import settings
from datetime import datetime

# Create your models here.
class UsuarioSolicitanteTemporal(models.Model):
    nombres = models.CharField(max_length=200, blank=False)
    apellidos = models.CharField(max_length=200, blank=False)
    cedula = models.CharField(max_length=10, blank=False)
    celular = models.CharField(max_length=13, blank=False)
    email = models.CharField(max_length=100, blank=False)

    #Model user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=True)

    def __str__ (self):
        return self.nombres + " " + self.apellidos + ", " + self.cedula


class SolicitudTemporal(models.Model):
    persona_natural = 1
    persona_juridica = 0
    opciones_tipo_persona = [
        (persona_natural, "Persona natural"),
        (persona_juridica, "Empresa")
    ]

    opciones_estado = [
        (0, "No revisado"),
        (1, "En revisión 1"),
        (2, "En revisión 2"),
        (3, "Aprobado"),
        (4, "Declinado"),
    ]

    opciones_no_aprob = [
        ("Antecedentes", "Antecedentes"),
        ("Mala Situacion Financiera", "Mala Situacion Financiera"),
        ("Falta de Potencial de Crecimiento", "Falta de Potencial de Crecimiento"),
        ("Abandono de la Solicitud", "Abandono de la Solicitud"),
    ]

    razon_social = models.CharField(max_length=200, blank=True, null=True)
    nombre_comercial = models.CharField(max_length=200, blank=True, null=True)
    ruc = models.CharField(max_length=13, blank=False)
    tipo_persona = models.IntegerField(choices=opciones_tipo_persona)
    monto = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    plazo = models.IntegerField(blank=False)
    tasa = models.DecimalField(max_digits=4, decimal_places=2, blank=False)
    uso_financiamiento = models.TextField(blank=False)
    estado = models.IntegerField(choices=opciones_estado, null=True, blank=True, default=0)
    razon_de_no_aprobacion = models.CharField(max_length=50, choices=opciones_no_aprob, null=True, blank=True)
    fecha_creacion = models.DateTimeField('Fecha de creación',default=datetime.now())
    id_usuario_solicitante_temporal = models.ForeignKey(UsuarioSolicitanteTemporal, on_delete=models.CASCADE)

    def __str__ (self):
        if self.tipo_persona == "1":
            return "Persona natural, monto: $"+numberWithCommas(self.monto)+" plazo: "+str(self.plazo)+" meses tasa: "+str(self.tasa)+"% "+self.id_usuario_solicitante_temporal.nombres + " " + self.id_usuario_solicitante_temporal.apellidos + ", " + self.id_usuario_solicitante_temporal.cedula
        else:
            return "Empresa, monto: $"+numberWithCommas(self.monto)+" plazo: "+str(self.plazo)+" meses tasa: "+str(self.tasa)+"% "+self.id_usuario_solicitante_temporal.nombres + " " + self.id_usuario_solicitante_temporal.apellidos + ", " + self.id_usuario_solicitante_temporal.cedula

class EncuestaSolicitudTemporal(models.Model):
    id_pregunta = models.ForeignKey(to='registro_inversionista.Pregunta', on_delete=models.CASCADE)
    id_respuesta = models.ForeignKey(to='registro_inversionista.Respuesta', on_delete=models.CASCADE)
    id_solicitud_temporal = models.ForeignKey(SolicitudTemporal, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = "EncuestaSolicitudTemporal"
        verbose_name_plural = "EncuestasSolicitudTemporal"

def numberWithCommas(num):
    return f"{num:,}"
class SolicitantesPreAprobados(models.Model):
    opciones_estado = [
        (0, "Aprobado"),
        (2, "Domicilio no se encuentra en localidad requerida"),
        (4, "Situacion Financiera"),
        (5, "No cumple tiempo minimo"),
        (7, "No suficiente info para ejercicio 2020"),
        (8, "Situación crediticia - no se ha podido calcular dScore"),
    ]
    id = models.AutoField(primary_key=True)
    ruc = models.CharField(max_length=13, blank=False)
    estado = models.IntegerField(choices=opciones_estado, null=True, blank=True, default=0)
    fecha_creacion = models.DateTimeField(default=datetime.now())
