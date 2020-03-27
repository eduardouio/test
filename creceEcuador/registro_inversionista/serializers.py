""""Modulo para serializar los modelos"""
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers


from . import models
class UsuarioSerializer(serializers.ModelSerializer): 
    
    class Meta:
        """"Metadata"""
        model = models.Usuario
        fields = '__all__'


class EncuestaSerializer(serializers.ModelSerializer): 
    
    class Meta:
        """"Metadata"""
        model = models.Encuesta
        fields = '__all__'

