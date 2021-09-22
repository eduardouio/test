from django.contrib import admin
from ckeditor.widgets import CKEditorWidget
from django import forms

from .models import CategoriaSolicitud, ClaseSolicitud,TipoCredito, Solicitud, CalificacionSolicitante, BancoDeposito

class SolicitudAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    class Meta:
        model = Solicitud
        fields = '__all__'

class SolicitudAdmin(admin.ModelAdmin):
    form = SolicitudAdminForm

admin.site.register(Solicitud, SolicitudAdmin)

# Register your models here.
admin.site.register(CategoriaSolicitud)
admin.site.register(ClaseSolicitud)
admin.site.register(TipoCredito)
#admin.site.register(Solicitud)

admin.site.register(CalificacionSolicitante)
admin.site.register(BancoDeposito)
