import json
from rest_framework import status
from django.test import Client
from django.urls import reverse
from .models import Proceso, Tarea
from registro_inversionista.models import Usuario
from django.conf import settings
from django.contrib.auth.models import User
from .types import ESTADO_TAREA_ABIERTA
from .flujo import Flujo
import ast
import pytest

""" 
Test para la creacion de un flujo junto con sus metodos
"""

@pytest.mark.django_db
@pytest.fixture
def proceso_abierto():
    return Proceso.objects.create(
        clase= "inversionista.metodo",
        estado=ESTADO_TAREA_ABIERTA,
        descripcion="Descripcion"
    )

@pytest.mark.django_db
@pytest.fixture
def auth_user_admin():
    return User.objects.create(
        password='pbkdf2_sha256$150000$9dtDcPl6eZoy$capr/apCqUrL34HP2Com57L5+ns966axyL0tkeqXoAc=',
        last_login='2020-03-11',
        is_superuser=1,
        username='juanflaso',
        email='juanflaso1@hotmail.com',
        is_staff=1,
        is_active=1,
        date_joined='2020-03-11'
    )
@pytest.mark.django_db
@pytest.fixture
def tarea_abierta():
    return Tarea.objects.create(
        flujo_tarea = "inversionista.metodo",
        flujo_tipo = "Humano",
        estado = ESTADO_TAREA_ABIERTA,            
        owner_id = auth_user_admin,
        proceso_id = proceso_abierto,
    )
@pytest.mark.django_db
def test_inicializar_flujo_sin_proceso():
    flujo = Flujo()
    assert flujo.proceso == None

@pytest.mark.django_db
def test_inicializar_flujo_con_proceso(proceso_abierto):
    flujo = Flujo(proceso_abierto)
    assert True == isinstance(flujo.proceso, Proceso)
    assert flujo.proceso.id == proceso_abierto.id

@pytest.mark.django_db
def test_inicializar_flujo_objeto_incorrecto():
    try: 
        Flujo("No soy un proceso")
    except TypeError:
        pass


@pytest.mark.django_db
def test_crear_proceso_en_flujo():
    flujo = Flujo()
    flujo.crear_proceso("clase", "estado", "descrip")
    proceso_en_base =Proceso.objects.get(descripcion__exact="descrip")
    assert proceso_en_base.id == flujo.proceso.id

@pytest.mark.django_db
def test_crear_proceso_cuando_flujo_ya_lo_tiene(proceso_abierto):
    try:
        flujo = Flujo(proceso_abierto)
        flujo.crear_proceso("clase", "estado", "descrip")
    except ValueError:
        pass

@pytest.mark.django_db
def test_crear_tarea_correctamente(proceso_abierto, auth_user_admin):
    flujo_tarea="Flujo.invertir_inversionista"
    flujo = Flujo(proceso_abierto)
    flujo.crear_tarea(
        flujo_tarea,
        "humano",
        auth_user_admin,
        "Texto de descripcion"
    )
    tarea_en_base =Tarea.objects.get(
        owner_id__exact=auth_user_admin.pk,
        flujo_tarea__exact=flujo_tarea
        )
    assert tarea_en_base.id == flujo.tarea.id

@pytest.mark.django_db
def test_crear_tarea_sin_instancia_proceso(auth_user_admin):
    try:
        flujo = Flujo()
        flujo.crear_tarea(
            "Flujo.invertir_inversionista",
            "humano",
            auth_user_admin,
            "Texto de descripcion"
        )
    except ValueError:
        pass

@pytest.mark.django_db
def test_crear_tarea_sin_instancia_user(proceso_abierto):
    try:
        flujo = Flujo(proceso_abierto)
        flujo.crear_tarea(
            "Flujo.invertir_inversionista",
            "humano",
            "No soy un user",
            "Texto de descripcion"
        )
    except TypeError:
        pass






