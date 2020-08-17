from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.storage import FileSystemStorage
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponse, FileResponse
from django.urls import reverse
from django.shortcuts import redirect
from rest_framework.decorators import api_view
import requests
from rest_framework.parsers import MultiPartParser
from .types import MENSAJE_NOT_FOUND, CASADO, UNION_LIBRE
from rest_framework.views import APIView
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile
from manager_archivos.serializers import TransferenciaInversionArchivoSerializer

from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.decorators.http import require_http_methods



from . import models
from . import serializers

#confirmacion de email
from .forms import SignupForm, Encuesta_form, Login_form
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage
from django.utils.html import strip_tags

import json
import io
import os
import datetime
from reportlab.pdfgen import canvas
from .creacion_contrato import hacer_contrato_uso_sitio, current_date_format
from reportlab.platypus import SimpleDocTemplate
from reportlab.lib.pagesizes import letter


class UsuariosViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer

class CantonViewSet(viewsets.ModelViewSet):
    """API endpoint that allows cantones to be viewed or edited."""
    #permission_classes =[permissions.IsAuthenticated]
    queryset = models.Canton.objects.all()
    serializer_class = serializers.CantonSerializer

class PreguntaViewSet(viewsets.ModelViewSet):
    """API endpoint that allows cantones to be viewed or edited."""
    #permission_classes =[permissions.IsAuthenticated]
    queryset = models.Pregunta.objects.all()
    serializer_class = serializers.PreguntaSerializer

class RespuestaViewSet(viewsets.ModelViewSet):
    """API endpoint that allows cantones to be viewed or edited."""
    #permission_classes =[permissions.IsAuthenticated]
    queryset = models.Respuesta.objects.all()
    serializer_class = serializers.RespuestaSerializer

class EncuestaViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    # permission_classes =[permissions.IsAuthenticated]
    queryset = models.Encuesta.objects.all()
    serializer_class = serializers.EncuestaSerializer

@api_view(['GET'])
def get_usuario(request, username):
    try:
        usuario = models.Usuario.objects.get(usuario=username) #get_object_or_404(Solicitud, pk=pk)

        serializer = serializers.UsuarioSerializer(instance=usuario)

        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': serializer.data
        }

        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Usuario.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': MENSAJE_NOT_FOUND,
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
        #raise Http404(json.dumps({'status':404}))




class Bancos_list(generics.ListAPIView):
    """
    Provides a get method handler.
    """
    queryset = models.Banco.objects.all()
    serializer_class = serializers.BancoSerializer
    permission_classes = [permissions.IsAuthenticated]



  
    

class RegisterUsers(generics.CreateAPIView):
    """
    inversionista/register/
    """
    
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        usuario = request.data.get("usuario", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        nombres = request.data.get("nombres").title()
        apellidos = request.data.get("apellidos").title()
        celular = request.data.get("celular")
        tipo_persona = request.data.get("tipo_persona")
        nombre_canton = request.data.get("canton")
        cedula = request.data.get("cedula")

        encuesta = request.data.get("encuesta")

        preguntas = encuesta.get("preguntas")
        respuestas = encuesta.get("respuestas")

        date = datetime.datetime.now()

        canton = models.Canton.objects.get(nombre=nombre_canton.upper())

        if User.objects.filter(username=usuario).exists():
            data_response = {
                                "mensaje": "El Correo electrónico "+ usuario +" ya existe",
                                "email": "email",
                            }

            return Response(data_response, status=status.HTTP_400_BAD_REQUEST)

        else:

            new_user = User( username=usuario, password=password, 
                                email=email, first_name=nombres, last_name=apellidos,
                            )
            new_user.set_password(password)
            new_user.is_active = False
            new_user.save()

            new_usuario = models.Usuario(usuario=usuario, nombres=nombres, apellidos=apellidos, 
                                            email=email, celular=celular, tipo_persona=tipo_persona, 
                                            canton=canton, cedula=cedula, user=new_user)
            new_usuario.save()
            guardar_contratos(nombres,apellidos,cedula)


            #guardando encuesta
            for i in range(len(preguntas)):
                pregunta = models.Pregunta.objects.filter(texto=preguntas[i])[0]
                respuesta = models.Respuesta.objects.filter(texto=respuestas[i])[0]
                encuesta = models.Encuesta(id_pregunta= pregunta, id_respuesta=respuesta, id_usuario=new_usuario, fecha=date)
                encuesta.save()

            current_site = get_current_site(request)
            mail_subject = 'Activa tu cuenta de CRECE'
            message = render_to_string('registro_inversionista/acc_active_email.html', {
                'usuario': new_usuario,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(new_user.pk)),
                'token':account_activation_token.make_token(new_user),
            })
            plain_message = strip_tags(message)
            to_email = email
            email = EmailMessage(
                        mail_subject, message, to=[to_email]
            )
            email.content_subtype = "html"
            email.send()



            response = HttpResponse(status=status.HTTP_200_OK)   

            return response
    def get(self, request, *args, **kwargs):
        return render(request, 'registro_inversionista/registro.html')


