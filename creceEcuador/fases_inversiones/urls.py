from django.conf.urls import url
from django.urls import include, path
from . import views

# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'aceptar_inversion/', views.Proceso_aceptar_inversion.as_view(), name="aceptar-inversion"),
    path('completa_datos/', views.completar_datos_financieros_view, name="completa_datos"),
    path('declaracion_fondos/', views.declaracion_fondos_view, name="declaracion_fondos"),
    path('aceptar_declaracion_fondos/', views.aceptar_declaracion_fondos.as_view(), name="aceptar_declaracion_fondos"),
    path('', views.get_inversiones),
# Wire up our API using automatic URL routing.
]
