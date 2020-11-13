""""Modulo para crear modelos de la DB"""
from django.db import models
from django.conf import settings
import json
import jwt
from .types import CASADO, UNION_LIBRE
from django.db.models.signals import post_save
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Conyuge(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    cedula = models.CharField(max_length=10)

    def __str__(self):
        return self.cedula +", " + self.nombres + " "  + self.apellidos

    class Meta:
        verbose_name = "Conyuge"
        verbose_name_plural = "Conyuges"

class Canton(models.Model):
    nombre = models.CharField(max_length=150)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Canton"
        verbose_name_plural = "Cantones"

class Fuente_ingresos(models.Model):
    descripcion = models.TextField()
    direccion = models.CharField(max_length=200)
    canton = models.ForeignKey(Canton, null=True, blank=False, on_delete=models.SET_NULL)
    ingresos_mensuales = models.FloatField()
    class Meta:
        verbose_name = "Fuente_ingresos"
        verbose_name_plural = "Fuente_ingresos"

class Banco(models.Model):
    nombre = models.CharField(max_length=150)
    class Meta:
        verbose_name = "Banco"
        verbose_name_plural = "Bancos"

class Cuenta_bancaria(models.Model):

    cuenta_corriente = 1
    cuenta_ahorros = 0
    opciones_tipo_cuenta = [
        (cuenta_corriente, "cuenta corriente"),
        (cuenta_ahorros, "cuenta ahorros")
    ]

    estado_verificada = 1
    estado_xVerificar = 0
    opciones_tipo_estado = [
        (estado_verificada, "Verificada"),
        (estado_xVerificar, "Por verificar")
    ]

    titular = models.CharField(max_length=200)
    numero_cuenta = models.CharField(max_length=15)
    tipo_cuenta = models.IntegerField(choices=opciones_tipo_cuenta)
    estado = models.IntegerField(choices=opciones_tipo_estado, default=0)
    banco = models.ForeignKey(Banco,null=True, on_delete=models.CASCADE)


    def __str__(self):
        tipo_cuenta_str = "Cuenta Ahorros"
        if (self.tipo_cuenta == 1):
            tipo_cuenta_str = "Cuenta Corriente"

        return self.numero_cuenta + ", " + tipo_cuenta_str + ", " + self.banco.nombre   

    class Meta:
        verbose_name = "Cuenta_bancaria"
        verbose_name_plural = "Cuenta_bancarias"

class VersionContrato(models.Model):
    opciones_tipo_contrato = [
        ("dec_fond", "Declaracion de fondos"),
        ("ac_uso", "Acuerdo Uso de Sitio"),
        ("term_leg", "Terminos Legales y Condiciones"),
        ("pol_priv", "Politicas de Privacidad")
    ]

    tipoContrato = models.CharField(max_length=10, choices=opciones_tipo_contrato)
    fecha = models.DateTimeField(auto_now_add=True)
    version = models.CharField(max_length=20)
    archivo = models.FileField(null=True, blank=True, upload_to='contratos')

    def __str__(self):
        return self.tipoContrato + ", v" + self.version

class Contrato(models.Model):
    contrato = models.CharField(max_length=200)
    fecha = models.DateTimeField(auto_now_add=True)
    versionContrato = models.ForeignKey(VersionContrato, blank=True, null=True, on_delete=models.SET_NULL)

    # Below the mandatory fields for generic relation
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

class Usuario(models.Model):
    """Tabla Usuario en la DB"""
    persona_natural = 1
    persona_juridica = 0
    opciones_tipo_persona = [
        (persona_natural, "persona natural"),
        (persona_juridica, "persona juridica")
    ]

    opciones_tipo_usuario = [
        ("inversionista", "inversionista"),
        ("solicitante", "solicitante"),
        ("staff", "staff"),
    ]

    estado_confirmado = 1
    estado_noConfirmado = 0
    estado_bloqueado = -1
    opciones_estado = [
        (estado_confirmado,"Confirmado"),
        (estado_noConfirmado, "No confirmado"),
        (estado_bloqueado, "Bloqueado"),
    ]

    opciones_estado_civil = [
        "soltero",
        CASADO,
        "divorciado",
        UNION_LIBRE,
        "viudo",
        "n/a"
    ]

    opciones_estado_civil = list(zip(opciones_estado_civil, opciones_estado_civil))


    idUsuario = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    usuario = models.CharField(max_length=50)
    password = models.CharField(max_length=50, blank=True)
    email = models.EmailField(unique=True)
    celular = models.CharField(max_length=10)
    tipo_persona = models.IntegerField(choices=opciones_tipo_persona)
    estado_civil = models.CharField(choices=opciones_estado_civil, max_length=15)
    estado = models.IntegerField(choices=opciones_estado, default=0)
    direccion1 = models.CharField(max_length=200, blank= True)
    direccion2 = models.CharField(max_length=200, blank= True)
    canton = models.ForeignKey(Canton, blank=True, null=True, on_delete=models.SET_NULL)
    provincia = models.CharField(max_length=50, blank=True)
    pais = models.CharField(max_length=50, blank=True)
    tipo_usuario = models.CharField(choices=opciones_tipo_usuario, max_length=15, default="inversionista")

    fecha_nacimiento = models.DateField(blank=True, null=True)

    contratoAcUsoFirmado = models.BooleanField(default=False) 


    ruc = models.CharField(max_length=15, blank=True, null=True)

    #Model user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=True)

    #datos personales para financiar una inversion
    cedula = models.CharField(max_length=10, blank=True)
    cedula_ruta = models.TextField(blank=True)
    profile_pic_ruta = models.TextField(blank=True, null=True)
    conyuge_id = models.ForeignKey(Conyuge, blank=True, null=True, on_delete=models.CASCADE)
    telefono_domicilio =  models.CharField(blank=True, null=True, max_length=30)
    ingresos = models.ForeignKey(Fuente_ingresos, blank=True, null=True, on_delete=models.CASCADE)
    cuenta_bancaria = models.ForeignKey(Cuenta_bancaria, blank=True, null=True, on_delete=models.CASCADE)

    def __str__ (self):
        return self.nombres + " " + self.apellidos + ", " + self.cedula

    @staticmethod
    def get_usuario(request):
        token_dic = request.COOKIES.get('auth_token')

        token = json.loads(token_dic)

        token_access = token.get('access')
        token_refresh = token.get('refresh')
        headers = {"Authorization": "Bearer "+token_access}
        decodedPayload = jwt.decode(token_access,None,None)
        usuario = Usuario.objects.filter(user=decodedPayload["user_id"])[0]
        return usuario

class Pregunta(models.Model):
    texto = models.CharField(max_length=50)
    class Meta:
        verbose_name = "Pregunta"
        verbose_name_plural = "Preguntas"

    def __str__(self):
        return self.texto

class Respuesta(models.Model):
    texto = models.CharField(max_length=50)
    class Meta:
        verbose_name = "Respuesta"
        verbose_name_plural = "Respuestas"

    def __str__(self):
        return self.texto

class Encuesta(models.Model):
    id_pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE)
    id_respuesta = models.ForeignKey(Respuesta, on_delete=models.CASCADE)
    id_usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateField()
    class Meta:
        verbose_name = "Encuesta"
        verbose_name_plural = "Encuestas"

    # def __str__(self):
    #     pass


#Signals
def cambiar_estado_contrato_firmado_usuarios(sender, instance, created, **kwargs):
    if(created):
        if(instance.tipoContrato == "ac_uso"):
            Usuario.objects.all().update(contratoAcUsoFirmado=False)


# Se conecta la señal con el modelo Contrato 
post_save.connect(cambiar_estado_contrato_firmado_usuarios, sender=VersionContrato)