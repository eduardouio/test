from django.db import models
from datetime import date, timedelta
import calendar
from django.conf import settings
from registro_inversionista.models import Usuario
from django.db.models.signals import pre_save, post_save
from ckeditor_uploader.fields import RichTextUploadingField

# Create your models here.
class CategoriaSolicitud(models.Model):
    #Modelo Categoria de solicitud
    nombre = models.CharField(max_length=100)
    imagen_categoria = models.ImageField(blank=False, null=False, upload_to="categoria_solicitud")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoria Solicitud"
        verbose_name_plural = "Categorías Solicitud"

class ClaseSolicitud(models.Model):
    #Modelo Categoria de solicitud
    nombre = models.CharField(max_length=100)
    imagen_clase = models.ImageField(blank=False, null=False, upload_to="clase_solicitud")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Perfil de Riesgo"
        verbose_name_plural = "Perfiles de Riesgo"

class TipoCredito(models.Model):
    #Modelo Tipo de credito
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Tipo Crédito"
        verbose_name_plural = "Tipo Créditos"

class Solicitud(models.Model):
    #Modelo Solicitud
    ticket = models.CharField(max_length=200, blank=True)
    operacion = models.TextField(blank=False)
    historia = RichTextUploadingField()
    plazo = models.IntegerField(blank=False)
    url = models.TextField(blank=True, null=True) 
    imagen_url = models.ImageField(blank=False, null=False, upload_to="solicitudes")
    monto = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    moneda = models.CharField(max_length=10)
    tir = models.DecimalField(max_digits=4, decimal_places=2, blank=False)
    tin = models.DecimalField(max_digits=4, decimal_places=2, blank=False, default=True)
    porcentaje_financiado = models.DecimalField(max_digits=5, decimal_places=2, blank=False, default=0)
    monto_financiado = models.DecimalField(max_digits=10, decimal_places=2, blank=False, default=0)
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_publicacion = models.DateField()
    fecha_finalizacion = models.DateField(blank=True, null=True)
    fecha_expiracion = models.DateField(blank=True, null=True)
    id_autor = models.ForeignKey('registro_inversionista.Usuario', on_delete=models.SET_NULL, null=True, blank=False) #Se debe especificar la app del modelo
    id_categoria = models.ForeignKey('CategoriaSolicitud', on_delete=models.SET_NULL, null=True, blank=False)
    id_perfil_riesgo = models.ForeignKey('ClaseSolicitud', on_delete=models.SET_NULL, null=True, blank=False, default=1)
    id_tipo_credito = models.ForeignKey('TipoCredito', on_delete=models.SET_NULL, null=True, blank=False)
    id_calificacion_solicitante = models.ForeignKey('CalificacionSolicitante', on_delete=models.SET_NULL, null=True, blank=False)
    id_cuenta_banco_deposito = models.ForeignKey('BancoDeposito', on_delete=models.SET_NULL, blank=True, null=True)
    
    garantias = models.CharField(max_length=200, blank=True, default=True, null=True)
    visita_agente_CRECE = models.TextField(blank=True, default=True, null=True)
    condiciones = models.TextField(blank=True, default=True, null=True)
    mas_informacion_autor = models.TextField(blank=True, default=True, null=True)

    @property
    def autor(self):
        return (self.id_autor.nombres + " "  + self.id_autor.apellidos)

    @property
    def ruc_autor(self):
        return self.id_autor.ruc
    
    @property
    def clase(self):
        return self.id_perfil_riesgo.nombre

    @property
    def clase_img(self):
        return '/'+ settings.MEDIA_URL + str(self.id_perfil_riesgo.imagen_clase)

    @property
    def categoria(self):
        return self.id_categoria.nombre

    @property
    def imagen_categoria(self):
        return '/'+ settings.MEDIA_URL + str(self.id_categoria.imagen_categoria)

    @property
    def solicitudes_pagadas(self):
        return str(self.id_calificacion_solicitante.solicitudes_pagadas) + '/' + str(self.id_calificacion_solicitante.solicitudes_totales)
    
    @property
    def solicitudes_vigentes(self):
        return str(self.id_calificacion_solicitante.solicitudes_vigentes) + '/' + str(self.id_calificacion_solicitante.solicitudes_totales)
    
    @property
    def puntualidad_autor(self):
        return str(self.id_calificacion_solicitante.puntualidad)
    
    @property
    def tipo_credito(self):
        return self.id_tipo_credito.nombre
        
    @property
    def tipo_persona(self):
        if self.id_autor.tipo_persona == 0:
            return "Persona Juridica"
        
        return "Persona Natural"

    def __str__(self):
        return self.ticket + ", "+ self.autor

    def save(self, *args, **kwargs):
        if(self.ticket == ""):
            self.ticket = generar_ticker(self.id_categoria)
        fecha_expiracion = generar_fecha_expiracion(self.fecha_publicacion)
        self.fecha_expiracion = fecha_expiracion
        super(Solicitud, self).save(*args, **kwargs)
        



    class Meta:
        verbose_name = "Solicitud"
        verbose_name_plural = "Solicitudes"

    
