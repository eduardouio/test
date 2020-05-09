from django.shortcuts import render
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from django.http import HttpResponse


from . import models
from registro_inversionista.models import Usuario
from solicitudes.models import Solicitud


#ibrerias para crear pdf
import io
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.rl_config import defaultPageSize
from reportlab.lib import colors



from reportlab.platypus import Table, Paragraph, Spacer, TableStyle




from reportlab.lib.styles import getSampleStyleSheet

# Create your views here.
class Proceso_aceptar_inversion(generics.CreateAPIView):

    #permission_classes =[permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):



        if('datos_tabla' in request.data):


            data = [ ["Cuota", "Pago", "Comision", "Comision Iva", "Ganancia" ]]+request.data.get('datos_tabla')




            # Create a file-like buffer to receive PDF data.
            buffer = io.BytesIO()

            # Create the PDF object, using the buffer as its "file."
            p = canvas.Canvas(buffer, pagesize=letter)
            width, height = letter #keep for later


            # textobject = p.beginText()
            # textobject.setTextOrigin(200, 680)
            # textobject.textLine('Title')
            # p.drawText(textobject)

            width = 1000
            height = 1000
            x = 100
            y = 300
            f = Table(data, colWidths=75, rowHeights=25)
            
            f.setStyle(TableStyle(
                                [('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                 ('BOX', (0, 0), (-1, -1), 0.5, colors.black),
                                 ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
                                 ('BACKGROUND', (0, 0), (-1, 0), colors.gray)]))
            f.wrapOn(p, width, height)
            f.drawOn(p, x, y)


            # Close the PDF object cleanly, and we're done.
            p.showPage()
            p.save()

            # FileResponse sets the Content-Disposition header so that browsers
            # present the option to save the file.
            buffer.seek(0)
            return FileResponse(buffer, as_attachment=True, filename='hello.pdf')

            

        #Inversion
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

        response_data = {
                "mensaje": "Datos enviados con exito"

        }

        return Response(response_data, status=status.HTTP_200_OK, )


    def get(self, request, *args, **kwargs):
        return render(request,"fases_inversiones/fase2.html")
