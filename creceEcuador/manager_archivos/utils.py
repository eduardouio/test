import os
import requests
import tempfile
from .types import MENSAJE_URL_NO_VALIDA, EXTENSION_ARCHIVOS_VALIDOS, MENSAJE_ARCHIVO_TIPO_INCORRECTO
from rest_framework import status

def download_objeto(image_url:str):
    request = requests.get(image_url, stream=True)

    # Se revisa la respuesta al request
    if request.status_code != requests.codes.ok:
        # Si no fue ok, entonces se levanta un value error
        raise ValueError(MENSAJE_URL_NO_VALIDA)

    # Se crea un archivo temporal
    imagen_temporal = tempfile.NamedTemporaryFile()

    # Se lee la imagen por secciones
    for block in request.iter_content(1024 * 8):

        # Si no existe mas imagen se deja de leer
        if not block:
            break

        # Se escribe el bloque de la imagen al objeto temporal
        imagen_temporal.write(block)
    
    return imagen_temporal

def get_extension_archivo(url:str):
    #Se obtiene el ultimo elemento de la url (nombre del archivo)
    file_name = url.split('/')[-1]
    #se retorna el ultimo elemento del nombre del archivo (extension)
    return file_name.split('.')[-1]

def get_nombre_archivo(nuevo_nombre:str, url:str):
    #Se concatena el nuevo nombre con la extension del archivo
    return nuevo_nombre+"."+validar_extension_y_retornarla(url)

def validar_extension_y_retornarla(url:str):
    try:
        #Se obtiene la extension del archivo
        extension_archivo = get_extension_archivo(url)
        #Se verifica que la extension del archivo dado se encuentre en la lista
        #de extensiones validas
        if extension_archivo.lower() in EXTENSION_ARCHIVOS_VALIDOS:
            #Si es valida se retorna
            return extension_archivo
        else:
            raise ValueError(MENSAJE_ARCHIVO_TIPO_INCORRECTO)
    except IndexError:
        #Si se obtiene index error, entonces la url no era valida
        raise ValueError(MENSAJE_URL_NO_VALIDA)

def crear_diccionario_respuesta_ok(data:dict, status:str):
    return {
            'status': status,
            'data': data
        }

def crear_diccionario_respuesta_400(mensaje_error:str):
    return {
            'status': status.HTTP_404_NOT_FOUND,
            'message': mensaje_error,
            'data': {}
        }
