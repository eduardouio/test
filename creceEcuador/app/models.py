from django.db import models

class User(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    usuario = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        """ string para User"""
        return self.nombres + " " + self.apellidos
