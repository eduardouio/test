from django.shortcuts import render
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required

from .serializers import InversionSerializer, InversionTransferenciaSerializer, PagoDetalleSerializer, \
    PagosTaSupuestaSerializer
from . import models
from registro_inversionista.models import Usuario
from solicitudes.models import Solicitud
import json
import os

from registro_inversionista.models import Contrato

from django.conf import settings


#ibrerias para crear pdf
import io
import datetime
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, Paragraph, Spacer, TableStyle

from .types import INICIO_DEFAULT, INICIO_KEY, CANTIDAD_DEFAULT, CANTIDAD_KEY, FASE_KEY, FASES_INVERSION, MENSAJE_BAD_REQUEST, INVERSIONISTA_KEY
#Contrato
from .declaracion_fondos import TITULO_CONTRATO, PERSONA_NATURAL, DECLARACIONES, CONTRATO_FOOTER, FIRMA_CONTRATO


from reportlab.platypus import Table, Paragraph, Spacer, TableStyle




from reportlab.lib.styles import getSampleStyleSheet
from .types import COMISION_ADJUDICACION_FACTOR, ADJUDICACION_FACTOR, COMISION_BANCO, COMISION_COBRANZA_INSOLUTO_MENSUAL, IVA

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
        id_solicitud = dic_inversion.get("id_solicitud")
        adjudicacion = dic_inversion.get("adjudicacion")
        adjudicacion_iva = dic_inversion.get("adjudicacion_iva")
        inversion_total = dic_inversion.get("inversion_total")
        ganancia_total = dic_inversion.get("ganancia_total")
        id_usuario = dic_inversion.get('id_inversionista')


        #nueva inversion
        solicitud = Solicitud.objects.get(id=id_solicitud)
        usuario = models.Usuario.objects.get(idUsuario=id_usuario)
        new_inversion = models.Inversion(id_user=usuario, id_solicitud=solicitud, monto=monto,
                                        adjudicacion=adjudicacion, adjudicacion_iva=adjudicacion_iva,
                                        inversion_total=inversion_total, ganancia_total=ganancia_total)
        actualizar_datos_inversion(new_inversion,solicitud)
        new_inversion.save()
        new_inversion.start()
        new_inversion.step_two()
        new_inversion.save()


        #pago_detalle


        response_data = {
                "mensaje": "Datos enviados con exito",
                "id_inversion": new_inversion.id


        }

        return Response(response_data, status=status.HTTP_200_OK, )


    def get(self, request, *args, **kwargs):
        return render(request,"fases_inversiones/aceptar_inversion.html")


