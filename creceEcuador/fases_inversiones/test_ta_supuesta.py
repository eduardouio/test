import pytest
from solicitudes.models import Solicitud, CategoriaSolicitud, TipoCredito
from registro_inversionista.models import Usuario, Canton
from django.contrib.auth.models import User
from .models import crear_tabla_amortizacion, Inversion, crear_pagos, Pago_detalle
import datetime

""" Test para tabla de amortizacion supuesta"""

@pytest.mark.django_db
@pytest.fixture
def tec():
	return CategoriaSolicitud.objects.create(
		nombre='Tec'
	)

@pytest.mark.django_db
@pytest.fixture
def canton():
	return Canton.objects.create(
		nombre='Guayaquil'
	)

@pytest.mark.django_db
@pytest.fixture
def capital_trabajo():
	return TipoCredito.objects.create(
		nombre='Capital de trabajo'
	)

@pytest.mark.django_db
@pytest.fixture
def auth_user_admin():
	return User.objects.create(
		password='pbkdf2_sha256$150000$9dtDcPl6eZoy$capr/apCqUrL34HP2Com57L5+ns966axyL0tkeqXoAc=',
		is_superuser=1,
		username='juanflaso',
		email='juanflaso1@hotmail.com',
		is_staff=1,
		is_active=1,
	)

@pytest.mark.django_db
@pytest.fixture
def juan_pihuave(auth_user_admin, canton):
	return Usuario.objects.create(
		nombres='Juan',
		apellidos='Pihuave',
		usuario='jupi',
		password='1234',
		email='jupi@hotmail.com',
		celular='0983345654',
		tipo_persona=1,
		estado=1,
		direccion1='UR',
		direccion2='2',
		canton=canton,
		provincia='Guayas',
		pais='Ecuador',
		user=auth_user_admin
	)



@pytest.mark.django_db
@pytest.fixture
def solicitud_prueba(juan_pihuave, tec, capital_trabajo):
	return Solicitud.objects.create(
		operacion="USD 2,100 para cubrir costos de materia prima y entrega del product",
		historia='Historia de JP',
		plazo= 12,
		url="www.juanpiguave.com",
		imagen_url="aws.data.img/one.jpg",
		monto="6000",
		moneda="USD",
		tir=15.33,
		tin=21.12,
		fecha_finalizacion =datetime.date(2020,10,21),
		porcentaje_financiado=50,
		fecha_publicacion=datetime.date(2020,10,20),
		id_autor=juan_pihuave,
		id_categoria=tec,
		id_tipo_credito=capital_trabajo
	)

@pytest.mark.django_db
def test_crear_ta_supuesta(solicitud_prueba):
	print("TABLA DE AMORTIZACION SUPUESTA")
	print("Monto:", solicitud_prueba.monto)
	print("TIN:", solicitud_prueba.tin)
	print("PLAZO:",solicitud_prueba.plazo)
	print("Fecha inicio:", solicitud_prueba.fecha_finalizacion)
	diccionario = crear_tabla_amortizacion(solicitud_prueba, "PAGO")
	plazo = solicitud_prueba.plazo

	lista_capital_insoluto_ta_supuesta = diccionario['lista_capital_insoluto']
	lista_pagos_ta_supuesta = diccionario['lista_pagos']
	lista_intereses_pagados_ta_supuesta = diccionario['lista_intereses_pagados']
	lista_capitales_ta_supuesta = diccionario['lista_capitales']
	dias_ta_supuesta = diccionario['dias']
	fechas_ta_supuesta = diccionario['fechas']
	print("Fecha \t \t Pago \t \t Capital \t Intereses pagados \t Capital Insoluto")
	for i in range(plazo):
		fecha_i = fechas_ta_supuesta[i]
		pago_i = lista_pagos_ta_supuesta[i]
		intereses_pagados_i = lista_intereses_pagados_ta_supuesta[i]
		capital_insoluto_i = lista_capital_insoluto_ta_supuesta[i+1]
		capital_i = lista_capitales_ta_supuesta[i]
		str_notformat = "{fecha_i} \t {pago_i:8.2f} \t {capital_i:8.2f} \t {intereses_pagados_i:8.2f} \t \t {capital_insoluto_i}"
		str_format = str_notformat.format(fecha_i=fecha_i, pago_i=pago_i, capital_i=capital_i, intereses_pagados_i=intereses_pagados_i, capital_insoluto_i=capital_insoluto_i)
		print(str_format)
	pago_total = sum(lista_pagos_ta_supuesta)
	capital_total = sum(lista_capitales_ta_supuesta)
	interes_pagados_total = sum(lista_intereses_pagados_ta_supuesta)
	str_notformat = "TOTAL \t \t {pago_total:8.2f} \t {capital_total:8.2f} \t {interes_pagados_total:8.2f}"
	str_format = str_notformat.format(pago_total=pago_total, capital_total=capital_total, interes_pagados_total=interes_pagados_total)
	print(str_format)

@pytest.mark.django_db
@pytest.fixture
def inversion_prueba(juan_pihuave, solicitud_prueba):
	return Inversion.objects.create(
		id_user=juan_pihuave,
		id_solicitud = solicitud_prueba,
		monto=1000

	)

@pytest.mark.django_db
def test_crear_pagos_desde_ta_supuesta(inversion_prueba, solicitud_prueba):
	print("PAGOS DETALLES")
	ganancia_total = crear_pagos(inversion_prueba, solicitud_prueba)
	lista_pagos_detalles = Pago_detalle.objects.filter(id_inversion=inversion_prueba.id)
	print("Ganancia total",ganancia_total)