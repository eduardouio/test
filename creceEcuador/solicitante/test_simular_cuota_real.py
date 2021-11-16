import pytest
from creceEcuador.fixtures import *
from .models import crear_cuota_real
from .utils import simular_cuota_real, pagar_cuota_real
import datetime
from .types import COMISIONES_BANCARIAS

""" Test para tabla de amortizacion supuesta"""

def imprimir_cuota_real(cuota_real):
    print("Fecha \t \t Cuota\t \t Capital \t Intereses pagados \t Capital Insoluto \t Interes Mora")
    fecha_pago_real = cuota_real.fecha
    num_cuota = cuota_real.num_cuota
    pago = cuota_real.cuota
    saldo_capital = cuota_real.saldo_capital
    cuota_capital = cuota_real.cuota_capital
    cuota_intereses = cuota_real.cuota_intereses
    saldo_intereses = cuota_real.saldo_intereses
    dias_mora = cuota_real.dias_mora
    cuota_intereses_mora = cuota_real.cuota_intereses_mora
    saldo_intereses_mora = cuota_real.saldo_intereses_mora
    capital = saldo_capital + cuota_capital
    interes = saldo_intereses + cuota_intereses
    interes_mora = saldo_intereses_mora + cuota_intereses_mora
    capital_insoluto = cuota_real.capital_insoluto + cuota_capital
    cuota_total = capital + interes_mora + interes + COMISIONES_BANCARIAS
    str_notformat = "{fecha_i} \t {cuota:8.2f} \t {capital:8.2f} \t {intereses:8.2f} \t \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f}"
    str_format = str_notformat.format(fecha_i=fecha_pago_real, cuota=cuota_total, capital=capital,
                                        intereses=interes, capital_insoluto= capital_insoluto, interes_mora=interes_mora)
    print(str_format)
    str_notformat_pago = "PAGO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f}"
    str_format_pago = str_notformat_pago.format(cuota=pago, capital=cuota_capital, interes=cuota_intereses, 
                                                capital_insoluto=cuota_real.capital_insoluto, interes_mora=cuota_intereses_mora)
    print(str_format_pago)
    str_notformat_saldo = "SALDO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f}"
    str_format_saldo = str_notformat_saldo.format(cuota=cuota_total - pago, capital=saldo_capital, interes=saldo_intereses, 
                                                capital_insoluto=cuota_real.capital_insoluto, interes_mora=saldo_intereses_mora)
    print(str_format_saldo)


def imprimir_cuotas_reales(cuotas):
    for cuota_real in cuotas:
        imprimir_cuota_real(cuota_real)

