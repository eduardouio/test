import pytest
from solicitudes.models import Solicitud, CategoriaSolicitud, TipoCredito
from registro_inversionista.models import Usuario, Canton
from django.contrib.auth.models import User
from .models import crear_tabla_amortizacion, Pagos_ta_supuesta
import datetime
from .types import calcular_interes_n, calcular_interes_mora_n
import math

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
		monto="7000",
		moneda="USD",
		tir=15.33,
		tin=19.50,
		fecha_finalizacion =datetime.date(2020,10,23),
		porcentaje_financiado=100,
		fecha_publicacion=datetime.date(2020,10,21),
		id_autor=juan_pihuave,
		id_categoria=tec,
		id_tipo_credito=capital_trabajo
	)

@pytest.mark.django_db
@pytest.fixture
def pagos_ta_supuesta(solicitud_prueba):
	return Pagos_ta_supuesta.objects.filter(
		id_solicitud = solicitud_prueba
	).filter(estado = 0).order_by("fecha")

@pytest.mark.django_db
def test_calcular_pago_real_1(solicitud_prueba, pagos_ta_supuesta):
	TASA_INTERES_ANUAL = float(solicitud_prueba.tin)
	if( TASA_INTERES_ANUAL > 1):
		TASA_INTERES_ANUAL = TASA_INTERES_ANUAL/100


	tasa_efectiva_diaria = (1+TASA_INTERES_ANUAL/365)-1
	pago_supuesto_actual = pagos_ta_supuesta[0]

	capital_insoluto_anterior = 7000
	sum_intereses_pagados_n = 0
	sum_intereses_mora_pagados_n = 0
	saldo_capital_anterior = 0
	saldo_interes_mora_anterior = 0
	fecha_pago_real = datetime.date(2020,11,7)

	fecha_pago_supuesta = pago_supuesto_actual.fecha
	dias_supuestos = pago_supuesto_actual.dias_totales
	num_cuota = pago_supuesto_actual.num_pago
	dias_mora = (fecha_pago_real - fecha_pago_supuesta).days
	dias_totales = dias_mora + dias_supuestos

	interes_n = calcular_interes_n(capital_insoluto_anterior, sum_intereses_pagados_n , dias_totales, dias_mora, tasa_efectiva_diaria)
	interes_mora_n = calcular_interes_mora_n(capital_insoluto_anterior, sum_intereses_mora_pagados_n, saldo_capital_anterior, saldo_interes_mora_anterior, dias_mora, tasa_efectiva_diaria)
	print("Interes n:",interes_n)
	print("Interes mora:",interes_mora_n)
