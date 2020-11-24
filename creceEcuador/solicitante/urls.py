from django.conf.urls import url
from django.urls import include, path
from rest_framework import routers
from . import views
from django.views.generic.base import TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.RegisterSolicitudTemporal.as_view(), name="registro_solicitud"),
    path('registro_solicitud/', views.RegisterSolicitudTemporal.as_view(), name="registro_solicitud"),
]