@pytest.mark.django_db
def test_simular_cuota_real(crear_pagos_para_ta_supuesta_fixture, solicitud_prueba):
    fecha_pago_real = datetime.date(2020,11,7)
    diccionario = simular_cuota_real(fecha_pago_real, solicitud_prueba)
    fecha = diccionario['fecha_consulta']
    cuota = diccionario['cuota']
    capital = diccionario['capital']
    intereses = diccionario['intereses']
    intereses_mora = diccionario['intereses_mora']
    capital_insoluto = diccionario['capital_insoluto']
    cobro_mora = diccionario['cobro_mora']
    print("Fecha \t \t Cuota\t \t Capital \t Intereses \t Capital Insoluto \t Intereses mora \t Cobro Mora")
    str_notformat = "{fecha_i} \t {pago_i:8.2f} \t {capital_i:8.2f} \t {intereses_pagados_i:8.2f} \t {capital_insoluto_i:8.2f} \t \t {intereses_mora:8.2f} \t \t {cobro_mora:8.2f}"
    str_format = str_notformat.format(fecha_i=fecha, pago_i=cuota, capital_i=capital, intereses_pagados_i=intereses, capital_insoluto_i=capital_insoluto,
                                        intereses_mora=intereses_mora, cobro_mora =cobro_mora)
    print(str_format)
    monto = input("INGRESE MONTO A PAGAR: ")
    monto = float(monto)
    datos_pago = pagar_cuota_real(monto, fecha_pago_real, solicitud_prueba, True)
    pago_capital = datos_pago["pago_capital"]
    pago_interes = datos_pago["pago_interes"]
    capital_insoluto = datos_pago["saldo_capital_insoluto"]
    pago_interes_mora = datos_pago["pago_interes_mora"]
    pago_cobro_mora = datos_pago["pago_cobro_mora"]
    saldo_cobro_mora = datos_pago["saldo_cobro_mora"]
    str_notformat_pago = "PAGO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t \t {cobro_mora:8.2f}"
    str_format_pago = str_notformat_pago.format(cuota=monto, capital=pago_capital, interes=pago_interes, 
                                              capital_insoluto=capital_insoluto, interes_mora=pago_interes_mora,
                                              cobro_mora=pago_cobro_mora)
    print(str_format_pago)
    saldo_capital = datos_pago["saldo_capital"]
    saldo_interes = datos_pago["saldo_interes"]
    saldo_interes_mora = datos_pago["saldo_interes_mora"]
    str_notformat_saldo = "SALDO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t \t {cobro_mora:8.2f}"
    str_format_saldo = str_notformat_saldo.format(cuota=cuota-monto, capital=saldo_capital, interes=saldo_interes, 
                                              capital_insoluto=capital_insoluto, interes_mora=saldo_interes_mora,
                                              cobro_mora=saldo_cobro_mora)
    print(str_format_saldo)
    crear_cuota_real(diccionario, datos_pago, monto)

    entrada = "y"
    while entrada == "y":
        fecha = input("ingrese fecha: ")
        year = int(fecha.split("-")[0])
        month = int(fecha.split("-")[1])
        day = int(fecha.split("-")[2])
        fecha_pago_real = datetime.date(year,month,day)
        diccionario = simular_cuota_real(fecha_pago_real, solicitud_prueba)
        fecha = diccionario['fecha_consulta']
        cuota = diccionario['cuota']
        capital = diccionario['capital']
        intereses = diccionario['intereses']
        intereses_mora = diccionario['intereses_mora']
        capital_insoluto = diccionario['capital_insoluto']
        cobro_mora = diccionario['cobro_mora']
        print("Fecha \t \t Cuota\t \t Capital \t Intereses \t Capital Insoluto \t Intereses mora \t Cobro Mora")
        str_notformat = "{fecha_i} \t {pago_i:8.2f} \t {capital_i:8.2f} \t {intereses_pagados_i:8.2f} \t {capital_insoluto_i:8.2f} \t \t {intereses_mora:8.2f} \t \t {cobro_mora:8.2f}"
        str_format = str_notformat.format(fecha_i=fecha, pago_i=cuota, capital_i=capital, intereses_pagados_i=intereses, capital_insoluto_i=capital_insoluto,
                                            intereses_mora=intereses_mora, cobro_mora = cobro_mora)
        print(str_format)
        monto = input("INGRESE MONTO A PAGAR: ")
        monto = float(monto)
        datos_pago = pagar_cuota_real(monto, fecha_pago_real, solicitud_prueba, True)
        pago_capital = datos_pago["pago_capital"]
        pago_interes = datos_pago["pago_interes"]
        capital_insoluto = datos_pago["saldo_capital_insoluto"]
        pago_interes_mora = datos_pago["pago_interes_mora"]
        pago_cobro_mora = datos_pago["pago_cobro_mora"]
        saldo_cobro_mora = datos_pago["saldo_cobro_mora"]
        str_notformat_pago = "PAGO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t \t {cobro_mora:8.2f}"
        str_format_pago = str_notformat_pago.format(cuota=monto, capital=pago_capital, interes=pago_interes, 
                                                  capital_insoluto=capital_insoluto, interes_mora=pago_interes_mora,
                                                  cobro_mora=pago_cobro_mora)
        print(str_format_pago)
        saldo_capital = datos_pago["saldo_capital"]
        saldo_interes = datos_pago["saldo_interes"]
        saldo_interes_mora = datos_pago["saldo_interes_mora"]
        str_notformat_saldo = "SALDO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t \t {cobro_mora:8.2f}"
        str_format_saldo = str_notformat_saldo.format(cuota=cuota-monto, capital=saldo_capital, interes=saldo_interes, 
                                                  capital_insoluto=capital_insoluto, interes_mora=saldo_interes_mora,
                                                  cobro_mora=saldo_cobro_mora)
        print(str_format_saldo)
        crear_cuota_real(diccionario, datos_pago, monto)
        entrada = input("continuar y/n: ")

