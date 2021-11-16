from django.db import models
from django.conf import settings
from django.db.models import Sum
from solicitudes.models import Solicitud
from django.db.models.signals import post_save
from creceEcuador.constants import COMISIONES_BANCARIAS
from .types import calcular_primera_cuota_real, calcular_cuota_real, pagar_cuota_real, calcular_cobro_mora, RANGO_DIAS
import calendar
from datetime import date, timedelta, datetime
import math
import numpy_financial as npf

# Create your models here.
class UsuarioSolicitanteTemporal(models.Model):
    nombres = models.CharField(max_length=200, blank=False)
    apellidos = models.CharField(max_length=200, blank=False)
    cedula = models.CharField(max_length=10, blank=False)
    celular = models.CharField(max_length=13, blank=False)
    email = models.CharField(max_length=100, blank=False)

    # Model user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=True)

    def __str__(self):
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
        # ("Antecedentes", "Antecedentes"),
        # ("Mala Situacion Financiera", "Mala Situacion Financiera"),
        # ("Falta de Potencial de Crecimiento", "Falta de Potencial de Crecimiento"),
        # ("Abandono de la Solicitud", "Abandono de la Solicitud"),
        (1,"Estado societario"),
        (2, "Domicilio no se encuentra en localidad requerida"),
        (3,"Sector económico"),
        (4, "Situacion Financiera"),
        (5, "No cumple tiempo minimo"),
        (6,"Abandono de la solicitud"),
        (7, "No suficiente info para ejercicio 2020"),
        (8, "Situación crediticia - no se ha podido calcular dScore"),
        (9, "Deudas en etapa judicial"),
        (10, "Situación judicial"),
        (11, "RUC no conforme"),
        (12, "No residente"),
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
    razon_de_no_aprobacion = models.IntegerField(choices=opciones_no_aprob, null=True, blank=True)
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

    def __str__ (self):
        txt = "id: {}, ruc: {}, estado: {}, fecha_creacion: {} "
        return txt.format(self.id, self.ruc, self.estado,self.fecha_creacion)


class Cuotas_ta_supuesta(models.Model):
    estado_pagado = 1
    estado_pendiente = 0
    estado_retrasado = -1
    opciones_estado = [
        (estado_pagado, "Pagado"),
        (estado_pendiente, "Pendiente"),
        (estado_retrasado, "Retrasado")
    ]

    id_solicitud = models.ForeignKey(Solicitud, on_delete=models.CASCADE)
    num_cuota = models.IntegerField(default=0)
    fecha = models.DateField()
    cuota = models.FloatField()
    capital = models.FloatField()
    intereses_pagados = models.FloatField()
    capital_insoluto = models.FloatField()
    dias_totales = models.IntegerField()
    estado = models.IntegerField(choices=opciones_estado, default=0)

    class Meta:
        verbose_name = "Cuotas_ta_supuesta"
        verbose_name_plural = "Cuotas supuestas del solicitante"

    def __str__(self):
        return str(self.id_solicitud) + ", Cuota N°: " + str(self.num_cuota) + ", Estado: " + str(self.estado)

class Cuotas_ta_real(models.Model):
    id_cuota_ta_supuesta = models.ForeignKey(Cuotas_ta_supuesta, on_delete=models.CASCADE)
    num_cuota = models.IntegerField()
    fecha = models.DateField()
    cuota = models.FloatField()
    saldo_capital = models.FloatField()
    cuota_capital = models.FloatField(null=True)
    cuota_intereses = models.FloatField()
    saldo_intereses = models.FloatField()
    capital_insoluto = models.FloatField()
    dias_mora = models.IntegerField()
    cuota_intereses_mora = models.FloatField()
    saldo_intereses_mora = models.FloatField()
    cuota_cobro_mora = models.FloatField(default=0)
    saldo_cobro_mora = models.FloatField(default=0)

    class Meta:
        verbose_name = "Cuotas_ta_real"
        verbose_name_plural = "Cuotas reales del solicitante"

    def __str__(self):
        if self.dias_mora > 0:
            return str(self.id_cuota_ta_supuesta) + ", Atrasada N°: " + str(self.num_cuota)
        elif self.dias_mora == 0:
            return str(self.id_cuota_ta_supuesta) + ", Fecha de corte N°: " + str(self.num_cuota)
        else:
            return str(self.id_cuota_ta_supuesta) + ", Anticipo N°: " + str(self.num_cuota)

def get_suma_intereses(cuotas):
    suma_intereses = 0
    suma_intereses_mora = 0
    for cuota in cuotas:
        suma_intereses += cuota.cuota_intereses
        suma_intereses_mora += cuota.cuota_intereses_mora
    return suma_intereses, suma_intereses_mora


def get_cuota_supuesta_actual(cuotas_supuestas):
    for i in range(len(cuotas_supuestas)):
        cuota = cuotas_supuestas[i]
        if cuota.estado == 1:
            next_cuota = cuotas_supuestas[i + 1]
        else:
            next_cuota = cuota
            return next_cuota
    return next_cuota


