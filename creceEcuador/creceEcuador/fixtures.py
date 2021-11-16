import datetime

import pytest

from fases_inversiones.models import Inversion, crear_pagos_para_ta_supuesta
from django.contrib.auth.models import User
from registro_inversionista.models import Canton, Usuario
from solicitante.utils import crear_ta_supuesta_por_inversion
from solicitudes.models import CategoriaSolicitud, TipoCredito, Solicitud, ClaseSolicitud


@pytest.fixture
def tec():
    return CategoriaSolicitud.objects.create(
        nombre='Tec'
    )


@pytest.fixture
def canton():
    return Canton.objects.create(
        nombre='Guayaquil'
    )


@pytest.fixture
def capital_trabajo():
    return TipoCredito.objects.create(
        nombre='Capital de trabajo'
    )


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


@pytest.fixture
def claseSolicitud():
    return ClaseSolicitud.objects.create(
        nombre='TestClase',
        imagen_clase=None
    )

@pytest.fixture
def solicitud_prueba(juan_pihuave, tec, capital_trabajo, claseSolicitud):
    return Solicitud.objects.create(
        operacion="USD 2,100 para cubrir costos de materia prima y entrega del product",
        historia='Historia de JP',
        plazo=12,
        url="www.juanpiguave.com",
        imagen_url="aws.data.img/one.jpg",
        monto="7000",
        moneda="USD",
        tir=15.33,
        tin=21,
        fecha_finalizacion=datetime.date(2021,11, 7),
        porcentaje_financiado=50,
        fecha_publicacion=datetime.date(2020, 9, 29),
        id_autor=juan_pihuave,
        id_categoria=tec,
        id_tipo_credito=capital_trabajo,
        id_perfil_riesgo = claseSolicitud

    )


@pytest.fixture
def inversion_prueba_1(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=3500,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def inversion_prueba_2(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=1000,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def inversion_prueba_3(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=500,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def inversion_prueba_4(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=400,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def inversion_prueba_5(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=600,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def inversion_prueba_6(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=350,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def inversion_prueba_7(juan_pihuave, solicitud_prueba):
    inversion = Inversion(
        id_user=juan_pihuave,
        id_solicitud=solicitud_prueba,
        monto=650,
        fase_inversion="GOING"
    )
    inversion.save()
    return inversion


@pytest.fixture
def crear_inversiones(inversion_prueba_1, inversion_prueba_2, inversion_prueba_3, inversion_prueba_4,
                      inversion_prueba_5,
                      inversion_prueba_6, inversion_prueba_7):
    lista_inversiones = [inversion_prueba_1, inversion_prueba_2, inversion_prueba_3, inversion_prueba_4,
                         inversion_prueba_5, inversion_prueba_6, inversion_prueba_7]
    return lista_inversiones


@pytest.fixture
def crear_pagos_para_ta_supuesta_fixture(crear_inversiones, solicitud_prueba):
    for inversion in crear_inversiones:
        crear_pagos_para_ta_supuesta(inversion, solicitud_prueba)
    crear_ta_supuesta_por_inversion(solicitud_prueba)
