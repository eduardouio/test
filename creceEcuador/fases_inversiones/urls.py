from django.conf.urls import url
from django.urls import include, path
from . import views

# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'fase2/', views.Proceso_aceptar_inversion.as_view(), name="aceptar-inversion"),
    path('', views.get_inversiones),
# Wire up our API using automatic URL routing.
]