@api_view(['GET'])
def get_inversiones(request):
    #obtener la data del request
    request_data = request.GET
    print(request.GET)
    #Setear la data del request si se encuentra
    #Si no se encuentra setear el default
    if FASE_KEY in request_data and INVERSIONISTA_KEY in request_data:

        fase_request = request_data[FASE_KEY]
        inversionista = request_data[INVERSIONISTA_KEY]

        inicio = INICIO_DEFAULT
        if INICIO_KEY in request_data:
            if int(request_data[INICIO_KEY]) >= 0 :
                inicio = int(request_data[INICIO_KEY])

        cantidad = CANTIDAD_DEFAULT
        if CANTIDAD_KEY in request_data:
            if int(request_data[CANTIDAD_KEY]) >= 0 :
                cantidad = int(request_data[CANTIDAD_KEY])

        #Se obtiene el queryset y se lo convierte a json
        #Se agrega el - antes del atributo para ordenarlo descendientemente
        try:
            if cantidad>0:
                #Se setea el indice del ultimo registro
                final = inicio + cantidad
                queryset = models.Inversion.objects.filter(id_user=inversionista, fase_inversion__in=FASES_INVERSION[fase_request]).order_by('-id_solicitud__fecha_publicacion')[inicio:final]
            else:
                queryset = models.Inversion.objects.filter(id_user=inversionista, fase_inversion__in=FASES_INVERSION[fase_request]).order_by('-id_solicitud__fecha_publicacion')
        except KeyError:
            diccionario_respuesta = {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': MENSAJE_BAD_REQUEST,
            'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=400)

        serializer = InversionSerializer(queryset, many=True)

        #Se crea el diccionario de respuesta
        diccionario_respuesta = {
            'inicio': 0,
            'cantidad': 10,
            'data': serializer.data
        }

        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    else:
        diccionario_respuesta = {
            'status': status.HTTP_400_BAD_REQUEST,
            'message': MENSAJE_BAD_REQUEST,
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=400)

@login_required
def completar_datos_financieros_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            usuario = models.Usuario.objects.filter(user=request.user)[0]
            return render(request, 'fases_inversiones/completa_datos.html', {"usuario":usuario})


@login_required
def declaracion_fondos_view(request):
    if request.method == 'GET' and request.user.is_authenticated:
        print(request.user)
        usuario = models.Usuario.objects.get(user=request.user)
        return render(request, 'fases_inversiones/declaracion_fondos.html',{"usuario": usuario})


def current_date_format(date):
    months = ("Enero", "Febrero", "Marzo", "Abri", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
    day = date.day
    month = months[date.month - 1]
    year = date.year
    fecha = "{} de {} del {}".format(day, month, year)

    hora = format_dos_digitos(date.hour)+':'+ format_dos_digitos(date.minute)
    return (hora, fecha)

def format_dos_digitos(entero):
    return str(entero) if entero > 9 else "0"+str(entero)

class aceptar_declaracion_fondos(generics.CreateAPIView):
    def post(self, request):
        id_inversionista = request.data.get("id_inversionista")
        usuario = models.Usuario.objects.get(idUsuario=id_inversionista)
        date = datetime.datetime.utcnow() - datetime.timedelta(hours=5)
        hora, fecha = current_date_format(date)
        # Create a file-like buffer to receive PDF data.
        buffer = io.BytesIO()

        width, height = letter

        doc = SimpleDocTemplate(buffer,pagesize=letter,
                        rightMargin=72,leftMargin=72,
                        topMargin=72,bottomMargin=18)
        hacer_contrato(doc, usuario, fecha, hora)

        buffer.seek(0)

        ruta_contrato = settings.STATIC_URL_COMPLETA+"/contratos/Declaracion-Origen-Fondos-"+ usuario.cedula+ ".pdf"
        if(not os.path.isfile(ruta_contrato)):
            Contrato.objects.create(contrato= ruta_contrato,content_object=usuario)

        with open( settings.STATIC_URL_COMPLETA+"/contratos/Declaracion-Origen-Fondos-"+ usuario.cedula+ ".pdf", "wb") as f:
            f.write(buffer.getbuffer())

        buffer.seek(0)
        return Response(status=status.HTTP_200_OK,)


def hacer_contrato(doc, usuario, fecha, hora):
    styles=getSampleStyleSheet()
    #Titulo
    Story=[Paragraph(TITULO_CONTRATO, styles['Title'])]
    Story.append(Spacer(1, 0.2*inch))
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))

    #Texto dependiendo que tipo de persona es
    persona_texto = PERSONA_NATURAL.format(nombre=usuario.nombres+" "+usuario.apellidos, cedula=usuario.cedula)
    ptext = '<font size="12">'+persona_texto+'</font>'
    Story.append(Paragraph(ptext, styles["Justify"]))
    Story.append(Spacer(1, 0.2*inch))

    #declaraciones
    for i in range(len(DECLARACIONES)):
        ptext = '<font size="12">'+DECLARACIONES[i]+'</font>'
        Story.append(Paragraph(ptext, styles["Justify"]))
        Story.append(Spacer(1, 0.2*inch))

    #Final del contrato
    ptext = '<font size="12">'+CONTRATO_FOOTER+'</font>'
    Story.append(Paragraph(ptext, styles["Justify"]))
    Story.append(Spacer(1, 0.2*inch))
    Story.append(Spacer(1, 0.2*inch))
    Story.append(Spacer(1, 0.2*inch))



    #Firma y datos del inversionista
    ptext = '<font size="12">'+FIRMA_CONTRATO.format(nombre=usuario.nombres+" "+usuario.apellidos, hora=hora,fecha=fecha) +'</font>'
    Story.append(Paragraph(ptext, styles["Justify"]))


    doc.build(Story)

@login_required
def subir_transferencia_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            id_inversion = request.GET.get('id_inversion', '')
            if id_inversion:
                inversion = models.Inversion.objects.get(pk=id_inversion)
                if inversion.id_user.user == request.user:
                    return render(request, 'fases_inversiones/subir_transferencia.html', {"inversion":inversion})

@login_required
def fase_final_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return render(request, 'fases_inversiones/fase_final.html', {})

@api_view(['POST'])
def step_three_inversion(request):
    id_inversion = request.GET.get('id_inversion', '')
    try:
        inversion = models.Inversion.objects.get(pk=id_inversion)
        inversion.step_three()
        inversion.save()
        return HttpResponse(json.dumps({}), content_type='application/json')
    except Exception as e:
        print("step_three_inversion exception")
        print(e)
        return HttpResponse(json.dumps({}), content_type='application/json', status=500)

