from django.db import models
from datetime import date
from registro_inversionista.models import Usuario

# Create your models here.
class CategoriaSolicitud(models.Model):
    #Modelo Categoria de solicitud
    nombre = models.CharField(max_length=100)

class TipoCredito(models.Model):
    #Modelo Tipo de credito
    nombre = models.CharField(max_length=100)

class Solicitud(models.Model):
    #Modelo Solicitud
    titulo = models.CharField(max_length=200, blank=False)
    operacion = models.TextField(blank=False)
    historia = models.TextField(blank=False)
    plazo = models.IntegerField(blank=False)
    url = models.TextField(blank=False) 
    imagen_url = models.TextField(blank=False) 
    monto = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    moneda = models.CharField(max_length=10)
    tir = models.DecimalField(max_digits=4, decimal_places=2, blank=False)
    tin = models.DecimalField(max_digits=4, decimal_places=2, blank=False, default=True)
    porcentaje_financiado = models.DecimalField(max_digits=4, decimal_places=2, blank=False, default=0)
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_publicacion = models.DateField()
    fecha_finalizacion = models.DateField()
    fecha_expiracion = models.DateField()
    id_autor = models.ForeignKey('registro_inversionista.Usuario', on_delete=models.DO_NOTHING, blank=False) #Se debe especificar la app del modelo
    id_categoria = models.ForeignKey('CategoriaSolicitud', on_delete=models.DO_NOTHING, blank=False)
    id_tipo_credito = models.ForeignKey('TipoCredito', on_delete=models.DO_NOTHING, blank=False)

    @property
    def autor(self):
        return (self.id_autor.nombres + " "  + self.id_autor.apellidos)
    
    @property
    def categoria(self):
        return self.id_categoria.nombre
    
    @property
    def tipo_credito(self):
        return self.id_tipo_credito.nombre
        
    @property
    def tipo_persona(self):
        if self.id_autor.tipo_persona == 0:
            return "Persona Juridica"
        
        return "Persona Natural"


    
class HistorialFinanciamiento(models.Model):
    id_usuario = models.ForeignKey('registro_inversionista.Usuario', on_delete=models.DO_NOTHING, blank=False)
    id_solicitud = models.ForeignKey('Solicitud', on_delete=models.DO_NOTHING, blank=False)
    fecha_financiamiento = models.DateField()
    porcentaje_financiamiento = models.DecimalField(max_digits=4, decimal_places=2, blank=False, default=0)
    monto_financiamiento = models.DecimalField(max_digits=10, decimal_places=2, blank=False)