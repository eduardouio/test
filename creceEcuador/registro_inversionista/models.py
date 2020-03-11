""""Modulo para crear modelos de la DB"""
from django.db import models
from django.conf import settings




class Usuario(models.Model):
    """Tabla Usuario en la DB"""

    idUsuario = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    usuario = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    email = models.EmailField()
    celular = models.CharField(max_length=10)
    tipo_persona = models.IntegerField()
    estado = models.IntegerField()
    direccion1 = models.CharField(max_length=50)
    direccion2 = models.CharField(max_length=50)
    ciudad = models.CharField(max_length=50)
    provincia = models.CharField(max_length=50)
    pais = models.CharField(max_length=50)