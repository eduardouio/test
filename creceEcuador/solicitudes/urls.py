from django.conf.urls import include, url
from django.views import generic
from . import views
from django.urls import path

urlpatterns = [
    path('', views.get_solicitudes)
]
