""" Utilities Solicitante """

from django.db.models import Sum

from lib.tablaAmortizacion import *
from .models import Cuotas_ta_supuesta, Cuotas_ta_real, crear_cuota_real
from fases_inversiones.utils import simular_primer_pago_real, calcular_montos_inversion, simular_pago_real
from fases_inversiones.models import Pagos_ta_real, Pagos_ta_supuesta

import math
import numpy_financial as npf

lista_cobranza_1 = [4.38, 5.35, 5.92, 6.32, 6.63, 6.88]
lista_cobranza_2 = [14.23, 14.46, 15.83, 18.34, 21.99, 26.78]
lista_cobranza_3 = [21.17, 21.85, 23.27, 25.43, 28.34, 32.01]
lista_cobranza_4 = [23.56, 24.64, 27.03, 30.72, 35.70, 41.99]
RANGO_DIAS = [0, 4, 31, 61, 91]

def get_rango_dias_mora(dias_mora):
    if (dias_mora >= 4 and dias_mora <= 30):
        index = 1
    elif (dias_mora >= 31 and dias_mora <= 60):
        index = 2
    elif (dias_mora >= 61 and dias_mora <= 90):
        index = 3
    elif dias_mora > 90:
        index = 4
    else:
        index = 0

    return index 


def verificar_cobro_mora(cuota_supuesta_actual, index):

    if index < 0:
        datos = {"saldo_cobro_mora":0, "is_rango_cobrado":True}
        return datos
    elif index < 4:
        rango_dia_inicio = RANGO_DIAS[index]
        rango_dia_fin = RANGO_DIAS[index+1]
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
    saldo_cobro_mora_total  = 0
    simulacion_cobro_mora = 0
    for cuotas_real_con_cobranza in cuotas_reales_con_cargo_cobranza:
        pago_cobro_mora = cuotas_real_con_cobranza.cuota_cobro_mora
        saldo_cobro_mora = cuotas_real_con_cobranza.saldo_cobro_mora
        simulacion_cobro_mora_tmp = pago_cobro_mora + saldo_cobro_mora
        if simulacion_cobro_mora_tmp > simulacion_cobro_mora:
            simulacion_cobro_mora = simulacion_cobro_mora_tmp
        if pago_cobro_mora > 0 :
            pago_cobro_mora_total += pago_cobro_mora
        if saldo_cobro_mora > 0:
            saldo_cobro_mora_total = saldo_cobro_mora

    if pago_cobro_mora_total == 0:
        if saldo_cobro_mora_total > 0:
            datos = {"saldo_cobro_mora":saldo_cobro_mora_total, "is_rango_pagado":False, "is_rango_cobrado":True}
        elif saldo_cobro_mora_total == 0:
            datos_cobro_anterior = verificar_cobro_mora(cuota_supuesta_actual, index-1)
            saldo_cobro_mora_anterior = datos_cobro_anterior["saldo_cobro_mora"]
            saldo_cobro_mora_total += saldo_cobro_mora_anterior 
            datos = {"saldo_cobro_mora":saldo_cobro_mora_total, "is_rango_pagado": False, "is_rango_cobrado": False}
    else:
        # if cont_pago_cobro_mora >= cont_saldo_cobro_mora:
        #     print("entre aqui")
        #     datos = {"saldo_cobro_mora":0, "is_rango_pagado":True, "is_rango_cobrado":True}
        # else:
        #     datos = {"saldo_cobro_mora":saldo_cobro_mora_total, "is_rango_pagado":False, "is_rango_cobrado":True}
        if simulacion_cobro_mora == pago_cobro_mora_total:
            datos = {"saldo_cobro_mora":0, "is_rango_pagado":True, "is_rango_cobrado":True}
        else:
            datos = {"saldo_cobro_mora":saldo_cobro_mora_total, "is_rango_cobrado": True, "is_rango_pagado":False}
    return datos

def get_cuota_supuesta_actual(cuotas_supuestas):
    """ Extrae la cuota supuesta actual de una solicitud """
    next_cuota = None
    for i in range(cuotas_supuestas.count()):
        cuota = cuotas_supuestas[i]
        if cuota.estado == 1:
            next_cuota = cuotas_supuestas[i+1]
        else:
            next_cuota = cuota
            return next_cuota
    return next_cuota

# def crear_cuota_real_fecha_corte(solicitud):

def simular_pagos_reales(fecha_pago_real, solicitud):
    cuotas_supuestas = Cuotas_ta_supuesta.objects.filter(id_solicitud = solicitud).order_by("fecha")
    cuota_supuesta_actual = get_cuota_supuesta_actual(cuotas_supuestas)
    cuotas_reales = Cuotas_ta_real.objects.filter(id_cuota_ta_supuesta=cuota_supuesta_actual).order_by("-fecha")
    if cuotas_reales:
        """Ya existen pagos para esa cuota"""
        pagos_inversiones = simular_pago_real(fecha_pago_real, cuota_supuesta_actual)
    else:
        """ Primer pago para esa cuota """
        pagos_inversiones = simular_primer_pago_real(fecha_pago_real, cuota_supuesta_actual)

    return pagos_inversiones


