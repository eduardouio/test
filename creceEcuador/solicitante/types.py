import math

COMISION_ADJUDICACION_FACTOR = 0.007
ADJUDICACION_FACTOR = 1.12
COMISION_BANCO = 0.40
COMISION_COBRANZA_INSOLUTO_MENSUAL = 0.004
IVA = 0.12
COMISIONES_BANCARIAS = 0.22

lista_cobranza_1 = [4.38, 5.35, 5.92, 6.32, 6.63, 6.88]
lista_cobranza_2 = [14.23, 14.46, 15.83, 18.34, 21.99, 26.78]
lista_cobranza_3 = [21.17, 21.85, 23.27, 25.43, 28.34, 32.01]
lista_cobranza_4 = [23.56, 24.64, 27.03, 30.72, 35.70, 41.99]
RANGO_DIAS = [0, 4, 31, 61, 91]


def calcular_primera_cuota_real(solicitud, cuota_actual, fecha_pago_real):
    """Primera cuota con la cuota supuesta"""
    TASA_INTERES_ANUAL = float(solicitud.tin)
    if (TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL / 100
    tasa_efectiva_diaria = (1 + TASA_INTERES_ANUAL / 365) - 1

    capital_insoluto_anterior = cuota_actual.capital_insoluto + cuota_actual.capital
    sum_intereses_pagados_n = 0
    sum_intereses_mora_pagados_n = 0
    saldo_capital_anterior = cuota_actual.capital
    saldo_interes_mora_anterior = 0

    fecha_pago_supuesta = cuota_actual.fecha
    dias_supuestos = cuota_actual.dias_totales
    num_cuota = cuota_actual.num_cuota
    dias_mora = (fecha_pago_real - fecha_pago_supuesta).days
    dias_totales = dias_mora + dias_supuestos
    interes = calcular_interes_n(capital_insoluto_anterior, sum_intereses_pagados_n, dias_totales, dias_mora,
                                 tasa_efectiva_diaria)
    interes_mora = calcular_interes_mora_n(capital_insoluto_anterior, sum_intereses_pagados_n, saldo_capital_anterior,
                                           saldo_interes_mora_anterior, dias_mora, tasa_efectiva_diaria)
    return interes, interes_mora


def calcular_cuota_real(solicitud, cuota_supuesta_actual, cuota_real_actual, fecha_pago_real, dic_suma_intereses):
    """Cuotas creadas a partir de cuotas reales existentes"""
    TASA_INTERES_ANUAL = float(solicitud.tin)
    if (TASA_INTERES_ANUAL > 1):
        TASA_INTERES_ANUAL = TASA_INTERES_ANUAL / 100
    tasa_efectiva_diaria = (1 + TASA_INTERES_ANUAL / 365) - 1

    capital_insoluto_anterior = cuota_real_actual.capital_insoluto
    sum_intereses_pagados_n = dic_suma_intereses["suma_intereses"]
    sum_intereses_mora_pagados_n = dic_suma_intereses["suma_intereses_mora"]
    saldo_capital_anterior = cuota_real_actual.saldo_capital
    saldo_interes_mora_anterior = cuota_real_actual.saldo_intereses_mora
    saldo_interes_anterior = cuota_real_actual.saldo_intereses

    fecha_pago_supuesta = cuota_supuesta_actual.fecha
    dias_supuestos = cuota_supuesta_actual.dias_totales
    num_cuota = cuota_supuesta_actual.num_cuota
    dias_mora = (fecha_pago_real - fecha_pago_supuesta).days
    dias_totales = dias_mora + dias_supuestos
    interes = calcular_interes_n(capital_insoluto_anterior, sum_intereses_pagados_n, dias_totales, dias_mora,
                                 tasa_efectiva_diaria,
                                 saldo_intereses=saldo_interes_anterior)
    interes_mora = calcular_interes_mora_n(capital_insoluto_anterior, sum_intereses_mora_pagados_n,
                                           saldo_capital_anterior,
                                           saldo_interes_mora_anterior, dias_mora, tasa_efectiva_diaria)
    return interes, interes_mora


def pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora):
    cuota -= monto
    pago_interes_mora = 0
    saldo_interes_mora = 0
    pago_cobro_mora = 0
    if monto > interes:
        monto -= interes
        pago_interes = interes
        saldo_interes = 0
        if interes_mora > 0:
            if monto > interes_mora:
                monto -= interes_mora
                pago_interes_mora = interes_mora
                saldo_interes_mora = 0
                if cobro_mora > 0:
                    if monto >= cobro_mora:
                        monto -= cobro_mora
                        pago_cobro_mora = cobro_mora
                        saldo_cobro_mora = 0
                        pago_capital = capital if monto > capital else monto
                        saldo_capital = 0 if monto > capital else capital - monto
                        saldo_capital_insoluto = capital_insoluto - pago_capital
                    else:
                        pago_cobro_mora = monto
                        saldo_cobro_mora = cobro_mora - monto
                        pago_capital = 0
                        saldo_capital = capital
                        saldo_capital_insoluto = capital_insoluto
                else:
                    pago_capital = capital if monto > capital else monto
                    saldo_capital = 0 if monto > capital else capital - monto
                    saldo_capital_insoluto = capital_insoluto - pago_capital
                    saldo_cobro_mora = cobro_mora
            else:
                pago_interes_mora = monto
                saldo_interes_mora = interes_mora - monto
                pago_capital = 0
                saldo_capital = capital
                saldo_capital_insoluto = capital_insoluto
                saldo_cobro_mora = cobro_mora
        else:
            pago_capital = capital if monto > capital else monto
            saldo_capital = 0 if monto > capital else capital - monto
            saldo_capital_insoluto = capital_insoluto - pago_capital
            saldo_interes_mora = interes_mora
            saldo_cobro_mora = cobro_mora

    else:
        pago_interes = monto
        saldo_interes = interes - monto
        pago_capital = 0
        saldo_capital = capital
        saldo_capital_insoluto = capital_insoluto
        saldo_interes_mora = interes_mora
        saldo_cobro_mora = cobro_mora
    datos = {"pago_capital": pago_capital, "saldo_capital": saldo_capital, "pago_interes": pago_interes,
             "saldo_interes": saldo_interes, "saldo_capital_insoluto": saldo_capital_insoluto,
             "pago_interes_mora": pago_interes_mora,
             "saldo_interes_mora": saldo_interes_mora, "saldo_cuota": cuota, "pago_cobro_mora": pago_cobro_mora,
             "saldo_cobro_mora": saldo_cobro_mora}
    return datos


