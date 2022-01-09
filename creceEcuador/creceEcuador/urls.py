"""creceEcuador URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include
from django.views.generic.base import TemplateView
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import url
from . import views

from rest_framework_swagger.views import get_swagger_view
schema_view = get_swagger_view(title='CRECE API')


urlpatterns = [
    path('doc/', schema_view),
    path('admin/', admin.site.urls),
    path('solicitar/', include('solicitante.urls')),
    path('solicitudes/', include("solicitudes.urls")),
    path('inversionista/', include('registro_inversionista.urls')),
    path('transferencia/', include('manager_archivos.urls')),
    path('registro/', include('fases_inversiones.urls')),
    path('solicitante/', include('solicitante.urls')),

    path('', TemplateView.as_view(template_name="index.html")),
    path('invertir/', TemplateView.as_view(template_name="solicitudes.html")),
    path('invertir/detalle/', TemplateView.as_view(template_name="detalle_solicitud.html")),
    path('calculadora/', TemplateView.as_view(template_name="calculadora.html")),
    path('sri/', TemplateView.as_view(template_name="sri.html")),
    path('faq/', TemplateView.as_view(template_name="preguntas_frecuentes.html")),
    path('nosotros/', TemplateView.as_view(template_name="nosotros.html")),
    path('anunciar-solicitud/', TemplateView.as_view(template_name="anunciar_solicitud.html")),
    path('aplicar-inversionista/', TemplateView.as_view(template_name="aplicar-para-ser-inversionista.html")),

    path('terminos-legales/', views.pdf_view_terminos_legales),
    path('privacidad-proteccion-datos/', views.pdf_view_privacidad_proteccion_datos),
    path('manual-solicitante/', views.pdf_view_manual_solicitante),
    path('manual-inversionista/', views.pdf_view_manual_inversionista),

    # #para obtener Tokens
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    url(r'^ckeditor/', include('ckeditor_uploader.urls')),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