@api_view(['POST'])
def step_four_inversion(request):
    id_inversion = request.GET.get('id_inversion', '')
    try:
        inversion = models.Inversion.objects.get(pk=id_inversion)
        inversion.step_four()
        inversion.save()
        return HttpResponse(json.dumps({}), content_type='application/json')
    except:
        return HttpResponse(json.dumps({}), content_type='application/json', status=500)

@api_view(['POST'])
def validate_transfer_inversion(request):
    id_inversion = request.GET.get('id_inversion', '')
    try:
        inversion = models.Inversion.objects.get(pk=id_inversion)
        inversion.validate_transfer()
        inversion.save()
        return HttpResponse(json.dumps({}), content_type='application/json')
    except:
        return HttpResponse(json.dumps({}), content_type='application/json', status=500)


@api_view(['GET'])
def get_inversion_individual(request, pk):
    try:
        inversion = models.Inversion.objects.get(pk=pk) #get_object_or_404(Solicitud, pk=pk)

        serializer = InversionTransferenciaSerializer(instance=inversion)

        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': serializer.data
        }

        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Inversion.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Inversion no encontrada",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
        #raise Http404(json.dumps({'status':404}))

@api_view(['GET'])
def get_inversion_usuario(request, id_solicitud, id_inversionista):
    try:
        inversion_count = models.Inversion.objects.filter(id_user=id_inversionista, id_solicitud=id_solicitud).count()

        if (inversion_count > 0):
            inversion = models.Inversion.objects.filter(id_user=id_inversionista, id_solicitud=id_solicitud).latest('fecha_creacion')

            lista_fase = ['OPEN', 'FILL_INFO', 'CONFIRM_INVESTMENT', 'ORIGIN_MONEY', 'PENDING_TRANSFER', 'TRANSFER_SUBMITED','TO_BE_FUND']

            print("fase inversion: "+ inversion.fase_inversion)
            if(inversion.fase_inversion in lista_fase):
                serializer = InversionSerializer(instance=inversion)

                diccionario_respuesta = {
                    'status': status.HTTP_200_OK,
                    'data': serializer.data
                }

                return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

        diccionario_respuesta = {
            'status': status.HTTP_200_OK
        }

        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Inversion.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Inversion no encontrada",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
        #raise Http404(json.dumps({'status':404}))

@api_view(['GET'])
def get_inversiones_por_inversionista(request, pk):
    try:
        inversionista = models.Usuario.objects.get(pk=pk) #get_object_or_404(Solicitud, pk=pk)
        lista_inversiones =  models.Inversion.objects.filter(id_user = inversionista.idUsuario)
        # serializer = UsuarioSerializer(instance=inversionista)
        inversiones_usuario = []

        for inversion in lista_inversiones:
            inversion_i = models.Inversion.objects.get(id=inversion.id)
            serializer = InversionSerializer(instance=inversion_i)
            inversiones_usuario.append(serializer.data)

        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': inversiones_usuario
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Usuario.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Usuario no encontrado",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)


@api_view(['GET'])
def get_pagos_inversionista(request, id_inversion):
    try:
        lista_pagos_detalles = models.Pagos_ta_supuesta.objects.filter(id_inversion=id_inversion) #get_object_or_404(Solicitud, pk=pk)
        inversion = models.Inversion.objects.get(id=id_inversion)
        adjudicacion_total = round(inversion.adjudicacion + inversion.adjudicacion_iva, 2)
        pagos_inversionista = []
        for pago in lista_pagos_detalles:
            pago_i = models.Pagos_ta_supuesta.objects.get(id=pago.id)
            serializer = PagosTaSupuestaSerializer(instance=pago_i)
            pagos_inversionista.append(serializer.data)

        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': {'lista_pagos':pagos_inversionista, 'adjudicacion_total': adjudicacion_total,
                        'monto': inversion.monto}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Pagos_ta_supuesta.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Pagos no encontrados",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)

