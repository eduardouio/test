from django.db import models
from solicitudes.models import Solicitud
from datetime import date
from registro_inversionista.models import Usuario
from django_fsm import FSMField, transition
from django_fsm import TransitionNotAllowed
from django.db.models.signals import pre_save, post_save
from django.conf import settings
from datetime import date, timedelta
from log_acciones.models import EventoUsuario, EventoInversionista
import calendar
import math
import numpy as np 
import decimal
from .types import COMISION_ADJUDICACION_FACTOR, ADJUDICACION_FACTOR, COMISION_BANCO, COMISION_COBRANZA_INSOLUTO_MENSUAL, IVA, COMISIONES_BANCARIAS
import numpy_financial as npf
import json
# Create your models here.

FASES_INVERSION = ('OPEN', 'FILL_INFO', 'CONFIRM_INVESTMENT', 'ORIGIN_MONEY', 'PENDING_TRANSFER', 'TRANSFER_SUBMITED','TO_BE_FUND', 'VALID', 'ABANDONED','GOING', 'FINISHED','DECLINED')
FASES_INVERSION = list(zip(FASES_INVERSION, FASES_INVERSION))
class Inversion(models.Model):
    estado_confirmada = 1
    estado_xConfirmar = 0
    opciones_estado = [
        (estado_confirmada,"Confirmada"),
        (estado_xConfirmar, "Por confirmar")
    ]

    id_user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    id_solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE)
    monto = models.FloatField()
    adjudicacion = models.FloatField(blank=True, null=True)
    adjudicacion_iva = models.FloatField(default=None, blank=True, null=True)
    inversion_total = models.FloatField(blank=True, null=True)
    ganancia_total = models.FloatField(blank=True, null=True)
    estado = models.IntegerField(choices=opciones_estado, default=0)
    fase_inversion = FSMField(default=FASES_INVERSION[0][0], choices=FASES_INVERSION)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True)

    @transition(field=fase_inversion, source='OPEN', target='CONFIRM_INVESTMENT')
    def start(self):
        EventoInversionista.objects.create(accion="OPEN_to_CONFIRM_INVESTMENT", inversion=self, usuario=self.id_user)
        pass
    #FASES_INVERSION = ('OPEN', 'FILL_INFO', 'CONFIRM_INVESTMENT', 'ORIGIN_MONEY', 'PENDING_TRANSFER', 'TRANSFER_SUBMITED','TO_BE_FUND', 'VALID', 'ABANDONED','GOING', 'FINISHED','DECLINED')
    @transition(field=fase_inversion, source='CONFIRM_INVESTMENT', target='FILL_INFO')
    def step_two(self):
        EventoInversionista.objects.create(accion="CONFIRM_INVESTMENT_to_FILL_INFO", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='FILL_INFO', target='ORIGIN_MONEY')
    def step_three(self):
        EventoInversionista.objects.create(accion="FILL_INFO_to_ORIGIN_MONEY", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='ORIGIN_MONEY', target='PENDING_TRANSFER')
    def step_four(self):
        EventoInversionista.objects.create(accion="ORIGIN_MONEY_to_PENDING_TRANSFER", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='PENDING_TRANSFER', target='TRANSFER_SUBMITED')
    def validate_transfer(self):
        EventoInversionista.objects.create(accion="PENDING_TRANSFER_to_TRANSFER_SUBMITED", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='TRANSFER_SUBMITED', target='DECLINED')
    def decline_transfer(self):
        EventoInversionista.objects.create(accion="TRANSFER_SUBMITED_to_DECLINED", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='DECLINED', target='PENDING_TRANSFER')
    def decline_to_pending(self):
        EventoInversionista.objects.create(accion="DECLINED_to_PENDING_TRANSFER", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='TRANSFER_SUBMITED', target='TO_BE_FUND')
    def approve_transfer(self):
        EventoInversionista.objects.create(accion="TRANSFER_SUBMITED_to_TO_BE_FUND", inversion=self, usuario=self.id_user)
        pass


    @transition(field=fase_inversion, source='TO_BE_FUND', target='ABANDONED')
    def invalid_project(self):
        EventoInversionista.objects.create(accion="TO_BE_FUND_to_ABANDONED", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='TO_BE_FUND', target='GOING')
    def validate(self):
        EventoInversionista.objects.create(accion="TO_BE_FUND_to_GOING", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='GOING', target='FINISHED')
    def finish(self):
        EventoInversionista.objects.create(accion="GOING_to_FINISHED", inversion=self, usuario=self.id_user)
        pass

    @property
    def monto_a_transferir(self):
        return self.monto + self.adjudicacion + self.adjudicacion_iva

    @property
    def banco_transferencia(self):
        return self.id_solicitud.id_cuenta_banco_deposito.numero_cuenta

    @property
    def nombre_completo(self):
        return self.id_user.nombres + " " + self.id_user.apellidos

    @property
    def nombre_completo_autor(self):
        return self.id_solicitud.id_autor.nombres + " " + self.id_solicitud.id_autor.apellidos


    @property
    def cedula_solicitante(self):
        if self.id_solicitud.id_autor.tipo_persona == 1:
            return self.id_solicitud.id_autor.cedula
        return self.id_solicitud.id_autor.ruc

    class Meta:
        verbose_name = "Inversion"
        verbose_name_plural = "Inversiones"

    def __str__(self):
        usuario = self.id_user
        solicitud = self.id_solicitud
        if (self.estado == 1):
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", Confirmado: $" + str(self.monto) 
        else:
            return usuario.nombres + " " + usuario.apellidos + ", " + solicitud.operacion + ", No confirmado: $" + str(self.monto)


    