# @pytest.mark.django_db
# @pytest.fixture
# def crear_cuota_7_11_2020(solicitud_prueba):
#   fecha_pago_real = datetime.date(2020,11,7)
#   datos = simular_cuota_real(fecha_pago_real, solicitud_prueba)
#   monto = 100
#   capital = datos["capital"]
#   interes = datos["interes"]
#   interes_mora = datos["interes_mora"]
#   cuota = datos["cuota"]
#   capital_insoluto = datos["capital_insoluto"]
#   cobro_mora = datos["cobro_mora"]
#   datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora)
#   return crear_cuota_real(datos, datos_pago, monto)

# @pytest.mark.django_db
# @pytest.fixture
# def crear_cuota_23_11_2020(solicitud_prueba):
#   fecha_pago_real = datetime.date(2020,11,23)
#   datos = simular_cuota_real(fecha_pago_real, solicitud_prueba)
#   monto = 50
#   capital = datos["capital"]
#   interes = datos["interes"]
#   interes_mora = datos["interes_mora"]
#   cuota = datos["cuota"]
#   capital_insoluto = datos["capital_insoluto"]
#   cobro_mora = datos["cobro_mora"]
#   datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora)
#   return crear_cuota_real(datos, datos_pago, monto)

# @pytest.mark.django_db
# @pytest.fixture
# def crear_cuota_24_11_2020(solicitud_prueba):
#   fecha_pago_real = datetime.date(2020,11,24)
#   datos = simular_cuota_real(fecha_pago_real, solicitud_prueba)
#   monto = 150
#   capital = datos["capital"]
#   interes = datos["interes"]
#   interes_mora = datos["interes_mora"]
#   cuota = datos["cuota"]
#   capital_insoluto = datos["capital_insoluto"]
#   cobro_mora = datos["cobro_mora"]
#   datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora)
#   return crear_cuota_real(datos, datos_pago, monto)

# @pytest.mark.django_db
# @pytest.fixture
# def crear_cuota_1_12_2020(solicitud_prueba):
#   fecha_pago_real = datetime.date(2020,12,1)
#   datos = simular_cuota_real(fecha_pago_real, solicitud_prueba)
#   monto = 100
#   capital = datos["capital"]
#   interes = datos["interes"]
#   interes_mora = datos["interes_mora"]
#   cuota = datos["cuota"]
#   capital_insoluto = datos["capital_insoluto"]
#   cobro_mora = datos["cobro_mora"]
#   datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora)
#   return crear_cuota_real(datos, datos_pago, monto)

# @pytest.mark.django_db
# @pytest.fixture
# def crear_cuota_21_12_2020(solicitud_prueba):
#   fecha_pago_real = datetime.date(2020,12,21)
#   datos = simular_cuota_real(fecha_pago_real, solicitud_prueba)
#   monto = 400
#   capital = datos["capital"]
#   interes = datos["interes"]
#   interes_mora = datos["interes_mora"]
#   cuota = datos["cuota"]
#   capital_insoluto = datos["capital_insoluto"]
#   cobro_mora = datos["cobro_mora"]
#   datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora)
#   return crear_cuota_real(datos, datos_pago, monto)

# @pytest.mark.django_db
# @pytest.fixture
# def crear_cuota_fecha_corte(solicitud_prueba):
#   cuota = crear_cuota_real_fecha_corte(solicitud_prueba)
#   imprimir_cuota_real(cuota)


# @pytest.mark.django_db
# def test_simular_pago_cuota_real_1(crear_cuota_7_11_2020, crear_cuota_23_11_2020, crear_cuota_24_11_2020,
#                                   crear_cuota_1_12_2020, crear_cuota_21_12_2020, cuotas_ta_supuesta):
#   cuotas = []
#   cuota = crear_cuota_7_11_2020
#   cuota2 = crear_cuota_23_11_2020
#   cuota3 = crear_cuota_24_11_2020
#   cuota4 = crear_cuota_1_12_2020
#   cuota5 = crear_cuota_21_12_2020
#   cuotas.append(cuota)
#   cuotas.append(cuota2)
#   cuotas.append(cuota3)
#   cuotas.append(cuota4)
#   cuotas.append(cuota5)
#   imprimir_cuotas_reales(cuotas)
#   print(cuotas_ta_supuesta)

