from django.db import models
from django.conf import settings
from django.db import connection
from django.db.models.signals import post_migrate

# Create your models here.
class Proceso(models.Model):
    clase = models.CharField(max_length=250, blank=False)
    estado = models.CharField(max_length=50, blank=False)
    creado = models.DateField(auto_now_add=True)
    terminado = models.DateField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True) 
    class Meta:
        verbose_name = "Proceso"
        verbose_name_plural = "Procesos"

    def __str__(self):
        return self.descripcion

class Tarea(models.Model):
    flujo_tarea = models.CharField(max_length=255, blank=False)
    flujo_tipo = models.CharField(max_length=50, blank=False)
    estado = models.CharField(max_length=50, blank=False, default="ABIERTO")
    creado = models.DateField(auto_now_add=True)
    iniciado = models.DateField(blank=True, null=True)
    finalizado = models.DateField(blank=True, null=True)
    
    #Django crea estas foreign keys con el constraint DEFERRABLE INITIALLY DEFERRED
    #TODO al cambiar a otra base: revisar si esto se mantiene asi o es necesario modificar el constraint manualmente
    owner_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    proceso_id = models.ForeignKey('Proceso', on_delete=models.CASCADE, blank=False)
    
    comentarios = models.TextField(blank=True, null=True)
    asignado = models.DateField(blank=True, null=True)
    data = models.TextField(blank=True, null=True) 
    class Meta:
        verbose_name = "Tarea"
        verbose_name_plural = "Tareas"

class TareaPrevia(models.Model):
    desde = models.ForeignKey('Tarea', on_delete=models.CASCADE, blank=False, related_name='desde')
    hacia = models.ForeignKey('Tarea', on_delete=models.CASCADE, blank=True, null=True, related_name='hacia')
    class Meta:
        verbose_name = "Tarea Previa"
        verbose_name_plural = "Tareas Previas"