def guardar_contratos(nombres,apellidos,cedula):
    #Guardar archivo pdf en nuestro servidor
    out_filedir = './creceEcuador/static/contratos/'
    if not os.path.exists(out_filedir):
        os.makedirs(out_filedir)
    out_filename = "Acuerdo-Uso-Sitio-"+nombres+"-"+apellidos+"-"+cedula+".pdf"
    out_filedir = './creceEcuador/static/contratos/'
    out_filepath = os.path.join( out_filedir, out_filename )
    file_open = open(out_filepath, 'w')
    file_open.close()
    date = datetime.datetime.now()
    fecha = current_date_format(date)
    usuario_to_pdf = {'nombres': nombres, 'apellidos': apellidos, 'cedula': cedula}
    doc = SimpleDocTemplate(out_filepath,pagesize=letter,
                rightMargin=72,leftMargin=72,
                topMargin=72,bottomMargin=18)
    hacer_contrato_uso_sitio(doc, usuario_to_pdf, fecha, date)

def confirmar_email(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        inversionista = models.Usuario.objects.filter(user=user.id)[0]
        inversionista.estado = 1
        inversionista.save()
        login(request, user)

        return redirect('/inversionista/dashboard/')
    else:
        return HttpResponse('Link de activación inválido!')




class Proceso_formulario_inversion(generics.CreateAPIView):
    """
    inversionista/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        print(request.data)
        #Invesionista
        nombre = request.data.get("nombre")
        apellidos = request.data.get("apellidos")
        cedula = request.data.get("cedula")
        celular = request.data.get("celular")
        estado_civil = request.data.get("estado_civil")
        direccion_domicilio = request.data.get("direccion_domicilio")
        nombre_canton = request.data.get("canton")
        canton = models.Canton.objects.get(nombre=nombre_canton)
        provincia = request.data.get("provincia")
        telefono_domicilio = request.data.get("telefono_domicilio")

        #Principal fuente de ingresos
        fuente_ingresos = request.data.get("fuente_ingresos")
        direccion_fuente_ingresos = request.data.get("direccion_fuente_ingresos")

        nombre_canton_fuentes_ingresos = request.data.get("canton_fuentes_ingresos")
        canton_fuentes_ingresos = models.Canton.objects.get(nombre=nombre_canton_fuentes_ingresos)
        ingresos_mensuales = request.data.get("ingresos_mensuales")

        #Cuenta bancaria
        titular = request.data.get("titular")
        banco = request.data.get("banco")
        numero_cuenta = request.data.get("numero_cuenta")
        tipo_cuenta = request.data.get("tipo_cuenta")

        descripcion_ingresos = json.dumps(fuente_ingresos).upper()
        print(fuente_ingresos)
        #inversionista ****Revisar
        inversionista = models.Usuario.objects.filter(cedula=cedula)[0]

        #estado civil
        inversionista.estado_civil = estado_civil
        if estado_civil == CASADO or estado_civil == UNION_LIBRE:
            
            nombres_conyuge = request.data.get("nombres_conyuge")
            apellidos_conyuge = request.data.get("apellidos_conyuge")
            cedula_conyuge = request.data.get("cedula_conyuge")
            new_conyuge = models.Conyuge(nombres= nombres_conyuge, apellidos=apellidos_conyuge, cedula=cedula_conyuge)
            new_conyuge.save()

            inversionista.conyuge_id = new_conyuge

        print(descripcion_ingresos)
        
        new_ingresos = models.Fuente_ingresos(descripcion= descripcion_ingresos, direccion= direccion_fuente_ingresos,
                                                canton= canton_fuentes_ingresos, ingresos_mensuales=ingresos_mensuales)
        new_ingresos.save()
        
        new_banco = models.Banco(nombre=banco)
        new_banco.save()

        new_cuenta_bancaria = models.Cuenta_bancaria(numero_cuenta= numero_cuenta, tipo_cuenta= tipo_cuenta, banco= new_banco, titular=titular)
        new_cuenta_bancaria.save()
        

        #agregando al inversionista respectivo
        inversionista.celular = celular
        inversionista.canton = canton
        inversionista.provincia = provincia
        inversionista.direccion1 = direccion_domicilio
        inversionista.telefono_domicilio = telefono_domicilio
        inversionista.ingresos = new_ingresos
        inversionista.cuenta_bancaria = new_cuenta_bancaria
        inversionista.save()

        return Response({"mensaje": "Formulario enviado con exito"},status=status.HTTP_200_OK, )


class Login_Users(generics.CreateAPIView):
    """
    inversionista/login/

    Este Login es el verdadero API Endpoint para verificar el usuario 
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        
        username = request.data.get("username", "")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            r = requests.post(request.headers['Origin']+'/api/token/', data = {'username':username, 'password': password})
            dic_tokens = r.json()

            usuario = serializers.UserSerializer(user,
                                                 context=self.get_serializer_context()).data

            response = HttpResponse(json.dumps({'auth_token':dic_tokens}), content_type='application/json',  status=status.HTTP_200_OK)   
            response.set_cookie('auth_token', json.dumps(dic_tokens),
                        max_age=None, expires=None, path='/', domain=None, secure=False, httponly=True)
            login(request, user)
            return response
            #return Response({'tokens':dic_tokens, 'user':usuario},  status=status.HTTP_200_OK) 


        return Response(status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request, *args, **kwargs):

        return render(request, 'registro_inversionista/login.html')



class ImagenCedulaView(APIView):        
    parser_classes = (MultiPartParser, )
    def post(self, request, filename, format=None):
        try: 
            file_obj = request.data['img']
            url_base = settings.MEDIA_ROOT +"/cedula/"+filename

            cedula = filename.split(".")[0]

            inversionista = models.Usuario.objects.filter(cedula=cedula)[0]

            with open(url_base, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
            
            inversionista.cedula_ruta = settings.MEDIA_URL +"cedula/"+filename

            inversionista.save()

            diccionario_respuesta = {
                'status': status.HTTP_200_OK,
                'mensaje': "Imagen guardada"
            }

            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')
        #Index error quiere decir que no se encontró usuario con cédula del nombre del archivo
        except IndexError as e:
            diccionario_respuesta = {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': "Usuario no existe o nombre de archivo no tiene formato <cedula>.<extension>",
                'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=400)
        except Exception as e:
            diccionario_respuesta = {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': str(e),
                'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=400)


class SubirTransferenciaView(APIView):        
    parser_classes = (MultiPartParser, )
    def post(self, request, filename, format=None):
        try: 
            transferencia_serializer = TransferenciaInversionArchivoSerializer(data=request.data)
            print(transferencia_serializer)
            if transferencia_serializer.is_valid():
                transferencia = transferencia_serializer.save()
                print(transferencia.url_documento)
                transferencia.url_documento = settings.MEDIA_URL + str(transferencia.url_documento)
                transferencia.save()
                print(transferencia.url_documento)
                diccionario_respuesta = {
                    'status': status.HTTP_200_OK,
                    'mensaje': "Archivo guardado"
                }

                return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')
            else:
                raise Exception(transferencia_serializer.errors)

        except Exception as e:
            diccionario_respuesta = {
                'status': status.HTTP_400_BAD_REQUEST,
                'message': str(e),
                'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=400)


@login_required
def Dashboard(request):
    if request.user.is_authenticated:
        usuario = models.Usuario.objects.filter(user=request.user)[0]
        return render(request, 'registro_inversionista/dashboard_inversionista.html', {"usuario":usuario})

@login_required
def DashboardPerfil(request):
    if request.user.is_authenticated:
        usuario = models.Usuario.objects.filter(user=request.user)[0]
        return render(request, 'registro_inversionista/dashboard_perfil.html', {"usuario":usuario})

@api_view(['POST'])
def DashboardPerfilUpdate(request, pk):
    try:
        usuario = models.Usuario.objects.get(pk=pk) #get_object_or_404(Solicitud, pk=pk)

        nombre_canton = request.data.get("canton")
        celular = request.data.get("celular")  

        usuario.celular = celular    

        canton = models.Canton.objects.get(nombre=nombre_canton.upper())
        usuario.canton = canton

        usuario.save()  

        serializer = serializers.UsuarioSerializer(instance=usuario)

        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
            'data': serializer.data
        }

        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Usuario.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': MENSAJE_NOT_FOUND,
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)

@login_required
def ingresar_como(request):
    return render(request, 'registro_inversionista/ingresar_como.html', {})


        




#Login View con frontend de Django
def LoginView(request):
    """
    POST inversionista/login/

    ESTE LOGIN SOLO ES PARA FRONT END DE DJANGO CON HTML BASICO****
    """
    submitted = False
    if request.method == 'POST':
        form = Login_form(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            

            r = requests.post('http://127.0.0.1:8000/inversionista/login/', 
                                data = {'username':cd.get('username'), 'password': cd.get('password')})
            print(r.json())
            dic_tokens = r.json().get('auth_token')
            user = r.json()
            return render(request, 'registro_inversionista/dashboard_inversionista.html', 
                                    {'submitted': submitted, 'tokens': dic_tokens})
            
    else:
        form = Login_form()
        if 'submitted' in request.GET:
             submitted = True
 
    return render(request, 'registro_inversionista/login.html', {'form': form, 'submitted': submitted})

def subir_transferencia_view(request):
    if request.method == 'GET': 
        return render(request, 'registro_inversionista/subir_transferencia.html')


def aceptar_condiciones_view(request):
    if request.method == 'GET':
        return render(request, 'registro_inversionista/aceptar_condiciones.html')





@require_http_methods(["GET"])
def pdf_view_terminos_legales(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/terminos_legales.pdf', 'rb'),as_attachment=True, content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()

@require_http_methods(["GET"])
def pdf_view_privacidad_proteccion_datos(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/privacidad_proteccion_datos.pdf', 'rb'),as_attachment=True,  content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()

@require_http_methods(["GET"])
def pdf_acuerdo_uso_sitio(request):
    try:
        return FileResponse(open('creceEcuador/static/assets/ACUERDOS_ESPECIFICOS_INVERSIONISTAS.pdf', 'rb'),as_attachment=True,  content_type='application/pdf')
    except FileNotFoundError:
        raise Http404()


    