@api_view(['GET'])
def get_detalles_inversion_vigente(request, id_inversion):
    try:
        lista_pagos_detalles = models.Pagos_ta_supuesta.objects.filter(id_inversion=id_inversion) #get_object_or_404(Solicitud, pk=pk)
        print(lista_pagos_detalles)
        if len(lista_pagos_detalles) > 0:
            inversion = models.Inversion.objects.get(id=id_inversion)
            intereses_pagados = 0
            capital_cobrado = 0
            contador = 0
            index_ultimo_pago = 0
            monto_vencimiento = 0
            interes_vencimiento = 0
            for pago in lista_pagos_detalles:
                pago_i = models.Pagos_ta_supuesta.objects.get(id=pago.id)
                capital_i = pago_i.pago
                interes_i = pago_i.intereses_previos
                if (pago_i.estado == 1):
                    index_ultimo_pago = contador + 1
                    intereses_pagados += interes_i
                    capital_cobrado += capital_i
                contador += 1
            intereses_pagados = round(intereses_pagados,2)
            capital_cobrado = round(capital_cobrado,2)
            capital_vencimiento = 0
            interes_vencimiento = 0
            monto_vencimiento = 0
            if(index_ultimo_pago == len(lista_pagos_detalles)):
                proximo_pago = lista_pagos_detalles[index_ultimo_pago-1]
            else:
                proximo_pago = lista_pagos_detalles[index_ultimo_pago]
                serializer = PagosTaSupuestaSerializer(instance=proximo_pago)
                next_ganancia = serializer.data.get("ganancia")
                next_capital = serializer.data.get("capital")
                capital_vencimiento = next_capital
                interes_vencimiento = serializer.data.get("intereses_previos")
                monto_vencimiento = next_ganancia
            serializer = PagosTaSupuestaSerializer(instance=proximo_pago)
            proxima_fecha_pago = serializer.data.get("fecha")
            monto_vencimiento = round(monto_vencimiento,2)
            capital_vencimiento = round(capital_vencimiento,2)
            interes_vencimiento = round(interes_vencimiento,2)
            diccionario_respuesta = {
                'status': status.HTTP_200_OK,
                'data': {"intereses_ganados":intereses_pagados, "capital_cobrado":capital_cobrado, "proxima_fecha_pago":proxima_fecha_pago,
                        "monto_vencimiento":monto_vencimiento, "capital_vencimiento":capital_vencimiento, "interes_vencimiento": interes_vencimiento}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')
        else:
            diccionario_respuesta = {
                'status': status.HTTP_404_NOT_FOUND,
                'message': "Pagos no encontrados",
                'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)

    except models.Pagos_ta_supuesta.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Pagos no encontrados",
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)

@api_view(['POST'])
def cambiar_monto_inversion(request):
    id_inversion = request.data.get('id_inversion')
    monto  = request.data.get('monto_cambiar')

    inversion = models.Inversion.objects.get(id=id_inversion)
    solicitud = inversion.id_solicitud
    inversion.monto = float(monto)
    inversion.save()
    actualizar_datos_inversion(inversion, solicitud)

    diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': {"inversion_total":inversion.inversion_total}
        }
    return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')


def actualizar_datos_inversion(inversion,solicitud):
    monto_inversion = float(inversion.monto)
    monto_solicitud = float(solicitud.monto)

    ganancia_total = models.crear_pagos(inversion, solicitud, crear = False)

    participacion_inversionista = (monto_inversion/monto_solicitud)
    participacion_inversionista_porcentaje = participacion_inversionista *100
    COMISION_ADJUDICACION = monto_solicitud * COMISION_ADJUDICACION_FACTOR
    cargo_adjudicacion = COMISION_ADJUDICACION * participacion_inversionista
    cargo_adjudicacion_iva = cargo_adjudicacion * IVA
    inversion_total = monto_inversion + cargo_adjudicacion + cargo_adjudicacion_iva


    inversion.adjudicacion = cargo_adjudicacion
    inversion.adjudicacion_iva = cargo_adjudicacion_iva
    inversion.inversion_total = inversion_total
    inversion.ganancia_total = ganancia_total
    inversion.save()

@api_view(['GET'])
def get_ta_simulacion(request, id_solicitud):
    try:
        solicitud = Solicitud.objects.get(pk=id_solicitud)
        diccionario_ta_simulacion = models.crear_tabla_amortizacion(solicitud,"SIMULACION")
        fechas = diccionario_ta_simulacion["fechas"]
        for i in range(len(fechas)):
            fechas[i] = fechas[i].strftime("%Y/%m/%d")
        diccionario_ta_simulacion["fechas"] = fechas
        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': diccionario_ta_simulacion
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=200)

    except Solicitud.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Solicitud no encontrado",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)

@api_view(['GET'])
def get_consulta_pago(request, id_solicitud):
    try:
        solicitud = Solicitud.objects.get(pk = id_solicitud)



    except Solicitud.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': "Solicitud no encontrad",
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
