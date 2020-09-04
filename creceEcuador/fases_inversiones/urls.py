from django.conf.urls import url
from django.urls import include, path
from . import views

# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'aceptar_inversion/', views.Proceso_aceptar_inversion.as_view(), name="aceptar-inversion"),
    path('completa_datos/', views.completar_datos_financieros_view, name="completa_datos"),
    path('declaracion_fondos/', views.declaracion_fondos_view, name="declaracion_fondos"),
    path('aceptar_declaracion_fondos/', views.aceptar_declaracion_fondos.as_view(), name="aceptar_declaracion_fondos"),
    path('subir_transferencia/', views.subir_transferencia_view, name="subir_transferencia"),
    path('fase_final/', views.fase_final_view, name="fase_final_view"),
    path('', views.get_inversiones),
    path('<int:pk>/', views.get_inversion_individual, name='get_inversion_individual'),
    path('inversiones/<int:pk>/', views.get_inversiones_por_inversionista, name='get_inversiones_por_inversionista'),
    path('pagos/<int:id_inversion>/', views.get_pagos_inversionista, name='get_pagos_inversionista'),
    path('cambiar_monto_inversion/', views.cambiar_monto_inversion, name='cambiar_monto_inversion'),


    url('step_three_inversion/', views.step_three_inversion, name="step_three"),
    url('step_four_inversion/', views.step_four_inversion, name="step_four_inversion"),
    url('validate_transfer_inversion/', views.validate_transfer_inversion, name="validate_transfer_inversion"),
# Wire up our API using automatic URL routing.
]
