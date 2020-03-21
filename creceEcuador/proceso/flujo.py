from .models import Proceso, Tarea, TareaPrevia
from django.db import models
from django.contrib.auth.models import User
from .types import ESTADO_TAREA_ABIERTA
from .types import MENSAJE_ERROR_FLUJO_YA_TIENE_PROCESO, MENSAJE_ERROR_NO_ES_INSTANCIA_PROCESO
from .types import MENSAJE_ERROR_NO_ES_INSTANCIA_USER, MENSAJE_PROCESO_NO_DEFINIDO
class Flujo:
    """
    Clase que representa un flujo

    ...

    Attributes
    ----------
    proceso : Proceso, (default None)
        El proceso que se usara en el flujo
    tarea : Tarea
        La tarea actual del flujo. None al inicio

    Methods
    -------
    crear_proceso(clase, estado, descripcion):
        Crea un proceso y lo guarda en la BD
    crear_tarea(flujo_tarea, flujo_tipo, owner, data):
        Crea una tarea y lo guarda en la BD
    """
    def __init__(self, proceso=None):
        """
        Parameters
        ----------
        proceso : Proceso, (default None)
            El proceso que se usara en el flujo
            Si no se especifica, se lo puede crear con crear_proceso
        Raises
        ----------
        TypeError
            El proceso dado debe pertenecer al tipo especificado
        """

        #Se revisa que el proceso dado no sea None (default) y que sea instancia del objeto Proceso
        #Si no es instancia entonces se levanta un type error
        if proceso is not None:
            if not isinstance(proceso, Proceso):
                raise TypeError(MENSAJE_ERROR_NO_ES_INSTANCIA_PROCESO)

        #Se asigna el proceso dado (o el default) 
        #al proceso de la clase. Es decir, este solamente puede
        #ser None o una instancia del modelo Proceso
        self.proceso = proceso
        self.tarea = None
                
    
    def crear_proceso(self, clase, estado, descripcion):
        """ Metodo para crear un proceso

        Con este metodo se crea un proceso nuevo solamente si 
        el flujo no cuenta con un proceso. Este proceso es 
        guardado en la base de datos y como atributo del objeto
        flujo.

        Parameters
        ----------
        clase : str
            La clase del proceso (Ej: inversionista.metodo)
        estado : str
            Indica si el proceso tiene tareas pendientes 
            (ABIERTO) o no (CERRADO)
        descripcion : str
            Una breve explicacion del proceso

        Raises
        ------
        ValueError
            Si ya existe un proceso asignado al flujo, se levanta
            una excepcion
        """ 

        if self.proceso is None:
            self.proceso = Proceso(clase=clase, estado=estado, descripcion=descripcion)
            self.proceso.save()
        else:
            raise ValueError(MENSAJE_ERROR_FLUJO_YA_TIENE_PROCESO)
    
    def crear_tarea(self, flujo_tarea, flujo_tipo, owner, data):
        """ Metodo para crear una tarea

        Con este metodo se crea una tarea nueva solamente si 
        el flujo cuenta con un proceso y se provee un User valido. 
        Esta tarea es guardada en la base de datos y como atributo del objeto
        flujo.

        Parameters
        ----------
        flujo_tarea : str
            La clase del proceso (Ej: inversionista.metodo)
        flujo_tipo : str
            Indica si el proceso tiene tareas pendientes 
            (ABIERTO) o no (CERRADO)
        owner : str
            La clase del proceso (Ej: inversionista.metodo)
        data : str
            Una breve explicacion de la tarea

        Raises
        ------
        TypeError
            Si no existe un proceso asignado al 
            flujo, se levanta una excepcion.
        ValueError
            Si no se provee un owner instancia 
            de User se levanta dicha excepcion
        """ 
        #Se revisa si ya se seteo el proceso en la clase
        if self.proceso is not None:
            #Se revisa si el owner es instancia de User
            if isinstance(owner, User):
                self.tarea = Tarea.objects.create(
                    flujo_tarea = flujo_tarea,
                    flujo_tipo = flujo_tipo,
                    estado = ESTADO_TAREA_ABIERTA,
                    owner_id = owner,
                    proceso_id = self.proceso,
                    data = data
                )
            else:
                raise TypeError(MENSAJE_ERROR_NO_ES_INSTANCIA_USER)
        else:
            raise ValueError(MENSAJE_PROCESO_NO_DEFINIDO)


    def obtener_ultimas_tareas_abiertas(self):
        """ Metodo para obtener la o las ultimas tareas

        Con este metodo se obtiene la o las ultimas tareas con 
        el estado ABIERTO

        Raises
        ------
        DoesNotExist
            Si no se encuentran tareas abiertas para el proceso
            actual.
        """ 
        #Se filtran todas las tareas abiertas que 
        #pertenezcan al proceso
        ultimas_tareas = Tarea.object.filter(
            estado__exact=ESTADO_TAREA_ABIERTA,
            proceso_id__exact=self.proceso.pk,
        )

        return ultimas_tareas
    

        
    

