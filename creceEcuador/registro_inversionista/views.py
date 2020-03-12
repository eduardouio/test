from django.shortcuts import render, redirect
from rest_framework import viewsets, generics,status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from . import models
from . import serializers

class UsuariosViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer

class RegisterUsers(generics.CreateAPIView):
    """
    POST auth/register/inversionista/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        nombres = request.data.get("nombres")
        apellidos = request.data.get("apellidos")
        celular = request.data.get("celular")
        tipo_persona = request.data.get("tipo_persona")
        if not username and not password and not email:
            return Response(
                data={
                    "message": "username, password and email is required to register a user"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        new_user = User.objects.create_user(
            username=username, password=password, email=email, first_name=nombres, last_name=apellidos,
        )
        models.Usuario.objects.create(usuario=username, nombres=nombres, apellidos=apellidos, email=email, celular=celular, tipo_persona=tipo_persona, user=new_user)
        return Response({"mensaje": "Su cuenta ha sido agregada correctamente"},status=status.HTTP_200_OK, )

class EncuestaViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Encuesta.objects.all()
    serializer_class = serializers.EncuestaSerializer