def simular_cuota_real(fecha_pago_real, solicitud):
    """ Consultar el pago de una cuota """

    cuotas_supuestas = Cuotas_ta_supuesta.objects.filter(id_solicitud = solicitud).order_by("fecha")
    cuota_supuesta_actual = get_cuota_supuesta_actual(cuotas_supuestas)
    num_cuota = cuota_supuesta_actual.num_cuota
    fecha_cuota_supuesta = cuota_supuesta_actual.fecha
    dias_supuestos = cuota_supuesta_actual.dias_totales
    dias_mora = (fecha_pago_real - fecha_cuota_supuesta).days
    dias_totales = dias_mora + dias_supuestos
    cuotas_reales = Cuotas_ta_real.objects.filter(id_cuota_ta_supuesta=cuota_supuesta_actual).order_by("-fecha")
    if cuotas_reales:
        cuota_real_actual = cuotas_reales[0]
        capital_insoluto = cuota_real_actual.capital_insoluto
        capital = cuota_real_actual.saldo_capital
    else:
        capital_insoluto = cuota_supuesta_actual.capital_insoluto
        capital = cuota_supuesta_actual.capital
    datos_simulacion = simular_pagos_reales(fecha_pago_real, solicitud)
    intereses = sum(datos_simulacion['intereses_previos'])
    cuota = sum(datos_simulacion['pagos'])

    index = get_rango_dias_mora(dias_mora)
    datos_cobro_mora = verificar_cobro_mora(cuota_supuesta_actual, index)
    is_rango_cobrado = datos_cobro_mora["is_rango_cobrado"]
    if not is_rango_cobrado:
        cobro_mora = calcular_cobro_mora(dias_mora, cuota)
        cobro_mora += datos_cobro_mora["saldo_cobro_mora"]
    else:
        cobro_mora = datos_cobro_mora["saldo_cobro_mora"]
    cuota = cuota + cobro_mora


    intereses_mora = sum(datos_simulacion['intereses_mora'])
    diccionario = {"intereses": intereses,
                    "intereses_mora": intereses_mora,
                    "capital": capital,
                    "cuota": cuota,
                    "capital_insoluto": capital_insoluto,
                    "fecha_consulta":fecha_pago_real,
                    "cuota_supuesta": cuota_supuesta_actual,
                    "dias_mora": dias_mora,
                    "cobro_mora": cobro_mora}
    return diccionario

def pagar_cuota_real(monto, fecha_pago_real, solicitud, crear=False):
    # simular_cuota_real(fecha_pago_real, solicitud)
    datos_simulacion = simular_cuota_real(fecha_pago_real, solicitud)
    cuotas_supuestas = Cuotas_ta_supuesta.objects.filter(id_solicitud = solicitud).order_by("fecha")
    cuota_supuesta_actual = get_cuota_supuesta_actual(cuotas_supuestas)
    datos_simulacion_pagos_reales = simular_pagos_reales(fecha_pago_real, solicitud)
    pagos_reales = calcular_montos_inversion(monto, cuota_supuesta_actual, datos_simulacion_pagos_reales, fecha_pago_real, crear)
    cobro_mora = datos_simulacion['cobro_mora']
    if cobro_mora > 0:
        if monto > cobro_mora:
            pago_cobro_mora = cobro_mora
            saldo_cobro_mora = 0
            monto = monto - cobro_mora
        else:
            pago_cobro_mora = cobro_mora - monto
            monto = 0
    else:
        pago_cobro_mora = 0
        saldo_cobro_mora = 0

    pago_intereses_previos = 0
    saldo_intereses_previos = 0
    pago_capital = 0
    saldo_capital = 0
    pago_intereses_mora = 0
    saldo_intereses_mora = 0
    pago = 0
    saldo_capital_insoluto = 0


    for pago_real in pagos_reales:
        pago_intereses_previos += pago_real.pago_intereses_previos
        saldo_intereses_previos += pago_real.saldo_intereses_previos
        pago_capital += pago_real.pago_capital
        saldo_capital += pago_real.saldo_capital
        pago_intereses_mora += pago_real.pago_intereses_mora
        saldo_intereses_mora += pago_real.saldo_intereses_mora
        pago += pago_real.pago
        saldo_capital_insoluto += pago_real.capital_por_cobrar
        # print(pago_real.capital_por_cobrar)

    fecha_cuota_supuesta = cuota_supuesta_actual.fecha
    dias_mora = (fecha_pago_real - fecha_cuota_supuesta).days
    # print(saldo_capital_insoluto)

    saldo_cuota = datos_simulacion['cuota'] - monto
    datos_pago = {"pago_capital": pago_capital, "saldo_capital": saldo_capital, "pago_interes": pago_intereses_previos,
                    "saldo_interes":saldo_intereses_previos, "pago_interes_mora": pago_intereses_mora,
                    "saldo_interes_mora":saldo_intereses_mora,"saldo_capital_insoluto": saldo_capital_insoluto, "saldo_cuota": saldo_cuota,
                     "pago_cobro_mora":pago_cobro_mora, "saldo_cobro_mora":saldo_cobro_mora}
    # crear_cuota_real(datos_simulacion, datos_pago, monto)
    return datos_pago
    # datos_simulacion_cuotas_reales = simular_cuota_real(fecha_pago_real, solicitud)
    # print(datos_simulacion_cuotas_reales)
    # intereses_simulacion = datos_simulacion_cuotas_reales['intereses']

