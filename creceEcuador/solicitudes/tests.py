from django.test import TestCase
import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from .models import CategoriaSolicitud, TipoCredito, Solicitud
from registro_inversionista.models import Usuario
from .serializers import SolicitudSerializer
from django.conf import settings
from django.contrib.auth.models import User
import ast



# initialize the APIClient app
client = Client()
class ObtenerSolicitudIndividualTest(TestCase):
    """ Test para GET solicitud con pk"""

    def setUp(self):
        self.tec = CategoriaSolicitud.objects.create(
            nombre='Tec'
        )

        self.capital_trabajo = TipoCredito.objects.create(
            nombre='Capital de trabajo'
        )

        self.auth_user_admin = User.objects.create(
            password='pbkdf2_sha256$150000$9dtDcPl6eZoy$capr/apCqUrL34HP2Com57L5+ns966axyL0tkeqXoAc=',
            last_login='2020-03-11',
            is_superuser=1,
            username='juanflaso',
            email='juanflaso1@hotmail.com',
            is_staff=1,
            is_active=1,
            date_joined='2020-03-11'
        )
        
        self.juan_pihuave = Usuario.objects.create(
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
            user=self.auth_user_admin
        )

        self.solicitud_juan_pihuave = Solicitud.objects.create(
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
            id_autor=self.juan_pihuave,
            id_categoria=self.tec,
            id_tipo_credito=self.capital_trabajo
        )

    def test_get_solicitud_individual(self):
        response = client.get(
            reverse('get_solicitud_individual', kwargs={'pk': self.solicitud_juan_pihuave.pk})
        )
        solicitud = Solicitud.objects.get(pk=self.solicitud_juan_pihuave.pk)
        serializer = SolicitudSerializer(instance=solicitud)

        diccionario_respuesta_esperada = {
            'status': status.HTTP_200_OK,
            'data': serializer.data
        }

        respuesta = response.content.decode("UTF-8")
        respuesta_str = ast.literal_eval(respuesta)

        self.assertEqual(json.dumps(respuesta_str), json.dumps(diccionario_respuesta_esperada))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_solicitud_individual_invalida(self):
        response = client.get(
            reverse('get_solicitud_individual', kwargs={'pk': 30})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)