def calcular_interes_n(capital_insoluto_anterior, sum_intereses_pagados_n, dias_totales, dias_mora, ted_supuesta,
                       saldo_intereses=0):
    if dias_mora > 0:
        interes_n = saldo_intereses
    else:
        tasa_efectiva_diaria = calcular_recargo_tasa(dias_mora, ted_supuesta)
        base = 1 + tasa_efectiva_diaria
        interes_n = capital_insoluto_anterior * (math.pow(base, dias_totales) - 1) - sum_intereses_pagados_n
    return interes_n


def calcular_interes_mora_n(capital_insoluto_anterior, sum_intereses_mora_pagados_n, saldo_capital_anterior,
                            saldo_interes_mora_anterior, dias_mora, ted_supuesta):
    if dias_mora <= 0:
        return 0
    elif saldo_capital_anterior > 0:
        tasa_efectiva_diaria = calcular_recargo_tasa(dias_mora, ted_supuesta)
        base = 1 + tasa_efectiva_diaria
        interes_mora_n = capital_insoluto_anterior * (math.pow(base, dias_mora) - 1) - sum_intereses_mora_pagados_n
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


def calcular_cobro_mora(dias_mora, pago):
    if dias_mora < 4:
        cobro = 0
    elif (dias_mora >= 4 and dias_mora <= 30):
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