from django.apps import AppConfig

class SolicitudesConfig(AppConfig):
    name = 'solicitudes'

    def ready(self):
        import signals.SolicitudSignal