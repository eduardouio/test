from django.apps import AppConfig


class FasesInversionesConfig(AppConfig):
    name = 'fases_inversiones'

    def ready(self):
        import signals.FasesInversionesSignal