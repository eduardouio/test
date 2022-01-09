from .models import UsuarioSolicitanteTemporal
from rest_framework import serializers

class UsuarioSolicitanteTemporalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioSolicitanteTemporal
        fields = [
            'nombres',
            'apellidos',
            'cedula',
            'celular',
            'email',
            'user'
        ]
