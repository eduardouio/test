from django.urls import path
from .views import *

urlpatterns = [
    path('', TransferenciaInversionView.as_view(), name='transferencia_view'),
    path('transferencia/<int:pk>/', get_transferencia_inversion_individual, name='transferencia'),
]