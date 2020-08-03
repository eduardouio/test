"""Variables usadas en esta aplicacion"""
#keys en el request para la paginacion
INICIO_KEY = 'inicio'
CANTIDAD_KEY = 'cantidad'

#Valores por defecto para la paginacion
INICIO_DEFAULT = 0
CANTIDAD_DEFAULT = 10

#Mensaje de acuerdo al estado
MENSAJE_BAD_REQUEST = "Llamada incorrecta."

#key para fase_inversion
FASE_KEY = "fase_inversion"

FASES_INVERSION = {
    "pendientes": "Pending Transfer",
    "por_fondear": "Waiting to be Fund",
    "vigentes": "Valid",
    "terminados": "Finished"
}

#key para id inversionista
INVERSIONISTA_KEY = "id_inversionista"