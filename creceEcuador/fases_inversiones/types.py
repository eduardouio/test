import math
import calendar
from datetime import date, timedelta
"""Variables usadas en esta aplicacion"""
#keys en el request para la paginacion
INICIO_KEY = 'inicio'
CANTIDAD_KEY = 'cantidad'

#Valores por defecto para la paginacion
INICIO_DEFAULT = 0
CANTIDAD_DEFAULT = 10

#Mensaje de acuerdo al estado
MENSAJE_BAD_REQUEST = "Llamada incorrecta."

#key para fase_inversion
FASE_KEY = "fase_inversion"

FASES_INVERSION = {
    "pendientes": ["FILL_INFO", "PENDING_TRANSFER", "ORIGIN_MONEY", "TRANSFER_SUBMITED"],
    "por_fondear": ["TO_BE_FUND"],
    "vigentes": ["GOING"],
    "terminados": ["FINISHED"]
}

#key para id inversionista
INVERSIONISTA_KEY = "id_inversionista"


COMISION_ADJUDICACION_FACTOR = 0#0.007
ADJUDICACION_FACTOR = 0#1.12
COMISION_BANCO = 0.0#0.40
COMISION_COBRANZA_INSOLUTO_MENSUAL = 0#0.004
IVA = 0.12
COMISIONES_BANCARIAS = 0.22



def calcular_interes_n(capital_insoluto_anterior, sum_intereses_pagados_n , dias_totales, dias_mora, ted_supuesta):

	tasa_efectiva_diaria = calcular_recargo_tasa(dias_mora, ted_supuesta)
	base = 1 + tasa_efectiva_diaria
	interes_n = capital_insoluto_anterior * (math.pow(base,dias_totales) - 1) - sum_intereses_pagados_n
	return interes_n

def calcular_interes_mora_n(capital_insoluto_anterior, sum_intereses_mora_pagados_n, saldo_capital_anterior, saldo_interes_mora_anterior, dias_mora, ted_supuesta):
	interes_mora_n = 0
	if dias_mora <= 0:
		return interes_mora_n
	elif saldo_capital_anterior > 0:
		tasa_efectiva_diaria = calcular_recargo_tasa(dias_mora, ted_supuesta)
		base = 1 + tasa_efectiva_diaria
		interes_mora_n = capital_insoluto_anterior * (math.pow(base,dias_mora) - 1) - sum_intereses_mora_pagados_n
	else:
		interes_mora_n = saldo_interes_mora_anterior

	return interes_mora_n


def calcular_recargo_tasa(dias_mora, ted_supuesta):
	recargo = 0.1
	if dias_mora <= 3:
		recargo = 0
	elif dias_mora <= 15:
		recargo = 0.05
	elif dias_mora <= 30:
		recargo = 0.07
	elif dias_mora <= 60:
		recargo = 0.09

	tasa_efectiva_diaria = ted_supuesta * (1 + recargo)
	return tasa_efectiva_diaria

def get_fechas_dias_ta(solicitud):
    start_date = solicitud.fecha_finalizacion
    temp_date = solicitud.fecha_finalizacion
    next_date = add_months(start_date, 1)
    fechas=[]
    dias=[]
    plazo_solicitud = solicitud.plazo


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
    dic = {'dias':dias,
            'fechas':fechas}
    return dic

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