from .models import Inversion, Pago_detalle
from rest_framework import serializers
from solicitudes.serializers import SolicitudSerializer

class InversionSerializer(serializers.ModelSerializer):

    #solicitud = serializers.RelatedField(source='id_solicitud', read_only=True)
    solicitud = SolicitudSerializer(many=False, read_only=True, source='id_solicitud')
    class Meta:
        model = Inversion
        fields = [
            'id',
            'fase_inversion',
            'monto',
            'solicitud',
            "ganancia_total"
         ]


class InversionTransferenciaSerializer(serializers.ModelSerializer):

    monto_a_transferir = serializers.ReadOnlyField()
    banco_transferencia = serializers.ReadOnlyField()
    nombre_completo = serializers.ReadOnlyField()
    cedula_solicitante = serializers.ReadOnlyField()


    class Meta:
        model = Inversion
        fields = [
            'id',
            'banco_transferencia',
            'monto_a_transferir',
            'nombre_completo',
            'cedula_solicitante',
            'nombre_completo_autor'
         ]

class PagoDetalleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pago_detalle
        fields = [
            'orden',
            'fecha',
            'pago',
            'comision',
            'comision_iva',
            'ganancia',
            'estado_pago'
         ]