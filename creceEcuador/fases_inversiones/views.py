from django.shortcuts import render
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response

from . import models
from registro_inversionista.models import Usuario
from solicitudes.models import Solicitud
# Create your views here.
class Proceso_aceptar_inversion(generics.CreateAPIView):

    permission_classes =[permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):

        #inversion
        dic_inversion = request.data.get("inversion")
        monto = dic_inversion.get("monto")
        id_user = dic_inversion.get("id_user")
        id_solicitud = dic_inversion.get("id_solicitud")
        adjudicacion = dic_inversion.get("adjudicacion")
        adjudicacion_iva = dic_inversion.get("adjudicacion_iva")
        inversion_total = dic_inversion.get("inversion_total")
        ganancia_total = dic_inversion.get("ganancia_total")

        #nueva inversion
        usuario = Usuario.objects.filter(idUsuario=id_user)[0]
        solicitud = Solicitud.objects.filter(id=id_solicitud)[0]
        new_inversion = models.Inversion(id_user=usuario, id_solicitud=solicitud, monto=monto, 
                                        adjudicacion=adjudicacion, adjudicacion_iva=adjudicacion_iva,
                                        inversion_total=inversion_total, ganancia_total=ganancia_total)
        new_inversion.save()

        #pago_detalle
        lista_pagos = request.data.get("pagos")
        for pagos in lista_pagos:
            orden = pagos.get("orden")
            fecha = pagos.get("fecha")
            pago = pagos.get("pago")
            comision = pagos.get("comision")
            comision_iva = pagos.get("comision_iva")
            ganancia = pagos.get("ganancia")

            #nuevo detalle de pago
            new_pago = models.Pago_detalle(id_inversion=new_inversion, orden=orden, fecha=fecha, 
                                            pago=pago, comision=comision, comision_iva=comision_iva, 
                                            ganancia=ganancia)
            new_pago.save()

        return Response({"mensaje": "Datos enviados con exito"},status=status.HTTP_200_OK, )
