
from creceEcuador.fixtures import *
from .models import Cuotas_ta_supuesta
from fases_inversiones.models import Inversion, crear_pagos, Pago_detalle, crear_pagos_para_ta_supuesta, \
    Pagos_ta_supuesta
import datetime

""" Test para tabla de amortizacion supuesta"""


@pytest.mark.django_db
def test_imprimir_tablas_inversiones(crear_inversiones, solicitud_prueba):
    for inversion in crear_inversiones:
        print("Monto Inversion:", inversion.monto)
        dic = crear_pagos_para_ta_supuesta(inversion, solicitud_prueba)
        monto_inversion = inversion.monto
        plazo = solicitud_prueba.plazo
        lista_capital_por_cobrar = dic['lista_capital_por_cobrar']
        lista_capitales = dic['lista_capitales']
        lista_intereses_previos = dic['lista_intereses_previos']
        lista_intereses_mostrar = dic['lista_intereses_mostrar']
        lista_cargo_por_cobranzas = dic['lista_cargo_por_cobranzas']
        lista_cuotas = dic['lista_cuotas']
        str_notformat = "Cuota \t \t Capital \t Intereses Mostrar \t Cargos cobranza \t  Capital recuperado \t Capital por cobrar \t Intereses Previos"
        print(str_notformat)
        for i in range(plazo):
            cuota_i = lista_cuotas[i + 1]
            capital_i = lista_capitales[i + 1]
            interes_mostrar_i = lista_intereses_mostrar[i + 1]
            cargo_cobranza_i = lista_cargo_por_cobranzas[i + 1]
            capital_por_cobrar_i = lista_capital_por_cobrar[i + 1]
            capital_recuperado_i = monto_inversion - capital_por_cobrar_i
            interes_previo_i = lista_intereses_previos[i + 1]
            str_notformat = "{cuota_i:8.2f} \t {capital_i:8.2f} \t \t {interes_mostrar_i:8.2f} \t {cargo_cobranza_i:8.2f} \t \t {capital_recuperado_i:8.2f} \t \t {capital_por_cobrar_i:8.2f} \t \t {interes_previo_i:8.2f}"
            str_format = str_notformat.format(cuota_i=cuota_i, capital_i=capital_i, interes_mostrar_i=interes_mostrar_i,
                                              cargo_cobranza_i=cargo_cobranza_i,
                                              capital_recuperado_i=capital_recuperado_i,
                                              capital_por_cobrar_i=capital_por_cobrar_i,
                                              interes_previo_i=interes_previo_i)
            print(str_format)

        capital_total = sum(lista_capitales)
        interes_mostrar_total = sum(lista_intereses_mostrar)
        cargo_cobranza_total = sum(lista_cargo_por_cobranzas)
        intereses_previos_total = sum(lista_intereses_previos)

        str_notformat = "TOTAL \t \t {capital_total:8.2f} \t \t {interes_mostrar_total:8.2f} \t {cargo_cobranza_total:8.2f} \t \t \t \t \t \t \t \t {interes_previo_total:8.2f}"
        str_format = str_notformat.format(capital_total=capital_total, interes_mostrar_total=interes_mostrar_total,
                                          cargo_cobranza_total=cargo_cobranza_total,
                                          interes_previo_total=intereses_previos_total)
        print(str_format)


@pytest.mark.django_db
def test_imprimir_ta_supuesta(solicitud_prueba, crear_pagos_para_ta_supuesta_fixture):
    print(solicitud_prueba)
    print("TABLA DE AMORTIZACION SUPUESTA")
    print("Monto:", solicitud_prueba.monto)
    print("TIN:", solicitud_prueba.tin)
    print("PLAZO:", solicitud_prueba.plazo)
    print("Fecha inicio:", solicitud_prueba.fecha_finalizacion)
    total_inversiones = Inversion.objects.filter(id_solicitud=solicitud_prueba.id).count()
    print("Total inversiones para la solicitud:", total_inversiones)
    cuotas_solicitante = Cuotas_ta_supuesta.objects.filter(id_solicitud=solicitud_prueba.id)
    plazo = solicitud_prueba.plazo

    print("Fecha \t \t Cuota\t \t Capital \t Intereses pagados \t Capital Insoluto")
    cuota_total = 0
    capital_total = 0
    intereses_pagados_total = 0
    for cuota_supuesta in cuotas_solicitante:
        fecha_i = cuota_supuesta.fecha
        cuota_i = cuota_supuesta.cuota
        intereses_pagados_i = cuota_supuesta.intereses_pagados
        capital_insoluto_i = cuota_supuesta.capital_insoluto
        capital_i = cuota_supuesta.capital
        str_notformat = "{fecha_i} \t {pago_i:8.2f} \t {capital_i:8.2f} \t {intereses_pagados_i:8.2f} \t \t {capital_insoluto_i:8.2f}"
        str_format = str_notformat.format(fecha_i=fecha_i, pago_i=cuota_i, capital_i=capital_i,
                                          intereses_pagados_i=intereses_pagados_i,
                                          capital_insoluto_i=capital_insoluto_i)
        print(str_format)

        cuota_total += cuota_i
        capital_total += capital_i
        intereses_pagados_total += intereses_pagados_i

@pytest.mark.django_db
def test_imprimir_ta_supuesta(solicitud_prueba, crear_pagos_para_ta_supuesta_fixture):
    print(solicitud_prueba)
    print("TABLA DE AMORTIZACION SUPUESTA")
    print("Monto:", solicitud_prueba.monto)
    print("TIN:", solicitud_prueba.tin)
    print("PLAZO:", solicitud_prueba.plazo)
    print("Fecha inicio:", solicitud_prueba.fecha_finalizacion)
    total_inversiones = Inversion.objects.filter(id_solicitud=solicitud_prueba.id).count()
    print("Total inversiones para la solicitud:", total_inversiones)
    cuotas_solicitante = Cuotas_ta_supuesta.objects.filter(id_solicitud=solicitud_prueba.id)
    plazo = solicitud_prueba.plazo

    print("Fecha \t \t Cuota\t \t Capital \t Intereses pagados \t Capital Insoluto")
    cuota_total = 0
    capital_total = 0
    intereses_pagados_total = 0
    for cuota_supuesta in cuotas_solicitante:
        fecha_i = cuota_supuesta.fecha
        cuota_i = cuota_supuesta.cuota
        intereses_pagados_i = cuota_supuesta.intereses_pagados
        capital_insoluto_i = cuota_supuesta.capital_insoluto
        capital_i = cuota_supuesta.capital
        str_notformat = "{fecha_i} \t {pago_i:8.2f} \t {capital_i:8.2f} \t {intereses_pagados_i:8.2f} \t \t {capital_insoluto_i:8.2f}"
        str_format = str_notformat.format(fecha_i=fecha_i, pago_i=cuota_i, capital_i=capital_i,
                                          intereses_pagados_i=intereses_pagados_i,
                                          capital_insoluto_i=capital_insoluto_i)
        print(str_format)

        cuota_total += cuota_i
        capital_total += capital_i
        intereses_pagados_total += intereses_pagados_i

    str_notformat = "TOTAL \t \t {pago_total:8.2f} \t {capital_total:8.2f} \t {interes_pagados_total:8.2f}"
    str_format = str_notformat.format(pago_total=cuota_total, capital_total=capital_total,
                                      interes_pagados_total=intereses_pagados_total)
    print(str_format)