class Pagos_ta_supuesta(models.Model):

    id_solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE)
    num_pago = models.IntegerField(default=0)
    fecha = models.DateField()
    pago = models.FloatField()
    capital = models.FloatField()
    intereses_pagados = models.FloatField()
    capital_insoluto = models.FloatField()
    dias_totales = models.IntegerField()


    class Meta:
        verbose_name = "Pagos_ta_supuesta"
        verbose_name_plural = "Pagos_ta_supuestas"

    # def __str__(self):
    #     pass
    
    

class Pago_detalle(models.Model):
    estado_pagado = 1
    estado_pendiente = 0
    estado_retrasado = -1
    opciones_estado = [
        (estado_pagado,"Pagado"),
        (estado_pendiente, "Pendiente"),
        (estado_retrasado, "Retrasado")
    ]

    id_inversion = models.ForeignKey(Inversion, on_delete=models.CASCADE)
    orden = models.IntegerField()
    fecha = models.DateField()
    pago = models.FloatField()
    comision = models.FloatField()
    comision_iva = models.FloatField()
    ganancia = models.FloatField()
    estado = models.IntegerField(choices=opciones_estado, default=0)
    
    @property
    def estado_pago(self):
        estado = self.estado
        if estado == 1:
            return "Pagado"
        elif estado == 0:
            return "Pendiente"
        return "Retrasado"
    class Meta:
        verbose_name = "Pago_detalle"
        verbose_name_plural = "Pago_detalles"

    # def __str__(self):
    #     pass