class HistorialFinanciamiento(models.Model):
    id_usuario = models.ForeignKey('registro_inversionista.Usuario', on_delete=models.SET_NULL, null=True, blank=False)
    id_solicitud = models.ForeignKey('Solicitud', on_delete=models.SET_NULL, null=True, blank=False)
    fecha_financiamiento = models.DateField()
    porcentaje_financiamiento = models.DecimalField(max_digits=4, decimal_places=2, blank=False, default=0)
    monto_financiamiento = models.DecimalField(max_digits=10, decimal_places=2, blank=False)

    class Meta:
        verbose_name = "Historial de Financiamiento"
        verbose_name_plural = "Historiales de Financiamiento"

class CalificacionSolicitante(models.Model):
    solicitudes_totales = models.IntegerField(blank=False)
    solicitudes_pagadas = models.IntegerField(blank=False)
    solicitudes_vigentes = models.IntegerField(blank=False)
    puntualidad = models.DecimalField(max_digits=5, decimal_places=2, blank=False)
    id_autor = models.ForeignKey('registro_inversionista.Usuario', on_delete=models.SET_NULL, null=True, blank=False)

    def __str__(self):
        return ("Calificacion: "+self.id_autor.nombres + " "  + self.id_autor.apellidos)

    class Meta:
        verbose_name = "Calificación del Solicitante"
        verbose_name_plural = "Calificaciónes de los Solicitantes"

class BancoDeposito(models.Model):
    numero_cuenta = models.CharField(max_length=15)
    nombre = models.CharField(max_length=200)
    GUAY = "GUAYAQUIL"
    PACI = "PACÍFICO"
    PICH = "PICHINCHA"
    BOLI = "BOLIVARIANO"
    PROD = "PRODUBANCO"
    DINE = "DINERS"
    AMAZ = "AMAZONAS"
    AUST = "AUSTRO"
    RUMI = "GENERAL RUMIÑAHUI"
    INTE = "INTERNACIONAL"
    SOLI = "SOLIDARIO"
    MACH = "MACHALA"
    LOJA = "LOJA"
    PROC = "PROCREDIT"
    LITO = "LITORAL"
    VISI = "VISIÓNFUND ECUADOR"
    CODE = "CODESARROLLO"
    CAPI = "CAPITAL"
    COMA = "COMERCIAL DE MANABÍ"
    COOP = "COOPNACIONAL"
    DELB = "DELBANK"


    BANK_CHOICES = (
    (GUAY, "Guayaquil"),
    (PACI, "Pacífico"),
    (PICH, "Pichincha"),
    (BOLI, "Bolivariano"),
    (PROD, "Produbanco"),
    (DINE, "Diners"),
    (AMAZ, "Amazonas"),
    (AUST, "Austro"),
    (RUMI, "General Rumiñahui"),
    (INTE, "Internacional"),
    (SOLI, "Solidario"),
    (MACH, "Machala"),
    (LOJA, "Loja"),
    (PROC, "Procredit"),
    (LITO, "Litoral"),
    (VISI, "VisiónFund Ecuador"),
    (CODE, "Codesarrollo"),
    (CAPI, "Capital"),
    (COMA, "Comercial de Manabí"),
    (COOP, "CoopNacional"),
    (DELB, "DelBank")
    )
    nombre_banco = models.CharField(max_length=200, choices=BANK_CHOICES, blank=False ,null=False)
    
    def __str__(self):
        return self.nombre + ", " + self.numero_cuenta+ ", "+ self.nombre_banco


def generar_ticker(categoria):
    categoria_slice = categoria.nombre[0:3].upper()
    last_ticker_categoria = Solicitud.objects.filter(ticket__startswith=categoria_slice).order_by('ticket').last()
    if not last_ticker_categoria:
        return categoria_slice.upper()+"001"
    categoria_no = last_ticker_categoria.ticket
    new_categoria_no = str(int(categoria_no[3:]) + 1)
    new_categoria_no = categoria_no[0:-(len(new_categoria_no))] + new_categoria_no
    return new_categoria_no

def generar_fecha_expiracion(fecha_publicacion):
    fecha_expiracion = fecha_publicacion + timedelta(days=60)
    return fecha_expiracion