def simular_cuota_real(fecha_pago_real, solicitud):
    cuotas_supuestas = Cuotas_ta_supuesta.objects.filter(id_solicitud=solicitud).order_by("fecha")
    cuota_supuesta_actual = get_cuota_supuesta_actual(cuotas_supuestas)
    num_cuota = cuota_supuesta_actual.num_cuota
    fecha_cuota_supuesta = cuota_supuesta_actual.fecha
    dias_supuestos = cuota_supuesta_actual.dias_totales
    dias_mora = (fecha_pago_real - fecha_cuota_supuesta).days
    dias_totales = dias_mora + dias_supuestos
    cuotas_reales = Cuotas_ta_real.objects.filter(id_cuota_ta_supuesta=cuota_supuesta_actual).order_by("-fecha")
    if len(cuotas_reales) > 0:
        """Ya existen pagos para esa cuota"""
        cuota_real_actual = cuotas_reales[0]
        suma_intereses, suma_intereses_mora = get_suma_intereses(cuotas_reales)
        capital = cuota_real_actual.saldo_capital
        dic_suma_intereses = {"suma_intereses": suma_intereses, "suma_intereses_mora": suma_intereses_mora}
        interes, interes_mora = calcular_cuota_real(solicitud, cuota_supuesta_actual, cuota_real_actual,
                                                    fecha_pago_real, dic_suma_intereses)
        capital_insoluto = cuota_real_actual.capital_insoluto
        cuota = capital + interes + interes_mora + COMISIONES_BANCARIAS
        index = get_rango_dias_mora(dias_mora)
        datos_cobro_mora = verificar_cobro_mora(cuota_supuesta_actual, index)
        is_rango_cobrado = datos_cobro_mora["is_rango_cobrado"]
        if not is_rango_cobrado:
            cobro_mora = calcular_cobro_mora(dias_mora, cuota)
            cobro_mora += datos_cobro_mora["saldo_cobro_mora"]
        else:
            cobro_mora = datos_cobro_mora["saldo_cobro_mora"]
        cuota = cuota + cobro_mora
        datos = {"capital": capital, "interes": interes, "interes_mora": interes_mora,
                 "capital_insoluto": capital_insoluto, "cuota": cuota,
                 "fecha_simulacion": fecha_pago_real, "cuota_supuesta": cuota_supuesta_actual, "dias_mora": dias_mora,
                 "cobro_mora": cobro_mora}
        return datos
    else:
        """Primer pago para esa cuota"""
        capital = cuota_supuesta_actual.capital
        interes, interes_mora = calcular_primera_cuota_real(solicitud, cuota_supuesta_actual, fecha_pago_real)
        capital_insoluto = cuota_supuesta_actual.capital_insoluto + cuota_supuesta_actual.capital
        cuota = capital + interes + interes_mora + COMISIONES_BANCARIAS

        datos = {"capital": capital, "interes": interes, "interes_mora": interes_mora,
                 "capital_insoluto": capital_insoluto, "cuota": cuota,
                 "fecha_simulacion": fecha_pago_real, "cuota_supuesta": cuota_supuesta_actual, "dias_mora": dias_mora,
                 "cobro_mora": 0}
        return datos


def crear_cuota_real(datos_simulacion, datos_pago, monto):
    capital = datos_simulacion["capital"]
    cuota = datos_simulacion["cuota"]
    capital_insoluto = datos_simulacion["capital_insoluto"]
    fecha = datos_simulacion["fecha_consulta"]
    cuota_supuesta_actual = datos_simulacion["cuota_supuesta"]
    saldo_capital = datos_pago["saldo_capital"]
    cuota_intereses = datos_pago["pago_interes"]
    saldo_interes = datos_pago["saldo_interes"]
    capital_insoluto = datos_pago["saldo_capital_insoluto"]
    dias_mora = datos_simulacion["dias_mora"]
    cuota_interes_mora = datos_pago["pago_interes_mora"]
    saldo_interes_mora = datos_pago["saldo_interes_mora"]
    cuota_capital = datos_pago["pago_capital"]
    saldo_cuota = datos_pago["saldo_cuota"]
    cuota_cobro_mora = datos_pago["pago_cobro_mora"]
    saldo_cobro_mora = datos_pago["saldo_cobro_mora"]
    cuotas_reales = Cuotas_ta_real.objects.filter(id_cuota_ta_supuesta=cuota_supuesta_actual).order_by("-fecha")
    num_cuota = len(cuotas_reales) + 1

    # Redondear
    cuota_intereses = round(cuota_intereses, 2)
    saldo_interes = round(saldo_interes, 2)
    cuota_interes_mora = round(cuota_interes_mora, 2)
    saldo_interes_mora = round(saldo_interes_mora, 2)

    new_cuota_real = Cuotas_ta_real(id_cuota_ta_supuesta=cuota_supuesta_actual, num_cuota=num_cuota, fecha=fecha,
                                    cuota=monto, saldo_capital=saldo_capital, cuota_intereses=cuota_intereses,
                                    saldo_intereses=saldo_interes,
                                    capital_insoluto=capital_insoluto, dias_mora=dias_mora,
                                    cuota_intereses_mora=cuota_interes_mora,
                                    saldo_intereses_mora=saldo_interes_mora, cuota_capital=cuota_capital,
                                    cuota_cobro_mora=cuota_cobro_mora,
                                    saldo_cobro_mora=saldo_cobro_mora)
    new_cuota_real.save()
    if saldo_cuota <= 0:
        cuota_supuesta_actual.estado = 1
        cuota_supuesta_actual.save()
        print(cuota_supuesta_actual)
    return new_cuota_real