def crear_pagos(inversion,solicitud):
    monto_inversion = float(inversion.monto)
    monto_solicitud = float(solicitud.monto)
    diccionario = crear_tabla_amortizacion(solicitud, "PAGO")
    lista_capital_insoluto_sol = diccionario['lista_capital_insoluto']
    lista_cuotas_sol = diccionario['lista_pagos']
    lista_intereses_sol = diccionario['lista_intereses_pagados']
    lista_capitales_sol = diccionario['lista_capitales']
    dias = diccionario['dias']
    fechas = diccionario['fechas']
    participacion_inversionista = (monto_inversion/monto_solicitud)
    COMISION_ADJUDICACION = monto_solicitud * COMISION_ADJUDICACION_FACTOR
    cargo_adjudicacion = COMISION_ADJUDICACION * participacion_inversionista
    cargo_adjudicacion_iva = cargo_adjudicacion * IVA
    inversion_total = monto_inversion + cargo_adjudicacion + cargo_adjudicacion_iva 
    
    ganancia_total = 0;
    capital_total = 0
    for i in range(solicitud.plazo):
        interes_i =  lista_intereses_sol[i] * participacion_inversionista - COMISION_BANCO
        # interes_i = round(interes_i,2)
        capital_i = lista_capitales_sol[i] * participacion_inversionista
        # capital_i = round(capital_i,2)
        dias_transcurridos = dias[i+1]
        comision_i = lista_capital_insoluto_sol[i] * COMISION_COBRANZA_INSOLUTO_MENSUAL/30*dias_transcurridos * participacion_inversionista
        # comision_i = round(comision_i,2)
        comision_iva_i = comision_i * IVA
        # comision_iva_i = round(comision_iva_i,2)
        comision_total_i = comision_i + comision_iva_i
        # comision_total_i = round(comision_total_i,2)
        ganancia_i = capital_i + interes_i - comision_total_i 
        # ganancia_i = round(ganancia_i,2)
        capital_total += capital_i
        # ganancia_total += ganancia_i;

        num_orden = i+1
        fecha = fechas[i]
        pago = round(capital_i,2)
        comision = round(comision_i, 2)
        comision_iva = round(comision_iva_i,2)
        # ganancia = round(ganancia_i,2)
        ganancia_total += ganancia_i;
        print(ganancia_i,"\t\t",capital_i,"\t\t",interes_i,"\t\t",comision_total_i)
        new_pago_detalle = Pago_detalle(id_inversion=inversion, orden=num_orden, fecha=fecha, pago=capital_i, comision=comision_i, 
                                        comision_iva=comision_iva_i, ganancia=ganancia_i)
        new_pago_detalle.save()
    return ganancia_total

    


