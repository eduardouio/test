from .models import Inversion
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
            'solicitud'
         ]