def crear_cuota_real_fecha_corte(solicitud):
    cuotas_supuestas = Cuotas_ta_supuesta.objects.filter(id_solicitud=solicitud).order_by("fecha")
    cuota_supuesta_actual = get_cuota_supuesta_actual(cuotas_supuestas)

    fecha_corte = cuota_supuesta_actual.fecha
    datos_simulacion = simular_cuota_real(fecha_corte, solicitud)
    monto = 0
    capital = datos_simulacion["capital"]
    interes = datos_simulacion["interes"]
    interes_mora = datos_simulacion["interes_mora"]
    cuota = datos_simulacion["cuota"]
    capital_insoluto = datos_simulacion["capital_insoluto"]
    datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora)
    cuota_supuesta_actual.estado == -1
    return crear_cuota_real(datos_simulacion, datos_pago, monto)


def verificar_cobro_mora(cuota_supuesta_actual, index):
    if index < 0:
        datos = {"saldo_cobro_mora": 0, "is_rango_cobrado": True}
        return datos
    elif index < 4:
        rango_dia_inicio = RANGO_DIAS[index]
        rango_dia_fin = RANGO_DIAS[index + 1]
    else:
        rango_dia_inicio = RANGO_DIAS[index]

    cuotas_reales = Cuotas_ta_real.objects.filter(id_cuota_ta_supuesta=cuota_supuesta_actual)
    cuotas_reales_con_cargo_cobranza = []

    for cuota_real in cuotas_reales:
        fecha_cuota_supuesta = cuota_supuesta_actual.fecha
        dias_supuestos = cuota_supuesta_actual.dias_totales
        fecha_pago_real = cuota_real.fecha
        dias_mora = (fecha_pago_real - fecha_cuota_supuesta).days

        if index < 4:
            if dias_mora in range(rango_dia_inicio, rango_dia_fin):
                cuotas_reales_con_cargo_cobranza.append(cuota_real)
        else:
            if dias_mora >= rango_dia_inicio:
                cuotas_reales_con_cargo_cobranza.append(cuota_real)

    pago_cobro_mora_total = 0
    saldo_cobro_mora_total = 0
    simulacion_cobro_mora = 0
    for cuotas_real_con_cobranza in cuotas_reales_con_cargo_cobranza:
        pago_cobro_mora = cuotas_real_con_cobranza.cuota_cobro_mora
        saldo_cobro_mora = cuotas_real_con_cobranza.saldo_cobro_mora
        simulacion_cobro_mora_tmp = pago_cobro_mora + saldo_cobro_mora
        if simulacion_cobro_mora_tmp > simulacion_cobro_mora:
            simulacion_cobro_mora = simulacion_cobro_mora_tmp
        if pago_cobro_mora > 0:
            pago_cobro_mora_total += pago_cobro_mora
        if saldo_cobro_mora > 0:
            saldo_cobro_mora_total = saldo_cobro_mora

    if pago_cobro_mora_total == 0:
        if saldo_cobro_mora_total > 0:
            datos = {"saldo_cobro_mora": saldo_cobro_mora_total, "is_rango_pagado": False, "is_rango_cobrado": True}
        elif saldo_cobro_mora_total == 0:
            datos_cobro_anterior = verificar_cobro_mora(cuota_supuesta_actual, index - 1)
            saldo_cobro_mora_anterior = datos_cobro_anterior["saldo_cobro_mora"]
            saldo_cobro_mora_total += saldo_cobro_mora_anterior
            datos = {"saldo_cobro_mora": saldo_cobro_mora_total, "is_rango_pagado": False, "is_rango_cobrado": False}
    else:
        # if cont_pago_cobro_mora >= cont_saldo_cobro_mora:
        #     print("entre aqui")
        #     datos = {"saldo_cobro_mora":0, "is_rango_pagado":True, "is_rango_cobrado":True}
        # else:
        #     datos = {"saldo_cobro_mora":saldo_cobro_mora_total, "is_rango_pagado":False, "is_rango_cobrado":True}
        if simulacion_cobro_mora == pago_cobro_mora_total:
            datos = {"saldo_cobro_mora": 0, "is_rango_pagado": True, "is_rango_cobrado": True}
        else:
            datos = {"saldo_cobro_mora": saldo_cobro_mora_total, "is_rango_cobrado": True, "is_rango_pagado": False}
    return datos


def get_rango_dias_mora(dias_mora):
    if 4 <= dias_mora <= 30:
        index = 1
    elif 31 <= dias_mora <= 60:
        index = 2
    elif 61 <= dias_mora <= 90:
        index = 3
    elif dias_mora > 90:
        index = 4
    else:
        index = 0

    return index


