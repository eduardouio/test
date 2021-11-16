from django.db import models

from solicitudes.models import Solicitud
from datetime import date
from registro_inversionista.models import Usuario
from django_fsm import FSMField, transition
from django_fsm import TransitionNotAllowed
from django.db.models.signals import pre_save
from datetime import date, timedelta
from log_acciones.models import EventoUsuario, EventoInversionista
import calendar
import math
from .types import get_fechas_dias_ta
from creceEcuador.constants import COMISION_ADJUDICACION_FACTOR, ADJUDICACION_FACTOR, COMISION_BANCO, COMISION_COBRANZA_INSOLUTO_MENSUAL, IVA, COMISIONES_BANCARIAS
import numpy_financial as npf
import json
import re
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
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

        mail_subject = 'Tu transferencia no ha sido recibida'
        message = render_to_string('fases_inversiones/email_inversion_declined.html', {
        })
        to_email = self.id_user.email
        email = EmailMessage(
                    mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
        )
        email.content_subtype = "html"
        email.send()
        pass

    @transition(field=fase_inversion, source='DECLINED', target='PENDING_TRANSFER')
    def decline_to_pending(self):
        EventoInversionista.objects.create(accion="DECLINED_to_PENDING_TRANSFER", inversion=self, usuario=self.id_user)
        pass

    @transition(field=fase_inversion, source='TRANSFER_SUBMITED', target='TO_BE_FUND')
    def approve_transfer(self):
        EventoInversionista.objects.create(accion="TRANSFER_SUBMITED_to_TO_BE_FUND", inversion=self, usuario=self.id_user)

        mail_subject = 'Tu transferencia ha sido recibida'
        message = render_to_string('fases_inversiones/email_inversion_tbfund.html', {
            'inversion': self,
        })
        to_email = self.id_user.email
        email = EmailMessage(
                    mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
        )
        email.content_subtype = "html"
        email.send()
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
        enviarEmailFinInversion(self)
        pass

    @property
    def monto_a_transferir(self):
        return self.monto + self.adjudicacion + self.adjudicacion_iva

    @property
    def banco_transferencia(self):
        return self.id_solicitud.id_cuenta_banco_deposito.numero_cuenta

    @property
    def banco_transferencia_nombre(self):
        return self.id_solicitud.id_cuenta_banco_deposito.nombre_banco

    @property
    def nombre_completo(self):
        return self.id_user.nombres + " " + self.id_user.apellidos

    @property
    def nombre_completo_autor(self):
        return self.id_solicitud.id_autor.nombres + " " + self.id_solicitud.id_autor.apellidos

    @property
    def monto_formated(self):
        return sep( "%.2f" % self.monto)


    @property
    def cedula_solicitante(self):
        if self.id_solicitud.id_autor.tipo_persona == 1:
            return self.id_solicitud.id_autor.cedula
        return self.id_solicitud.id_autor.ruc

    def save(self, *args, **kwargs):  
        monto_solicitud = int(self.id_solicitud.monto)
        monto_inversion = int(self.monto)
        comision_adjudicacion = monto_solicitud * COMISION_ADJUDICACION_FACTOR
        participacion_inversionista = monto_inversion / monto_solicitud
        adjudicacion = comision_adjudicacion * participacion_inversionista
        adjudicacion_iva = adjudicacion * IVA
        self.adjudicacion = adjudicacion
        self.adjudicacion_iva = adjudicacion_iva
        self.inversion_total = monto_inversion + adjudicacion_iva + adjudicacion
        super(Inversion, self).save(*args, **kwargs)

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
        verbose_name = "Pago detalle"
        verbose_name_plural = "Pagos detalles"

    def __str__(self):
        return "Pago N°: " + str(self.orden) + ", " + str(self.id_inversion)

class Pagos_ta_supuesta(models.Model):
    estado_pagado = 1
    estado_pendiente = 0
    estado_retrasado = -1
    opciones_estado = [
        (estado_pagado,"Pagado"),
        (estado_pendiente, "Pendiente"),
        (estado_retrasado, "Retrasado")
    ]

    id_inversion = models.ForeignKey(Inversion, on_delete=models.CASCADE)
    id_solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE)
    orden = models.IntegerField()
    fecha = models.DateField()
    pago = models.FloatField()
    capital = models.FloatField()
    cargo_cobranza = models.FloatField()
    intereses_previos = models.FloatField()
    monto_recibir = models.FloatField()
    capital_por_cobrar = models.FloatField()
    estado = models.IntegerField(choices=opciones_estado, default=0)

    
    @property
    def estado_pago(self):
        estado = self.estado
        if estado == 1:
            return "Pagado"
        elif estado == 0:
            return "Pendiente"
        return "Retrasado"

    @property
    def ganancia(self):
        return self.pago

    class Meta:
        verbose_name = "Pago de Inversion"
        verbose_name_plural = "Pagos supuestos de las Inversiones"

    def __str__(self):
        return  str(self.id_inversion.id_solicitud.ticket) + " Pago supuesto N°: " + str(self.orden) + ", " + \
                self.id_inversion.id_user.nombres + ", " + self.id_inversion.id_user.apellidos

