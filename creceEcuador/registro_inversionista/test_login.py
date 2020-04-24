# import json
# from rest_framework import status
# from django.test import Client
# from django.urls import reverse
# from .models import Usuario
# from .serializers import UsuarioSerializer
# from django.conf import settings
# from django.contrib.auth.models import User
# import ast
# import pytest


# # initialize the APIClient app
# client = Client()

# """ Test para GET solicitud con pk"""




# @pytest.mark.django_db
# @pytest.fixture
# def auth_user_admin():
#     return User.objects.create(
#         password='pbkdf2_sha256$150000$9dtDcPl6eZoy$capr/apCqUrL34HP2Com57L5+ns966axyL0tkeqXoAc=',
#         last_login='2020-03-11',
#         is_superuser=1,
#         username='admin',
#         email='admin@gmail.com',
#         is_staff=1,
#         is_active=1,
#         date_joined='2020-03-11'
#     )

# @pytest.mark.django_db
# @pytest.fixture
# def inversionista_test(auth_user_admin):
#     return Usuario.objects.create(
#         nombres='Juan',
#         apellidos='Pihuave',
#         usuario='jupi',
#         password='1234',
#         email='jupi@hotmail.com',
#         celular='0983345654',
#         tipo_persona=1,
#         estado=1,
#         direccion1='UR',
#         direccion2='2',
#         ciudad='Guayaquil',
#         provincia='Guayas',
#         pais='Ecuador',
#         user=auth_user_admin
#     )
# @pytest.fixture
# def function_fixture():
#    print('Fixture for each test')
#    return 1
# @pytest.mark.django_db
# @pytest.fixture
# def login_a_user(self, username="", password=""):
#     print("hola")
#     url = reverse(
#         "auth-login",
#     )
#     return self.client.post(
#         url,
#         data=json.dumps({
#             "username": username,
#             "password": password
#         }),
#         content_type="application/json"
#     )

# @pytest.mark.django_db
# def test_login_user_with_valid_credentials(self):
#         # test login with valid credentials
#         response = self.login_a_user("test_user", "testing")
#         print("hola")
#         # assert token key exists
#         self.assertIn("token", response.data)
#         # assert status code is 200 OK
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         # test login with invalid credentials
#         response = self.login_a_user("anonymous", "pass")
#         # assert status code is 401 UNAUTHORIZED
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# @pytest.mark.django_db
# def test_get_solicitud_individual(solicitud_juan_pihuave):
#     response = client.get(
#         reverse('get_solicitud_individual', kwargs={'pk': solicitud_juan_pihuave.pk})
#     )
#     solicitud = Solicitud.objects.get(pk=solicitud_juan_pihuave.pk)
#     serializer = SolicitudSerializer(instance=solicitud)

#     diccionario_respuesta_esperada = {
#         'status': status.HTTP_200_OK,
#         'data': serializer.data
#     }

#     respuesta = response.content.decode("UTF-8")
#     respuesta_str = ast.literal_eval(respuesta)

#     assert json.dumps(respuesta_str) == json.dumps(diccionario_respuesta_esperada)
#     assert response.status_code == status.HTTP_200_OK

# @pytest.mark.django_db
# def test_get_solicitud_individual_invalida():
#     response = client.get(
#         reverse('get_solicitud_individual', kwargs={'pk': 30})
#     )
#     assert response.status_code == status.HTTP_404_NOT_FOUND