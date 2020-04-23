import json
from rest_framework import status
from django.test import Client
from django.urls import reverse
from registro_inversionista.models import Usuario
from .serializers import TransferenciaInversionSerializer
from django.conf import settings
from django.contrib.auth.models import User
import ast
import pytest
from fases_inversiones.models import Inversion
from solicitudes.models import CategoriaSolicitud, TipoCredito, Solicitud

# initialize the APIClient app
client = Client()

@pytest.mark.django_db
@pytest.fixture
def tec():
    return CategoriaSolicitud.objects.create(
        nombre='Tec'
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
def juan_pihuave(auth_user_admin):
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
        ciudad='Guayaquil',
        provincia='Guayas',
        pais='Ecuador',
        user=auth_user_admin
    )

@pytest.mark.django_db
@pytest.fixture
def jose_inversionista(auth_user_admin):
    return Usuario.objects.create(
        nombres='Jose',
        apellidos='Pihuave',
        usuario='jupi',
        password='1234',
        email='jupi@hotmail.com',
        celular='0983345654',
        tipo_persona=1,
        estado=1,
        direccion1='UR',
        direccion2='2',
        ciudad='Guayaquil',
        provincia='Guayas',
        pais='Ecuador',
        user=auth_user_admin
    )

@pytest.mark.django_db
@pytest.fixture
def solicitud_juan_pihuave(juan_pihuave, tec, capital_trabajo):
    return Solicitud.objects.create(
        titulo='Oportunidad de Inversion de XXXXX',
        operacion="USD 2,100 para cubrir costos de materia prima y entrega del product",
        historia='Historia de JP',
        plazo= 48,
        url="www.juanpiguave.com",
        imagen_url="aws.data.img/one.jpg",
        monto="10.000",
        moneda="USD",
        tir=15.0,
        porcentaje_financiado=30.5,
        fecha_publicacion="2020-02-15",
        fecha_finalizacion="2020-03-10",
        fecha_expiracion="2020-05-10",
        id_autor=juan_pihuave,
        id_categoria=tec,
        id_tipo_credito=capital_trabajo
    )

@pytest.mark.django_db
@pytest.fixture
def inversion_jose(jose_inversionista, solicitud_juan_pihuave):
    return Inversion.objects.create(
        id_user=jose_inversionista,
        id_solicitud=solicitud_juan_pihuave,
        monto=100,
        adjudicacion = 10,
        adjudicacion_iva = 10.12,
        inversion_total = 110,
        ganancia_total = 11,
        estado=0
    )

@pytest.fixture
def url_jpg_valida():
    return "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg"

@pytest.fixture
def url_gif():
    return "https://cdn140.picsart.com/313860664160201.gif"

@pytest.fixture
def url_jpg_no_valida():
    return "htps://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg"

@pytest.fixture
def url_pdf_valido():
    return "https://www.researchgate.net/profile/Ian_Turner11/publication/305441746_The_Simpsons_in_Higher_Education/links/578f1dac08ae81b4466ed516/The-Simpsons-in-Higher-Education.pdf"

@pytest.mark.django_db
def test_url_y_formato_validos(url_jpg_valida, inversion_jose):
    diccionario_request = {
        "id_inversion": inversion_jose.pk,
        "url_documento": url_jpg_valida
    }
    response = client.post(
        reverse( 'transferencia_view'),
        diccionario_request
    )

    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_pdf_valido(url_pdf_valido, inversion_jose):
    diccionario_request = {
        "id_inversion": inversion_jose.pk,
        "url_documento": url_pdf_valido
    }
    response = client.post(
        reverse( 'transferencia_view'),
        diccionario_request
    )
    assert response.status_code == status.HTTP_201_CREATED

@pytest.mark.django_db
def test_url_no_valida(url_jpg_no_valida, inversion_jose):
    diccionario_request = {
        "id_inversion": inversion_jose.pk,
        "url_documento": url_jpg_no_valida
    }
    response = client.post(
        reverse( 'transferencia_view'),
        diccionario_request
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

@pytest.mark.django_db
def test_formato_no_valido(url_gif, inversion_jose):
    diccionario_request = {
        "id_inversion": inversion_jose.pk,
        "url_documento": url_gif
    }
    response = client.post(
        reverse( 'transferencia_view'),
        diccionario_request
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