class Pagos_ta_real(models.Model):
    estado_pagado = 1
    estado_pendiente = 0
    estado_retrasado = -1
    opciones_estado = [
        (estado_pagado,"Pagado"),
        (estado_pendiente, "Pendiente"),
        (estado_retrasado, "Retrasado")
    ]

    id_pago_ta_supuesta = models.ForeignKey(Pagos_ta_supuesta, on_delete=models.CASCADE)
    num_pago = models.IntegerField()
    fecha = models.DateField()
    pago = models.FloatField()
    pago_capital = models.FloatField()
    saldo_capital = models.FloatField()
    pago_intereses_previos = models.FloatField()
    saldo_intereses_previos = models.FloatField()
    pago_intereses_mora = models.FloatField()
    saldo_intereses_mora = models.FloatField()
    capital_por_cobrar = models.FloatField()

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
        verbose_name = "Pago de Inversion"
        verbose_name_plural = "Pagos reales de las Inversiones"

    def __str__(self):
        return "Pago N°: " + str(self.num_pago) + ", "

def crear_pagos_para_ta_supuesta(inversion, solicitud):
    monto_inversion = inversion.monto
    solicitud = inversion.id_solicitud
    monto_solicitud = int(solicitud.monto)
    participacion_inversionista = monto_inversion / monto_solicitud
    capital_por_cobrar_i = monto_inversion
    lista_capital_por_cobrar = [capital_por_cobrar_i]
    lista_cargo_por_cobranzas = [0]
    lista_intereses_mostrar = [0]
    lista_capitales = [0]
    lista_intereses_previos = [0]
    lista_cuotas = [0]

    TASA_INTERES_ANUAL = solicitud.tin
    if( TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100

    dic = get_fechas_dias_ta(solicitud)
    dias = dic['dias']
    fechas = dic['fechas']
    plazo_solicitud = solicitud.plazo
    plazo_dias = sum(dias)
    tasa_diaria = (1+TASA_INTERES_ANUAL/365)-1
    base = 1 + tasa_diaria
    exponente_pmt = plazo_dias / plazo_solicitud
    result = math.pow(base, exponente_pmt) - 1
    cuota_mensual = npf.pmt(result, plazo_solicitud,  monto_inversion*-1)
    cuota_mensual = round(cuota_mensual,2)
    capital_total = 0
    for i in range(plazo_solicitud):
        dias_transcurridos = dias[i+1]
        fecha_i = fechas[i]
        interes_previo_i = (math.pow(base,dias_transcurridos) - 1 )* capital_por_cobrar_i
        interes_previo_i = round(interes_previo_i, 2)
        capital_i = cuota_mensual - interes_previo_i
        capital_i = round(capital_i,2)
        interes_mostrar_i = interes_previo_i - COMISION_BANCO
        cargo_plataforma_i = capital_por_cobrar_i * COMISION_COBRANZA_INSOLUTO_MENSUAL / 30 * dias_transcurridos
        cargo_plataforma_i = round(cargo_plataforma_i,2)
        cargo_plataforma_iva_i = cargo_plataforma_i * IVA
        cargo_plataforma_iva_i = round(cargo_plataforma_iva_i,2)
        cargo_por_cobranza_i = cargo_plataforma_iva_i + cargo_plataforma_i
        

        if (i == plazo_solicitud-1):
            capital_i = monto_inversion - capital_total
            cuota_mensual = capital_i + interes_previo_i

        capital_por_cobrar_i = capital_por_cobrar_i - capital_i
        capital_total += capital_i
        monto_recibir_i = capital_i + interes_mostrar_i - cargo_por_cobranza_i

        new_pago = Pagos_ta_supuesta(id_inversion = inversion, id_solicitud = solicitud, orden = i+1, fecha = fecha_i, pago = cuota_mensual, capital = capital_i,
                                    cargo_cobranza = cargo_por_cobranza_i, intereses_previos = interes_previo_i, monto_recibir = monto_recibir_i,
                                    capital_por_cobrar = capital_por_cobrar_i)
        new_pago.save()

        lista_capital_por_cobrar.append(capital_por_cobrar_i)
        lista_capitales.append(capital_i)
        lista_intereses_previos.append(interes_previo_i)
        lista_intereses_mostrar.append(interes_mostrar_i)
        lista_cargo_por_cobranzas.append(cargo_por_cobranza_i)
        lista_cuotas.append(cuota_mensual)

    dic = {'lista_intereses_previos':lista_intereses_previos,
            'lista_capitales':lista_capitales,
            'lista_capital_por_cobrar':lista_capital_por_cobrar,
            'lista_intereses_mostrar':lista_intereses_mostrar,
            'lista_cargo_por_cobranzas':lista_cargo_por_cobranzas,
            'lista_cuotas':lista_cuotas}
    return dic

def crear_pagos(inversion,solicitud, crear = True):
    monto_inversion = float(inversion.monto)
    monto_solicitud = float(solicitud.monto)
    if crear:
        diccionario = crear_tabla_amortizacion(solicitud, "PAGO")
    else:
        diccionario = crear_tabla_amortizacion(solicitud, "NOPAGO")
    lista_capital_insoluto_sol = diccionario['lista_capital_insoluto']
    lista_cuotas_sol = diccionario['lista_pagos']
    lista_intereses_sol = diccionario['lista_intereses_pagados']
    lista_capitales_sol = diccionario['lista_capitales']
    dias = diccionario['dias']
    fechas = diccionario['fechas']
    participacion_inversionista = (monto_inversion/monto_solicitud)
    
    ganancia_total = 0;
    capital_total = 0
    for i in range(solicitud.plazo):
        interes_i =  lista_intereses_sol[i] * participacion_inversionista - COMISION_BANCO
        capital_i = lista_capitales_sol[i] * participacion_inversionista
        dias_transcurridos = dias[i+1]
        comision_i = lista_capital_insoluto_sol[i] * COMISION_COBRANZA_INSOLUTO_MENSUAL/30*dias_transcurridos * participacion_inversionista
        comision_iva_i = comision_i * IVA

        comision_total_i = comision_i + comision_iva_i
        ganancia_i = capital_i + interes_i - comision_total_i 
        capital_total += capital_i

        num_orden = i+1
        fecha = fechas[i]
        ganancia_total += ganancia_i;
        if crear:
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




#Funcion para formatear float
# La funcion espera un string con 2 decimales de precision (ej: "%.2f" % 32757121.33)
def sep(s, thou=",", dec="."):
    integer, decimal = s.split(".")
    integer = re.sub(r"\B(?=(?:\d{3})+$)", thou, integer)
    return integer + dec + decimal


def enviarEmailPagos(inversion):

    mail_subject = 'Tu inversión ha iniciado'
    message = render_to_string('fases_inversiones/email_inicio_inversion.html', {
        'tabla': generarStringTabla(inversion)
    })
    to_email = inversion.id_user.email
    email = EmailMessage(
                mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
    )
    email.content_subtype = "html"
    email.send()


def generarStringTabla(inversion):
    string_tabla = '''<table style="width: 100%;">
        <th>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">
                Fecha de Pago
            </td>
            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">
                Ganancia
            </td>
        </th>'''

    detalles = Pago_detalle.objects.filter(id_inversion=inversion).order_by('orden')

    for detalle in detalles:
        string_temp = ('<tr><td style="border: 1px solid #dddddd; text-align: center; padding: 8px; font-weight: bold;">'+
                                            str(detalle.orden)
                                        +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
                                            str(detalle.fecha)
                                        +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
                                            '$'+ sep( "%.2f" % detalle.ganancia) 
                                        +'</td> </tr>')

        string_tabla += string_temp

    string_tabla += '</table>'


    return string_tabla

def enviarEmailFinInversion(inversion):

    mail_subject = 'Tu inversión ha terminado exitosamente'
    message = render_to_string('fases_inversiones/email_final_inversion.html', {
        'tabla_inversion': generarStringTablaInversion(inversion)
    })
    to_email = inversion.id_user.email
    email = EmailMessage(
                mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
    )
    email.content_subtype = "html"
    email.send()

def generarStringTablaInversion(inversion):
    today = date.today()

    string_tabla = '<table style="width: 100%;">'

    string_tabla += ('<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">'+
        "Intereses cobrados:"
    +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
        '$'+ sep( "%.2f" % (inversion.ganancia_total - inversion.inversion_total)) 
    +'</td> </tr>')

    string_tabla += ('<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">'+
        "Capital invertido:"
    +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
        '$'+ sep( "%.2f" % (inversion.inversion_total)) 
    +'</td> </tr>')

    string_tabla += ('<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">'+
        "Fecha de inicio:"
    +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
        str(inversion.id_solicitud.fecha_finalizacion)
    +'</td> </tr>')

    string_tabla += ('<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">'+
        "Fecha de finalización:"
    +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
        str(today.strftime("%Y-%m-%d"))
    +'</td> </tr>')

    string_tabla += ('<tr><td style="border: 1px solid #dddddd; text-align: left; padding: 8px; font-weight: bold;">'+
        "TIR:"
    +'</td><td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">'+
        str(inversion.id_solicitud.tir)
    +'%</td> </tr>')

    string_tabla += '</table>'


    return string_tabla
