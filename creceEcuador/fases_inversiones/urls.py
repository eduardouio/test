from django.conf.urls import url
from django.urls import include, path
from . import views

# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'fase2/', views.Proceso_aceptar_inversion.as_view(), name="aceptar-inversion"),
    path('completa_datos/', views.completar_datos_financieros_view, name="completa_datos"),
    path('', views.get_inversiones),
# Wire up our API using automatic URL routing.
]
