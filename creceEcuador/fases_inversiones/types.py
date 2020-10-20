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
    "pendientes": ["FILL_INFO", "PENDING_TRANSFER", "ORIGIN_MONEY", "TRANSFER_SUBMITED"],
    "por_fondear": ["TO_BE_FUND"],
    "vigentes": ["GOING"],
    "terminados": ["FINISHED"]
}

#key para id inversionista
INVERSIONISTA_KEY = "id_inversionista"


COMISION_ADJUDICACION_FACTOR =0.008
ADJUDICACION_FACTOR = 1.12
COMISION_BANCO = 0.4
COMISION_COBRANZA_INSOLUTO_MENSUAL = 0.004
IVA = 0.12



