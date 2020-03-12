from .models import Solicitud
from rest_framework import serializers

class SolicitudSerializer(serializers.ModelSerializer):
    autor = serializers.ReadOnlyField()
    categoria = serializers.ReadOnlyField()
    tipo_credito = serializers.ReadOnlyField()

    class Meta:
        model = Solicitud
        fields = [
            'id',
            'titulo',
            'operacion',
            'plazo',
            'autor',
            'url',
            'imagen_url',
            'monto',
            'moneda',
            'tir',
            'categoria',
            'tipo_credito',
            'fecha_creacion',
            'fecha_publicacion',
            'fecha_finalizacion',
            'fecha_expiracion',
            'porcentaje_financiado'
        ]