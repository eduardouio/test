from django.shortcuts import render
from rest_framework import viewsets
from .models import Solicitud
from .serializers import SolicitudSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core import serializers
from django.http import HttpResponse
import json

from .types import INICIO_DEFAULT, INICIO_KEY, CANTIDAD_KEY, CANTIDAD_DEFAULT

# Create your views here.
class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all().order_by('fecha_publicacion')
    serializer_class = SolicitudSerializer

@api_view(['GET'])
def get_solicitudes(request):
    #obtener la data del request
    request_data = request.data

    #Setear la data del request si se encuentra
    #Si no se encuentra setear el default
    inicio = INICIO_DEFAULT
    if INICIO_KEY in request_data:
        if request_data[INICIO_KEY] >= 0 :
            inicio = request_data[INICIO_KEY]

    cantidad = CANTIDAD_DEFAULT    
    if CANTIDAD_KEY in request_data:
        if request_data[CANTIDAD_KEY] >= 0 :
            cantidad = request_data[CANTIDAD_KEY]    

    #Se setea el indice del ultimo registro
    final = inicio + cantidad

    #Se obtiene el queryset y se lo convierte a json
    queryset = Solicitud.objects.all().order_by('fecha_publicacion')[inicio:final]
    serializer = SolicitudSerializer(queryset, many=True)

    #Se crea el diccionario de respuesta
    diccionario_respuesta = {
        'inicio': inicio,
        'cantidad': cantidad,
        'data': serializer.data
    }

    return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')