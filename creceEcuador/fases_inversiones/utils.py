""" Utilities """
from datetime import timedelta, date

from django.db.models import Sum

from solicitante.models import Cuotas_ta_supuesta
from .models import Pagos_ta_supuesta, Pagos_ta_real, add_months
import math
import numpy_financial as npf

def calcular_interes_previo(capital_por_cobrar, sum_intereses_pagados_n , dias_totales, dias_mora, ted_supuesta,fecha_ultimo_pago=0, saldo_intereses=0): 
    if dias_mora > 0:
        interes_n = saldo_intereses
    else:
        tasa_efectiva_diaria = calcular_recargo_tasa(dias_mora, ted_supuesta)
        base = 1 + tasa_efectiva_diaria
        factor_intereses = math.pow(base,dias_totales)
        factor_intereses_pagados = math.pow(base,fecha_ultimo_pago)
        interes_n = capital_por_cobrar * ((factor_intereses - 1) - (factor_intereses_pagados - 1))
    return interes_n

def calcular_interes_mora(capital_por_cobrar, sum_intereses_mora_pagados_n, saldo_capital_anterior, saldo_interes_mora_anterior, dias_mora, ted_supuesta):
    if dias_mora <= 0:
        return 0
    elif saldo_capital_anterior > 0:
        tasa_efectiva_diaria = calcular_recargo_tasa(dias_mora, ted_supuesta)
        base = 1 + tasa_efectiva_diaria
        interes_mora_n = capital_por_cobrar * (math.pow(base,dias_mora) - 1)
    else:
        interes_mora_n = saldo_interes_mora_anterior
    return interes_mora_n

def calcular_recargo_tasa(dias_mora, ted_supuesta):
    if dias_mora <= 3:
        recargo = 0
    elif dias_mora <= 15:
        recargo = 0.05
    elif dias_mora <= 30:
        recargo = 0.07
    elif dias_mora <= 60:
        recargo = 0.09
    else:
        recargo = 0.1
    
    tasa_efectiva_diaria = ted_supuesta * (1 + recargo)
    return tasa_efectiva_diaria

def get_suma_intereses(pagos_reales):
    suma_intereses = 0
    suma_intereses_mora = 0
    for pago_real in pagos_reales:
        suma_intereses += pago_real.pago_intereses_previos
        suma_intereses_mora += pago_real.pago_intereses_mora
    return suma_intereses, suma_intereses_mora

