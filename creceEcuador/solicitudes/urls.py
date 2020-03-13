from django.conf.urls import include, url
from django.views import generic
from . import views
from django.urls import path

urlpatterns = [
    path('', views.get_solicitudes),
    path('<int:pk>/', views.get_solicitud_individual, name='get_solicitud_individual'),
]