def crear_ta_supuesta_por_inversion(solicitud):
    monto_solicitud = float(solicitud.monto)
    plazo_solicitud = solicitud.plazo
    TASA_INTERES_ANUAL = float(solicitud.tin)
    start_date = solicitud.fecha_finalizacion
    temp_date = solicitud.fecha_finalizacion
    next_date = add_months(start_date, 1)

    dic = get_fechas_dias_ta(solicitud)
    dias = dic['dias']
    fechas = dic['fechas']

    plazo_dias = sum(dias)
    if (TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL / 100

    tasa_diaria = (1 + TASA_INTERES_ANUAL / 365) - 1
    base = 1 + tasa_diaria
    exponente = plazo_dias / plazo_solicitud
    tasa_mensual = math.pow(base, exponente) - 1
    cuota_mensual = npf.pmt(tasa_mensual, plazo_solicitud, monto_solicitud) * -1
    cuota_mensual = round(cuota_mensual, 2)
    capital_por_pagar_i = monto_solicitud

    for i in range(plazo_solicitud):
        fecha_i = fechas[i]
        dias_totales_i = dias[i + 1]
        pago_supuesto = Pagos_ta_supuesta.objects.filter(id_solicitud=solicitud.id, orden=i + 1)
        result_aggregation = pago_supuesto.aggregate(Sum('intereses_previos'))
        intereses_pagados_i = result_aggregation['intereses_previos__sum']
        intereses_pagados_i = round(intereses_pagados_i, 2)
        result_aggregation = pago_supuesto.aggregate(Sum('capital'))
        capital_i = result_aggregation['capital__sum']
        capital_i = round(capital_i, 2)
        result_aggregation = pago_supuesto.aggregate(Sum('pago'))
        cuota_i = result_aggregation['pago__sum']
        cuota_i = round(cuota_i, 2)
        new_cuota_supuesta = Cuotas_ta_supuesta(id_solicitud=solicitud, num_cuota=i + 1, fecha=fecha_i, cuota=cuota_i,
                                                capital=capital_i, intereses_pagados=intereses_pagados_i,
                                                capital_insoluto=capital_por_pagar_i,
                                                dias_totales=dias_totales_i)
        new_cuota_supuesta.save()
        capital_por_pagar_i -= capital_i
        capital_por_pagar_i = round(capital_por_pagar_i, 2)



    
def calcular_cobro_mora(dias_mora, pago):
    if dias_mora < 5:
        cobro = 0
    elif (dias_mora >= 5 and dias_mora <= 30):
        if pago < 100:
            cobro = lista_cobranza_1[0]
        elif pago < 200:
            cobro = lista_cobranza_1[1]
        elif pago < 300:
            cobro = lista_cobranza_1[2]
        elif pago < 500:
            cobro = lista_cobranza_1[3]
        elif pago < 1000:
            cobro = lista_cobranza_1[4]
        else:
            cobro = lista_cobranza_1[5]
    elif (dias_mora >= 31 and dias_mora <= 60):
        if pago < 100:
            cobro = lista_cobranza_2[0]
        elif pago < 200:
            cobro = lista_cobranza_2[1]
        elif pago < 300:
            cobro = lista_cobranza_2[2]
        elif pago < 500:
            cobro = lista_cobranza_2[3]
        elif pago < 1000:
            cobro = lista_cobranza_2[4]
        else:
            cobro = lista_cobranza_2[5]
    elif (dias_mora >= 61 and dias_mora <= 90):
        if pago < 100:
            cobro = lista_cobranza_3[0]
        elif pago < 200:
            cobro = lista_cobranza_3[1]
        elif pago < 300:
            cobro = lista_cobranza_3[2]
        elif pago < 500:
            cobro = lista_cobranza_3[3]
        elif pago < 1000:
            cobro = lista_cobranza_3[4]
        else:
            cobro = lista_cobranza_3[0]
    else:
        if pago < 100:
            cobro = lista_cobranza_4[0]
        elif pago < 200:
            cobro = lista_cobranza_4[1]
        elif pago < 300:
            cobro = lista_cobranza_4[2]
        elif pago < 500:
            cobro = lista_cobranza_4[3]
        elif pago < 1000:
            cobro = lista_cobranza_4[4]
        else:
            cobro = lista_cobranza_4[5]

    return cobro