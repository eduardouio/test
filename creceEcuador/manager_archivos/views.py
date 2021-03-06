from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.files import File
from urllib.request import urlopen
from tempfile import NamedTemporaryFile
import urllib
import copy
from .utils import download_objeto, get_nombre_archivo, crear_diccionario_respuesta_400, crear_diccionario_respuesta_ok
from .types import PREFIJO_NOMBRE_ARCHIVO_COMPROBANTE_TRANSFERENCIA, MENSAJE_URL_NO_VALIDA, MENSAJE_DOCUMENTO_NOT_IN_REQUEST
from .serializers import TransferenciaInversionPostRequestSerializer, TransferenciaInversionSerializer, TransferenciaInversionArchivoSerializer
from .models import TransferenciaInversion
import json
from django.http import HttpResponse


class TransferenciaInversionView(APIView):

    def post(self, request, *args, **kwargs):
        try:
            transferencia_serializer = TransferenciaInversionPostRequestSerializer(data=request.data)
            if transferencia_serializer.is_valid():
                image_url = request.data["url_documento"]

                #Se descarga la imagen dada en la url
                imagen = File(download_objeto(image_url))
                
                #Se crea el modelo sin imagen
                transferencia = transferencia_serializer.save()
                
                #se crea el nombre del archivo a guardar a partir del id del mismo
                nombre_archivo_sin_extension = PREFIJO_NOMBRE_ARCHIVO_COMPROBANTE_TRANSFERENCIA + str(transferencia.id_transferencia)
                nombre_archivo = get_nombre_archivo(nombre_archivo_sin_extension, image_url)
                
                #se agrega la imagen al modelo de la transferencia
                transferencia.url_documento.save(nombre_archivo, imagen)
                
                #Se serializa el objeto de la transferencia
                serializer = TransferenciaInversionSerializer(instance=transferencia)
                diccionario_respuesta = crear_diccionario_respuesta_ok(serializer.data, status.HTTP_201_CREATED)
                return Response(diccionario_respuesta, status=status.HTTP_201_CREATED)
            else:
                diccionario_respuesta = crear_diccionario_respuesta_400(transferencia_serializer.errors)
                return Response(diccionario_respuesta, status=status.HTTP_400_BAD_REQUEST)
        except (KeyError, IndexError, ValueError) as e:
            diccionario_respuesta = crear_diccionario_respuesta_400(str(e))
            return Response(diccionario_respuesta, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_transferencia_inversion_individual(request, pk):
    try:
        transferencia_count = TransferenciaInversion.objects.filter(id_inversion= pk, estado=0).count() #get_object_or_404(Solicitud, pk=pk)

        if(transferencia_count>0):
            transferencia = TransferenciaInversion.objects.filter(id_inversion= pk, estado=0).latest('fecha_creacion')

            serializer = TransferenciaInversionArchivoSerializer(instance=transferencia)

            diccionario_respuesta = {
                'status': status.HTTP_200_OK,
                'data': serializer.data
            }

            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Transferencia no encontrada",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)


    except TransferenciaInversion.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Transferencia no encontrada",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
        #raise Http404(json.dumps({'status':404}))

