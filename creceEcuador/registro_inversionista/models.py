""""Modulo para crear modelos de la DB"""
from django.db import models
from django.conf import settings




class Usuario(models.Model):
    """Tabla Usuario en la DB"""
    persona_natural = 1
    persona_juridica = 0
    opciones_tipo_persona = [
        (persona_natural, "persona natural"),
        (persona_juridica, "persona juridica")
    ]

    estado_confirmado = 1
    estado_noConfirmado = 0
    estado_bloqueado = -1
    opciones_estado = [
        (estado_confirmado,"Confirmado"),
        (estado_noConfirmado, "No confirmado"),
        (estado_bloqueado, "Bloqueado"),
    ]


    idUsuario = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    usuario = models.CharField(max_length=50)
    password = models.CharField(max_length=50, blank=True)
    email = models.EmailField()
    celular = models.CharField(max_length=10)
    tipo_persona = models.IntegerField(choices=opciones_tipo_persona)
    estado = models.IntegerField(choices=opciones_estado, default=0)
    direccion1 = models.CharField(max_length=50, blank= True)
    direccion2 = models.CharField(max_length=50, blank= True)
    ciudad = models.CharField(max_length=50, blank=True)
    provincia = models.CharField(max_length=50, blank=True)
    pais = models.CharField(max_length=50, blank=True)

    #Model user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=True)

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
    
    
    