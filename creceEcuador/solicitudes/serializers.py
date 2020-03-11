from .models import Solicitud
from rest_framework import serializers

class SolicitudSerializer(serializers.ModelSerializer):
    nombre_autor = serializers.ReadOnlyField()
    categoria = serializers.ReadOnlyField()
    tipo_credito = serializers.ReadOnlyField()

    class Meta:
        model = Solicitud
        fields = [
            'id',
            'titulo',
            'operacion',
            'plazo',
            'nombre_autor',
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
            'total_porcentaje_financiado'
        ]