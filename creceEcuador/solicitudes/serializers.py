from .models import Solicitud
from rest_framework import serializers

class SolicitudSerializer(serializers.ModelSerializer):
    autor = serializers.ReadOnlyField()
    ruc_autor = serializers.ReadOnlyField()
    categoria = serializers.ReadOnlyField()
    clase_img = serializers.ReadOnlyField()
    clase = serializers.ReadOnlyField()
    imagen_categoria = serializers.ReadOnlyField()
    tipo_credito = serializers.ReadOnlyField()
    tipo_persona = serializers.ReadOnlyField()
    solicitudes_pagadas = serializers.ReadOnlyField()
    solicitudes_vigentes = serializers.ReadOnlyField()
    puntualidad_autor = serializers.ReadOnlyField()

    class Meta:
        model = Solicitud
        fields = [
            'id',
            'ticket',
            'operacion',
            'plazo',
            'autor',
            'ruc_autor',
            'tipo_persona',
            'url',
            'imagen_url',
            'historia',
            'monto',
            'moneda',
            'tir',
            'categoria',
            'imagen_categoria',
            'clase',
            'clase_img',
            'solicitudes_pagadas',
            'solicitudes_vigentes',
            'puntualidad_autor',
            'tipo_credito',
            'fecha_creacion',
            'fecha_publicacion',
            'fecha_finalizacion',
            'fecha_expiracion',
            'porcentaje_financiado',
            'monto_financiado',
            'tin',
            'garantias',
            'visita_agente_CRECE',
            'condiciones',
            'mas_informacion_autor'
        ]