def simular_primer_pago_real(fecha_pago_real, cuota_ta_supuesta):
    orden = cuota_ta_supuesta.num_cuota
    solicitud = cuota_ta_supuesta.id_solicitud
    pagos_ta_supuestos = Pagos_ta_supuesta.objects.filter(orden = orden, id_solicitud = solicitud)
    TASA_INTERES_ANUAL = float(solicitud.tin)
    if( TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100
    tasa_efectiva_diaria = (1+TASA_INTERES_ANUAL/365)-1



    intereses_previos = []
    intereses_mora = []
    pagos = []

    for pago_supuesto in pagos_ta_supuestos:
        capital_por_cobrar = pago_supuesto.capital_por_cobrar
        capital = pago_supuesto.capital
        capital_por_cobrar_anterior = capital + capital_por_cobrar
        sum_intereses_pagados_n = 0
        sum_intereses_mora_pagados_n = 0
        saldo_interes_mora_anterior = 0

        fecha_pago_supuesta = cuota_ta_supuesta.fecha
        dias_supuestos = cuota_ta_supuesta.dias_totales
        dias_mora = (fecha_pago_real - fecha_pago_supuesta).days
        dias_totales = dias_mora + dias_supuestos

        interes_previo = calcular_interes_previo(capital_por_cobrar_anterior, sum_intereses_pagados_n, dias_totales, dias_mora, tasa_efectiva_diaria)
        interes_previo = round(interes_previo, 2)
        # interes_mora = calcular_interes_mora(capital_por_cobrar_anterior, sum_intereses_pagados_n, saldo_capital_anterior, 
        #                                   saldo_interes_mora_anterior, dias_mora, tasa_efectiva_diaria)
        # interes_mora = round(interes_mora, 2)
        pago = capital + interes_previo
        pago = round(pago, 2)

        intereses_previos.append(interes_previo)
        intereses_mora.append(0)
        pagos.append(pago)

    pagos_inversiones = {"intereses_previos": intereses_previos,
                        "pagos": pagos,
                        "intereses_mora": intereses_mora}

    return pagos_inversiones

def simular_pago_real(fecha_pago_real, cuota_ta_supuesta):
    orden = cuota_ta_supuesta.num_cuota
    solicitud = cuota_ta_supuesta.id_solicitud
    TASA_INTERES_ANUAL = float(solicitud.tin)
    if( TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100
    tasa_efectiva_diaria = (1+TASA_INTERES_ANUAL/365)- 1


    fecha_pago_supuesta = cuota_ta_supuesta.fecha
    anterior_fecha_pago_supuesta = add_months(fecha_pago_supuesta, -1)
    dias_supuestos = cuota_ta_supuesta.dias_totales
    num_cuota = cuota_ta_supuesta.num_cuota
    dias_mora = (fecha_pago_real - fecha_pago_supuesta).days
    dias_totales = dias_mora + dias_supuestos

    pagos_ta_supuestos = Pagos_ta_supuesta.objects.filter(orden = orden, id_solicitud = solicitud)



    intereses_previos = []
    intereses_mora = []
    pagos = []


    for pago_supuesto in pagos_ta_supuestos:

        pagos_reales = Pagos_ta_real.objects.filter(id_pago_ta_supuesta=pago_supuesto)
        suma_intereses, suma_intereses_mora = get_suma_intereses(pagos_reales)
        pago_real_actual = pagos_reales.last()
        fecha_ultimo_pago = (pago_real_actual.fecha - anterior_fecha_pago_supuesta).days
        capital_por_cobrar_anterior = pago_real_actual.capital_por_cobrar
        # print(capital_por_cobrar_anterior)
        saldo_capital_anterior = pago_real_actual.saldo_capital
        saldo_interes_anterior = pago_real_actual.saldo_intereses_previos
        saldo_interes_mora_anterior = pago_real_actual.saldo_intereses_mora


        interes_previo = calcular_interes_previo(capital_por_cobrar_anterior,
                                                 suma_intereses, dias_totales, dias_mora, tasa_efectiva_diaria,
                                                 fecha_ultimo_pago, saldo_intereses=saldo_interes_anterior)
        interes_mora = calcular_interes_mora(saldo_capital_anterior, suma_intereses_mora, saldo_capital_anterior, 
                                                saldo_interes_mora_anterior, dias_mora, tasa_efectiva_diaria)

        pago = saldo_capital_anterior + interes_previo + interes_mora
        pago = round(pago, 2)
        interes_previo = round(interes_previo,2)
        interes_mora = round(interes_mora, 2)

        intereses_previos.append(interes_previo)
        intereses_mora.append(interes_mora)
        pagos.append(pago)

    pagos_inversiones = {"intereses_previos": intereses_previos,
                        "pagos": pagos,
                        "intereses_mora": intereses_mora}

    return pagos_inversiones



def crear_pago_ta_real(pago_supuesto, datos_pago_real, num_pago, fecha_pago_real, crear=False):
    pago_capital = datos_pago_real['pago_capital']
    saldo_capital = datos_pago_real['saldo_capital']
    pago_interes_previo = datos_pago_real['pago_interes_previo']
    saldo_interes_previo = datos_pago_real['saldo_interes_previo']
    capital_por_cobrar = datos_pago_real['saldo_capital_por_cobrar']
    pago_interes_mora = datos_pago_real['pago_interes_mora']
    saldo_interes_mora = datos_pago_real['saldo_interes_mora']
    pago = datos_pago_real['pago']
    # print(capital_por_cobrar)
    new_pago_real = Pagos_ta_real(id_pago_ta_supuesta=pago_supuesto, num_pago=num_pago, fecha=fecha_pago_real, pago=pago, pago_capital=pago_capital,
                                    saldo_capital=saldo_capital, pago_intereses_previos=pago_interes_previo, saldo_intereses_previos=saldo_interes_previo,
                                    pago_intereses_mora=pago_interes_mora, saldo_intereses_mora=saldo_interes_mora, capital_por_cobrar=capital_por_cobrar,
                                    estado=1)
    if crear:
        new_pago_real.save()

    return new_pago_real


def calcular_pago_real(monto, capital, pago, interes_previo, capital_por_cobrar, interes_mora):
    pago_interes_mora = 0
    saldo_interes_mora = 0
    if monto > interes_previo:
        monto -= interes_previo
        pago_interes_previo = interes_previo
        saldo_interes_previo = 0
        if interes_mora > 0:
            if monto > interes_mora:
                monto -= interes_mora
                pago_interes_mora = interes_mora
                saldo_interes_mora = 0
                pago_capital = capital if monto > capital else monto
                saldo_capital = 0 if monto > capital else capital - monto
                saldo_capital_por_cobrar = capital_por_cobrar - pago_capital
            else:
                pago_interes_mora = monto
                saldo_interes_mora = interes_mora - monto
                pago_capital = 0
                saldo_capital = capital
                saldo_capital_por_cobrar = capital_por_cobrar
        else:
            pago_capital = capital if monto > capital else monto
            saldo_capital = 0 if monto > capital else capital - monto
            saldo_capital_por_cobrar = capital_por_cobrar - pago_capital
    else:
        pago_interes_previo = monto
        saldo_interes_previo = interes_previo - monto
        pago_capital = 0
        saldo_capital = capital
        saldo_capital_por_cobrar = capital_por_cobrar
        saldo_interes_mora = interes_mora

    datos = {"pago_capital": pago_capital, "saldo_capital":saldo_capital, "pago_interes_previo":pago_interes_previo,
            "saldo_interes_previo": saldo_interes_previo, "saldo_capital_por_cobrar": saldo_capital_por_cobrar, "pago_interes_mora":pago_interes_mora,
            "saldo_interes_mora":saldo_interes_mora, "pago":monto}
    return datos


def calcular_montos_inversion(monto,
                              cuota_ta_supuesta,
                              datos_simulacion_pagos_reales,
                              fecha_pago_real, crear=False) -> list:
    orden = cuota_ta_supuesta.num_cuota
    solicitud = cuota_ta_supuesta.id_solicitud
    monto_solicitud = float(solicitud.monto)
    pagos_ta_supuestos = Pagos_ta_supuesta.objects.filter(orden = orden, id_solicitud = solicitud)
    TASA_INTERES_ANUAL = float(solicitud.tin)
    if( TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100
    tasa_efectiva_diaria = (1+TASA_INTERES_ANUAL/365)-1

    intereses_previos = datos_simulacion_pagos_reales['intereses_previos']
    pagos = datos_simulacion_pagos_reales['pagos']
    intereses_mora = datos_simulacion_pagos_reales['intereses_mora']
    suma_total = 0


    pagos_reales_lista = []

    for idx, pago_supuesto in enumerate(pagos_ta_supuestos):
        inversion = pago_supuesto.id_inversion
        monto_inversion = inversion.monto
        participacion_inversionista = monto_inversion / monto_solicitud
        monto_de_pago = monto * participacion_inversionista
        if idx == (len(pagos_ta_supuestos) - 1):
            monto_de_pago = monto - suma_total
        monto_de_pago = round(monto_de_pago,2)
        suma_total += monto_de_pago
        
        interes_previo = intereses_previos[idx]
        pago = pagos[idx]
        interes_mora = intereses_mora[idx]
        pagos_reales = Pagos_ta_real.objects.filter(id_pago_ta_supuesta=pago_supuesto).order_by("-fecha")
        if pagos_reales:
            pago_real_actual = pagos_reales[0]
            capital_por_cobrar = pago_real_actual.capital_por_cobrar
            capital = pago_real_actual.saldo_capital
            capital_por_cobrar_anterior = capital_por_cobrar
        else:
            capital_por_cobrar = pago_supuesto.capital_por_cobrar
            capital = pago_supuesto.capital
            capital_por_cobrar_anterior = capital + capital_por_cobrar
        # print(capital_por_cobrar_anterior)

        datos_pagos_reales = calcular_pago_real(monto_de_pago, capital, pago, interes_previo, capital_por_cobrar_anterior, interes_mora)
        num_pago = Pagos_ta_real.objects.filter(id_pago_ta_supuesta= pago_supuesto).count() + 1
        new_pago_real = crear_pago_ta_real(pago_supuesto, datos_pagos_reales, orden, fecha_pago_real, crear)
        pagos_reales_lista.append(new_pago_real)

    return pagos_reales_lista
