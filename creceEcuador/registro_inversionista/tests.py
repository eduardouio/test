
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from .models import Usuario, Banco
from .serializers import UsuarioSerializer, BancoSerializer
from django.contrib.auth.models import User
import json

# tests for views


class BaseViewTest(APITestCase):
    client = APIClient()

    @staticmethod
    def crear_inversionista(user=""):
        Usuario.objects.create(
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
                                user=user
                            )

    def login_a_user(self, username="", password=""):
        url = reverse(
            "inversionista_login",
        )
        return self.client.post(
            url,
            data=json.dumps({
                "username": username,
                "password": password
            }),
            content_type="application/json"
        )

    def auth_user_admin(self):
        return User.objects.create(
            password='pbkdf2_sha256$150000$9dtDcPl6eZoy$capr/apCqUrL34HP2Com57L5+ns966axyL0tkeqXoAc=',
            last_login='2020-03-11',
            is_superuser=1,
            username='admin',
            email='admin@gmail.com',
            is_staff=1,
            is_active=1,
            date_joined='2020-03-11'
        )

    def setUp(self):
        # create a admin user
        #user = self.auth_user_admin()
        self.user = User.objects.create_superuser(
            username="test_user",
            email="test@mail.com",
            password="testing",
            first_name="test",
            last_name="user",
        )
        # add test data
        self.crear_inversionista(user=self.user)

    def login_client(self, username="", password=""):
        # get a token from DRF
        response = self.client.post(
            reverse('create-token'),
            data=json.dumps(
                {
                    'username': username,
                    'password': password
                }
            ),
            content_type='application/json'
        )
        self.token = response.data['token']
        # set the token in the header
        self.client.credentials(
            HTTP_AUTHORIZATION='Bearer ' + self.token
        )
        self.client.login(username=username, password=password)
        return self.token

# class AuthLoginUserTest(BaseViewTest):
#     """
#     Tests for the auth/login/ endpoint
#     """

#     def test_login_user_with_valid_credentials(self):
#         # test login with valid credentials
#         response = self.login_a_user("test_user", "testing")
#         # assert token key exists
#         #self.assertIn("tokens", response.data.get("tokens"))
#         # assert status code is 200 OK
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

        # test login with invalid credentials
        # response = self.login_a_user("anonymous", "pass")
        # # assert status code is 401 UNAUTHORIZED
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# class GetAllBancosTest(BaseViewTest):

#     def test_get_all_bancos(self):
#         """
#         This test ensures that all songs added in the setUp method
#         exist when we make a GET request to the songs/ endpoint
#         """
#         # hit the API endpoint
#         self.login_client('test_user', 'testing')
#         # hit the API endpoint
#         response = self.client.get(
#             reverse("bancos-all")
#         )
#         # fetch the data from db
#         expected = Banco.objects.all()
#         serialized = BancoSerializer(expected, many=True)
#         self.assertEqual(response.data, serialized.data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)


# class AuthRegisterUserTest(AuthBaseTest):
#     """
#     Tests for auth/register/ endpoint
#     """
#     def test_register_a_user_with_valid_data(self):
#         url = reverse(
#             "auth-register",
#             kwargs={
#                 "version": "v1"
#             }
#         )
#         response = self.client.post(
#             url,
#             data=json.dumps(
#                 {
#                     "username": "new_user",
#                     "password": "new_pass",
#                     "email": "new_user@mail.com"
#                 }
#             ),
#             content_type="application/json"
#         )
#         # assert status code is 201 CREATED
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_register_a_user_with_invalid_data(self):
#         url = reverse(
#             "auth-register",
#             kwargs={
#                 "version": "v1"
#             }
#         )
#         response = self.client.post(
#             url,
#             data=json.dumps(
#                 {
#                     "username": "",
#                     "password": "",
#                     "email": ""
#                 }
#             ),
#             content_type='application/json'