def crear_tabla_amortizacion(solicitud, modo):
    monto_solicitud = float(solicitud.monto)
    plazo_solicitud = solicitud.plazo
    TASA_INTERES_ANUAL = float(solicitud.tin)
    start_date = solicitud.fecha_finalizacion
    temp_date = solicitud.fecha_finalizacion
    if(modo != "PAGO"):
        start_date = solicitud.fecha_publicacion
        temp_date = solicitud.fecha_publicacion
    next_date = add_months(start_date, 1)
    fechas=[]
    dias=[]


    dias_transcurridos = abs((start_date - start_date).days)
    dias.append(dias_transcurridos)

    for i in range(plazo_solicitud):
        if(next_date.weekday() == 6):   #domingo
            next_date = next_date + timedelta(days=1)

            dias_transcurridos = abs((next_date - temp_date).days) 
            temp_date = date(next_date.year, next_date.month , next_date.day)
            next_date = next_date + timedelta(days=-1)
        elif (next_date.weekday() == 5):    #sabado
            next_date = next_date + timedelta(days=2)
            dias_transcurridos = abs((next_date - temp_date).days) 
            temp_date = date(next_date.year, next_date.month , next_date.day)
            next_date = next_date + timedelta(days=-2)
        else:
            dias_transcurridos = abs((next_date - temp_date).days) 
            temp_date = date(next_date.year, next_date.month , next_date.day)
        dias.append(dias_transcurridos)
        next_date = add_months(start_date, i+2)
        fechas.append(temp_date)

    
    plazo_dias = sum(dias)

    if( TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100


    tasa_diaria = (1+TASA_INTERES_ANUAL/365)-1
    base = 1 + tasa_diaria
    exponente = plazo_dias/plazo_solicitud
    tasa_mensual = math.pow(base,exponente) - 1
    cuota_mensual = npf.pmt(tasa_mensual, plazo_solicitud,  monto_solicitud) * -1


    capital_por_pagar_i = monto_solicitud
    pago_i = cuota_mensual + COMISIONES_BANCARIAS
    MONTO_SOLICITANTE = monto_solicitud
    capital_TOTAL =0
    pago_TOTAL = 0
    intereses_TOTAL = 0

    lista_capital_insoluto = [monto_solicitud]
    lista_pagos = []
    lista_intereses_pagados = []
    lista_capitales = []

    for i in range(plazo_solicitud):
        dias_transcurridos = dias[i+1]
        base = 1 + tasa_diaria
        tasa_mensual = math.pow(base,dias_transcurridos) - 1
        intereses_pagados_i = capital_por_pagar_i*tasa_mensual
        
        
        intereses_TOTAL += intereses_pagados_i
        lista_intereses_pagados.append(intereses_pagados_i)
        capital_i = cuota_mensual - intereses_pagados_i
        
        
        if (i == plazo_solicitud-1):
            capital_i = MONTO_SOLICITANTE - capital_TOTAL
            pago_i = capital_i + intereses_pagados_i + COMISIONES_BANCARIAS
            
        

        
        capital_TOTAL += capital_i
        lista_capitales.append(capital_i)

        lista_pagos.append(pago_i)
        pago_TOTAL += pago_i


        capital_por_pagar_i = capital_por_pagar_i - capital_i
        lista_capital_insoluto.append(capital_por_pagar_i)


    diccionario = {     'lista_pagos': lista_pagos, 
                        'lista_capital_insoluto': lista_capital_insoluto,
                        'lista_intereses_pagados': lista_intereses_pagados,
                        'lista_capitales':lista_capitales,
                        'dias':dias,
                        'fechas':fechas}


    return diccionario

def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = sourcedate.day
    try:
        new_date = date(year, month, day)
    except Exception as e:
            day = day % calendar.monthrange(year,month)[1]
            new_date = date(year, month + 1, day)
    return new_date  



#Signals
def cambiar_estado_solicitud(sender, instance, **kwargs):
    try:
        solicitud_en_base =  Solicitud.objects.get(pk=instance.pk)
        
        if(instance.porcentaje_financiado != solicitud_en_base.porcentaje_financiado and instance.porcentaje_financiado == 100):
            inversiones = Inversion.objects.filter(id_solicitud=instance)

            for inversion in inversiones:
                try:
                    inversion.validate()
                    
                    print("Inversion transition: ",str(inversion))

                except TransitionNotAllowed:
                    print("Inversion no transition: ",str(inversion))
                    pass
                inversion.save()

    except Solicitud.DoesNotExist:
        print("Solicitud nueva")

#Signals
def crear_pagos_inversion(sender, instance, **kwargs):
    try:
        
        
        if(instance.porcentaje_financiado == 100 and instance.fecha_finalizacion != None):
            inversiones = Inversion.objects.filter(id_solicitud=instance)

            for inversion in inversiones:
                crear_pagos(inversion, instance)
            diccionario = crear_tabla_amortizacion(instance, "PAGO")
            lista_capital_insoluto = diccionario['lista_capital_insoluto']
            lista_pagos = diccionario['lista_pagos']
            lista_intereses_pagados = diccionario['lista_intereses_pagados']
            lista_capitales= diccionario['lista_capitales']
            dias = diccionario['dias']
            fechas = diccionario['fechas']
            for i in range(instance.plazo):
                dias_totales_i = dias[i+1]
                fecha_i = fechas[i]
                intereses_pagados_i = lista_intereses_pagados[i]
                capital_insoluto_i = lista_capital_insoluto[i+1]
                capital_i = lista_capitales[i]
                pago_i = lista_pagos[i]
                num_pago = i+1
                new_pago_ta_supuesta = Pagos_ta_supuesta(id_solicitud=instance, num_pago = num_pago, dias_totales = dias_totales_i,
                                                        fecha = fecha_i, pago = pago_i, capital = capital_i, intereses_pagados = intereses_pagados_i,
                                                        capital_insoluto = capital_insoluto_i)
                new_pago_ta_supuesta.save()

                

    except Solicitud.DoesNotExist:
        print("Solicitud nueva")

# Se conecta la señal con el modelo TransferenciaInversion
pre_save.connect(cambiar_estado_solicitud, sender=Solicitud)
post_save.connect(crear_pagos_inversion, sender=Solicitud)