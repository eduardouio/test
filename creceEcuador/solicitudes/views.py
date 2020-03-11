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

# Create your views here.
class SolicitudViewSet(viewsets.ModelViewSet):
    queryset = Solicitud.objects.all().order_by('fecha_publicacion')
    serializer_class = SolicitudSerializer

@api_view(['GET'])
def get_solicitudes(request):
    #setear los nombres de las keys de los parametros necesarios
    inicio_key = 'inicio'
    cantidad_key = 'cantidad'
    offset_key = 'offset'

    #setear defaults para valores de los parametros
    inicio_default = 0
    cantidad_default = 10
    offset_default = 0

    #obtener la data del request
    request_data = request.data

    #Setear la data del request si se encuentra
    #Si no se encuentra setear el default
    if inicio_key in request_data:
        inicio = request_data[inicio_key]
    else:
        inicio = inicio_default

    if cantidad_key in request_data:
        cantidad = request_data[cantidad_key]
    else:
        cantidad = cantidad_default

    if offset_key in request_data:
        offset = request_data[offset_key]
    else:
        offset = offset_default

    #Se setea el indice del ultimo registro
    final = inicio + cantidad

    #Se obtiene el queryset y se lo convierte a json
    queryset = Solicitud.objects.all().order_by('fecha_publicacion')[inicio:final]
    serializer = SolicitudSerializer(queryset, many=True)

    #Se crea el diccionario de respuesta
    diccionario_respuesta = {
        'inicio': inicio,
        'cantidad': cantidad,
        'offset': offset,
        'data': serializer.data
    }

    return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')