# @pytest.mark.django_db
# def test_simular_pago_cuota_real_fecha_corte(solicitud_prueba):
# 	cuota = crear_cuota_real_fecha_corte(solicitud_prueba)
# 	imprimir_cuota_real(cuota)

# @pytest.mark.django_db
# def test_simular_pago_cuota_real_anticipado(solicitud_prueba):
#   entrada = "y"
#   # crear_cuota_real_fecha_corte(solicitud_prueba)
#   while entrada == "y":
#       fecha = input("ingrese fecha: ")
#       year = int(fecha.split("-")[0])
#       month = int(fecha.split("-")[1])
#       day = int(fecha.split("-")[2])
#       fecha_pago_real = datetime.date(year,month,day)
#       datos = simular_cuota_real(fecha_pago_real, solicitud_prueba)
#       capital = datos["capital"]
#       interes = datos["interes"]
#       interes_mora = datos["interes_mora"]
#       cuota = datos["cuota"]
#       capital_insoluto = datos["capital_insoluto"]
#       cobro_mora = datos["cobro_mora"]
#       print("Fecha \t \t Cuota\t \t Capital \t Intereses pagados \t Capital Insoluto \t Interes Mora \t Cobro Mora")
#       str_notformat = "{fecha_i} \t {cuota:8.2f} \t {capital:8.2f} \t {intereses:8.2f} \t \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t {cobro_mora:8.2f}"
#       str_format = str_notformat.format(fecha_i=fecha_pago_real, cuota=cuota, capital=capital,
#                                           intereses=interes, capital_insoluto= capital_insoluto, interes_mora=interes_mora,
#                                           cobro_mora=cobro_mora)
#       print(str_format)
#       monto = input("INGRESE MONTO A PAGAR: ")
#       monto = float(monto)
#       datos_pago = pagar_cuota_real(monto, capital, cuota, interes, capital_insoluto, interes_mora, cobro_mora)
#       pago_capital = datos_pago["pago_capital"]
#       pago_interes = datos_pago["pago_interes"]
#       capital_insoluto = datos_pago["saldo_capital_insoluto"]
#       pago_interes_mora = datos_pago["pago_interes_mora"]
#       pago_cobro_mora = datos_pago["pago_cobro_mora"]
#       saldo_cobro_mora = datos_pago["saldo_cobro_mora"]
#       str_notformat_pago = "PAGO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t {cobro_mora:8.2f}"
#       str_format_pago = str_notformat_pago.format(cuota=monto, capital=pago_capital, interes=pago_interes,
#                                                   capital_insoluto=capital_insoluto, interes_mora=pago_interes_mora,
#                                                   cobro_mora=pago_cobro_mora)
#       print(str_format_pago)
#       saldo_capital = datos_pago["saldo_capital"]
#       saldo_interes = datos_pago["saldo_interes"]
#       saldo_interes_mora = datos_pago["saldo_interes_mora"]
#       str_notformat_saldo = "SALDO \t \t {cuota:8.2f} \t {capital:8.2f} \t {interes:8.2f} \t \t {capital_insoluto:8.2f} \t \t {interes_mora:8.2f} \t {cobro_mora:8.2f}"
#       str_format_saldo = str_notformat_saldo.format(cuota=cuota-monto, capital=saldo_capital, interes=saldo_interes,
#                                                   capital_insoluto=capital_insoluto, interes_mora=saldo_interes_mora,
#                                                   cobro_mora=saldo_cobro_mora)
#       print(str_format_saldo)
#       crear_cuota_real(datos, datos_pago, monto)
#       entrada = input("continuar y/n: ")

# @pytest.mark.django_db
# def test_calcular_cobro_mora(solicitud_prueba):
#   cobro = calcular_cobro_mora(100, 750)
#   print(cobro)
