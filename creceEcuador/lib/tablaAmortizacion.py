from django.db.models import Sum

from solicitante.models import Cuotas_ta_supuesta
from fases_inversiones.models import Pagos_ta_supuesta
from creceEcuador.constants import COMISIONES_BANCARIAS
import calendar
from datetime import date, timedelta
import math
import numpy_financial as npf

def add_months(sourcedate, months):
    month = sourcedate.month - 1 + months
    year = sourcedate.year + month // 12
    month = month % 12 + 1
    day = sourcedate.day
    try:
        new_date = date(year, month, day)
    except Exception as e:
        day = day % calendar.monthrange(year, month)[1]
        new_date = date(year, month + 1, day)
    return new_date

def get_fechas_dias_ta(solicitud):
    start_date = solicitud.fecha_finalizacion
    temp_date = solicitud.fecha_finalizacion
    next_date = add_months(start_date, 1)
    fechas = []
    dias = []
    plazo_solicitud = solicitud.plazo

    dias_transcurridos = abs((start_date - start_date).days)
    dias.append(dias_transcurridos)

    for i in range(plazo_solicitud):
        if (next_date.weekday() == 6):  # domingo
            next_date = next_date + timedelta(days=1)

            dias_transcurridos = abs((next_date - temp_date).days)
            temp_date = date(next_date.year, next_date.month, next_date.day)
            next_date = next_date + timedelta(days=-1)
        elif (next_date.weekday() == 5):  # sabado
            next_date = next_date + timedelta(days=2)
            dias_transcurridos = abs((next_date - temp_date).days)
            temp_date = date(next_date.year, next_date.month, next_date.day)
            next_date = next_date + timedelta(days=-2)
        else:
            dias_transcurridos = abs((next_date - temp_date).days)
            temp_date = date(next_date.year, next_date.month, next_date.day)
        dias.append(dias_transcurridos)
        next_date = add_months(start_date, i + 2)
        fechas.append(temp_date)
    dic = {'dias': dias,
           'fechas': fechas}
    return dic


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


def crear_tabla_amortizacion(solicitud, modo):
    monto_solicitud = float(solicitud.monto)
    plazo_solicitud = solicitud.plazo
    TASA_INTERES_ANUAL = float(solicitud.tin)
    start_date = solicitud.fecha_finalizacion
    temp_date = solicitud.fecha_finalizacion
    if (modo != "PAGO"):
        start_date = solicitud.fecha_publicacion
        temp_date = solicitud.fecha_publicacion
    next_date = add_months(start_date, 1)
    fechas = []
    dias = []

    dias_transcurridos = abs((start_date - start_date).days)
    dias.append(dias_transcurridos)

    for i in range(plazo_solicitud):
        if (next_date.weekday() == 6):  # domingo
            next_date = next_date + timedelta(days=1)

            dias_transcurridos = abs((next_date - temp_date).days)
            temp_date = date(next_date.year, next_date.month, next_date.day)
            next_date = next_date + timedelta(days=-1)
        elif (next_date.weekday() == 5):  # sabado
            next_date = next_date + timedelta(days=2)
            dias_transcurridos = abs((next_date - temp_date).days)
            temp_date = date(next_date.year, next_date.month, next_date.day)
            next_date = next_date + timedelta(days=-2)
        else:
            dias_transcurridos = abs((next_date - temp_date).days)
            temp_date = date(next_date.year, next_date.month, next_date.day)
        dias.append(dias_transcurridos)
        next_date = add_months(start_date, i + 2)
        fechas.append(temp_date)

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
    pago_i = cuota_mensual + COMISIONES_BANCARIAS
    MONTO_SOLICITANTE = monto_solicitud
    capital_TOTAL = 0
    pago_TOTAL = 0
    intereses_TOTAL = 0

    lista_capital_insoluto = [monto_solicitud]
    lista_pagos = []
    lista_intereses_pagados = []
    lista_capitales = []

    for i in range(plazo_solicitud):
        dias_transcurridos = dias[i + 1]
        base = 1 + tasa_diaria
        tasa_mensual = math.pow(base, dias_transcurridos) - 1
        intereses_pagados_i = capital_por_pagar_i * tasa_mensual
        intereses_pagados_i = round(intereses_pagados_i, 2)

        intereses_TOTAL += intereses_pagados_i
        lista_intereses_pagados.append(intereses_pagados_i)
        capital_i = cuota_mensual - intereses_pagados_i

        if (i == plazo_solicitud - 1):
            capital_i = MONTO_SOLICITANTE - capital_TOTAL
            pago_i = capital_i + intereses_pagados_i + COMISIONES_BANCARIAS
        capital_TOTAL += capital_i
        lista_capitales.append(capital_i)

        lista_pagos.append(pago_i)
        pago_TOTAL += pago_i

        capital_por_pagar_i = capital_por_pagar_i - capital_i
        lista_capital_insoluto.append(capital_por_pagar_i)

    diccionario = {'lista_pagos': lista_pagos,
                   'lista_capital_insoluto': lista_capital_insoluto,
                   'lista_intereses_pagados': lista_intereses_pagados,
                   'lista_capitales': lista_capitales,
                   'dias': dias,
                   'fechas': fechas}

    return diccionario