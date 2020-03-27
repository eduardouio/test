from rest_framework import serializers
from . models import TransferenciaInversion

class TransferenciaInversionPostRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransferenciaInversion
        fields = [
            'id_transferencia',
            'id_inversion',
            'fecha_creacion',
            'fecha_aprobacion',
            'usuario_aprobacion',
            'estado'
        ]

class TransferenciaInversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferenciaInversion
        fields = "__all__"