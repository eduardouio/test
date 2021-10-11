from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.storage import FileSystemStorage
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
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
from django.contrib.contenttypes.models import ContentType


from . import models
from . import serializers

from manager_archivos.models import TransferenciaInversion

#confirmacion de email
from .forms import SignupForm, Encuesta_form, Login_form
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage
from django.utils.html import strip_tags
from log_acciones.models import EventoInversionista, EventoUsuario

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



class FirmarContratoAcUso(generics.CreateAPIView):
    """
    inversionista/firma_contrato_ac_uso/
    """
    
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        nombres = request.data.get("nombres").title()
        apellidos = request.data.get("apellidos").title()
        cedula = request.data.get("cedula")

        guardar_contrato_ac_uso(nombres,apellidos,cedula)

        response = HttpResponse(status=status.HTTP_200_OK)   

        return response

    

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
        fecha_nacimiento = request.data.get("fecha_nacimiento")

        encuesta = request.data.get("encuesta")

        preguntas = encuesta.get("preguntas")
        respuestas = encuesta.get("respuestas")

        date = datetime.datetime.now()


        if User.objects.filter(username=usuario).exists():
            data_response = {
                                "mensaje": "El Correo electrónico "+ usuario +" ya existe",
                                "tipo_error": "email",
                            }

            return Response(data_response, status=status.HTTP_400_BAD_REQUEST)

        else:

            new_user = User( username=usuario, password=password, 
                                email=email, first_name=nombres, last_name=apellidos,
                            )
            new_user.set_password(password)
            new_user.is_active = False
            
            try:
                 canton = models.Canton.objects.get(nombre=nombre_canton.upper())
            except models.Canton.DoesNotExist:
                diccionario_respuesta = {
                    'mensaje': "Ciudad fuera de los límites permitidos. Por favor ingresa una ciudad dentro de Ecuador.",
                    'tipo_error': "canton"
                }
                return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=400)


            new_usuario = models.Usuario(usuario=usuario, nombres=nombres, apellidos=apellidos, 
                                            email=email, celular=celular, tipo_persona=tipo_persona, 
                                            canton=canton, cedula=cedula, user=new_user, fecha_nacimiento=fecha_nacimiento)
            new_user.save()
            new_usuario.save()

            guardar_contratos(nombres,apellidos,cedula, new_usuario)


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
                        mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
            )
            email.content_subtype = "html"
            email.send()

            EventoUsuario.objects.create(accion="register", usuario=new_usuario)

            response = HttpResponse(status=status.HTTP_200_OK)   

            return response
    def get(self, request, *args, **kwargs):
        return render(request, 'registro_inversionista/registro.html')


def guardar_contratos(nombres,apellidos,cedula, usuario_creado):
    #Guardar archivo pdf en nuestro servidor
    out_filedir = './creceEcuador/static/contratos/'
    if not os.path.exists(out_filedir):
        os.makedirs(out_filedir)

    out_filename = "Acuerdo-Uso-Sitio-"+nombres+"-"+apellidos+"-"+cedula+"-v"+".pdf"
    ultimoAcUso = models.VersionContrato.objects.filter(tipoContrato="ac_uso")
    
    if ultimoAcUso:
        ultimoAcUso= ultimoAcUso.latest('fecha')
        out_filename = "Acuerdo-Uso-Sitio-"+nombres+"-"+apellidos+"-"+cedula+"-v"+ultimoAcUso.version+".pdf"
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

        ruta_archivo = '/static/contratos/'+out_filename
        models.Contrato.objects.create(contrato= ruta_archivo,content_object=usuario_creado, versionContrato=ultimoAcUso)
        models.Contrato.objects.create(contrato= '/static/contratos/Terminos-Legales-y-Condiciones.pdf',content_object=usuario_creado)
        models.Contrato.objects.create(contrato= '/static/contratos/Politicas-de-Privacidad.pdf',content_object=usuario_creado)
        usuario_creado.contratoAcUsoFirmado = True
        usuario_creado.save()

    
    
    
    
    


def guardar_contrato_ac_uso(nombres,apellidos,cedula):
    #Guardar archivo pdf en nuestro servidor
    out_filedir = './creceEcuador/static/contratos/'
    if not os.path.exists(out_filedir):
        os.makedirs(out_filedir)

    ultimoAcUso = models.VersionContrato.objects.filter(tipoContrato="ac_uso").latest('fecha')

    usuario = models.Usuario.objects.filter(cedula=cedula)[0]

    if(not usuario.contratoAcUsoFirmado):
        out_filename = "Acuerdo-Uso-Sitio-"+nombres+"-"+apellidos+"-"+cedula+"-v"+ultimoAcUso.version+".pdf"
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

        ruta_archivo = '/static/contratos/'+out_filename
        models.Contrato.objects.create(contrato= ruta_archivo,content_object=usuario, versionContrato=ultimoAcUso)

        usuario.contratoAcUsoFirmado = True
        usuario.save()

def guardar_contrato_ac_uso(nombres,apellidos,cedula):
    #Guardar archivo pdf en nuestro servidor
    out_filedir = './creceEcuador/static/contratos/'
    if not os.path.exists(out_filedir):
        os.makedirs(out_filedir)

    ultimoAcUso = models.VersionContrato.objects.filter(tipoContrato="ac_uso").latest('fecha')

    usuario = models.Usuario.objects.filter(cedula=cedula)[0]

    if(not usuario.contratoAcUsoFirmado):
        out_filename = "Acuerdo-Uso-Sitio-"+nombres+"-"+apellidos+"-"+cedula+"-v"+ultimoAcUso.version+".pdf"
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

        ruta_archivo = '/static/contratos/'+out_filename
        models.Contrato.objects.create(contrato= ruta_archivo,content_object=usuario, versionContrato=ultimoAcUso)

        usuario.contratoAcUsoFirmado = True
        usuario.save()

def confirmar_email(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        usuarioAutenticado = models.Usuario.objects.filter(user=user)[0]
        EventoUsuario.objects.create(accion="email_conf", usuario=usuarioAutenticado)
        login(request, user)
        enviar_email_registro_validado(user, user.username)

        return redirect('/inversionista/dashboard/?from_email=True')
    else:
        return HttpResponse('Link de activación inválido!')

def enviar_email_registro_validado(usuario, email):
    mail_subject = 'Activa tu cuenta de CRECE'
    message = render_to_string('registro_inversionista/registro_validado.html', {
        'usuario': usuario,
    })
    plain_message = strip_tags(message)
    to_email = email
    email = EmailMessage(
                mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
    )
    email.content_subtype = "html"
    email.send()


class Proceso_formulario_inversion(generics.CreateAPIView):
    """
    inversionista/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        try:
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
            nombre_cuenta = request.data.get("nombre_cuenta")

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
        except Exception as e:
            return Response({"mensaje": str(e)},status=status.HTTP_400_BAD_REQUEST,)


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
            #log de accion
            usuarioAutenticado = models.Usuario.objects.filter(user=user)[0]
            EventoUsuario.objects.create(accion="login", usuario=usuarioAutenticado)

            r = requests.post(request.headers['Origin']+'/api/token/', data = {'username':username, 'password': password})
            print("ERROR HERE >")
            print(str(r))
            status_send = status.HTTP_200_OK
            dic_tokens = {}
            try:
              dic_tokens = r.json()
            except json.decoder.JSONDecodeError:
              print('JSON DECODE ERROR')

            mensaje = "Ingreso exitoso"
            if (r.status_code == 401 and not user.is_active):
                status_send = status.HTTP_401_UNAUTHORIZED
                mensaje = "El usuario no ha sido activado aún. Para enviar correo electrónico de confirmación, haga click <a onclick='reenviar_confirmacion_email()' email="+username+" id='crece-link-confirmar-registro'>Aquí</a>"
            usuario = serializers.UserSerializer(user,
                                                 context=self.get_serializer_context()).data

            diccionario_respuesta = {
                'status': status_send,
                'mensaje': mensaje,
                'auth_token':dic_tokens
            }
            response = HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=status_send)   
            response.set_cookie('auth_token', json.dumps(dic_tokens),
                        max_age=None, expires=None, path='/', domain=None, secure=False, httponly=True)
            login(request, user)
            return response
            #return Response({'tokens':dic_tokens, 'user':usuario},  status=status.HTTP_200_OK) 

        diccionario_respuesta = {
                'status': status.HTTP_401_UNAUTHORIZED,
                'mensaje': "Usuario o contraseña incorrectos"
            }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            usuario = models.Usuario.objects.filter(user=request.user)[0]
            return redirect(request, 'registro_inversionista/dashboard_inversionista.html', {"usuario":usuario})
        else:
            print(request.user)
            return render(request, 'registro_inversionista/login.html')

class ImagenPerfilView(APIView):        
    parser_classes = (MultiPartParser, )
    def post(self, request, filename, format=None):
        try: 
            file_obj = request.data['img']
            url_base = settings.MEDIA_ROOT +"/profile_pic/"+filename

            if not os.path.exists(settings.MEDIA_ROOT +"/profile_pic/"):
                os.makedirs(settings.MEDIA_ROOT +"/profile_pic/")

            cedula = filename.split(".")[0]

            inversionista = models.Usuario.objects.filter(cedula=cedula)[0]

            with open(url_base, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
            
            inversionista.profile_pic_ruta = "/"+settings.MEDIA_URL +"profile_pic/"+filename

            inversionista.save()

            diccionario_respuesta = {
                'status': status.HTTP_200_OK,
                'data': {
                    'mensaje': "Imagen guardada",
                    'ruta': inversionista.profile_pic_ruta
                }
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
class reenviar_confirmacion_registro(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        try:
            inversionista = User.objects.get(username=username)
            if not inversionista.is_active:
                current_site = get_current_site(request)
                mail_subject = 'Activa tu cuenta de CRECE'
                message = render_to_string('registro_inversionista/acc_active_email.html', {
                    'usuario': inversionista,
                    'domain': current_site.domain,
                    'uid':urlsafe_base64_encode(force_bytes(inversionista.pk)),
                    'token':account_activation_token.make_token(inversionista),
                })
                plain_message = strip_tags(message)
                to_email = username
                email = EmailMessage(
                            mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
                )
                email.content_subtype = "html"
                email.send()

                response = HttpResponse(status=status.HTTP_200_OK)   

                return response

        except User.DoesNotExist:
            diccionario_respuesta = {
                'status': status.HTTP_404_NOT_FOUND,
                'message': MENSAJE_NOT_FOUND,
                'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
        


class ImagenCedulaView(APIView):        
    parser_classes = (MultiPartParser, )
    def post(self, request, filename, format=None):
        try: 
            file_obj = request.data['img']
            url_base = settings.MEDIA_ROOT +"/cedula/"+filename

            if not os.path.exists(settings.MEDIA_ROOT +"/cedula/"):
                os.makedirs(settings.MEDIA_ROOT +"/cedula/")

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
            id_inversion = request.POST.get("id_inversion", "")
            count_objects = TransferenciaInversion.objects.filter(id_inversion= id_inversion, estado=0).count()
            print("count objects: "+str(count_objects))
            if(count_objects > 0):
                
                transferencia_obtenida = TransferenciaInversion.objects.filter(id_inversion= id_inversion, estado=0).latest('fecha_creacion')
                transferencia_serializer = TransferenciaInversionArchivoSerializer(transferencia_obtenida, data=request.data, partial=True)
                print(transferencia_serializer)
                if transferencia_serializer.is_valid():
                    transferencia = transferencia_serializer.save()
                    diccionario_respuesta = {
                        'status': status.HTTP_200_OK,
                        'mensaje': "Archivo guardado"
                    }

                    return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')
                else:
                    raise Exception(transferencia_serializer.errors)

            else:
                transferencia_serializer = TransferenciaInversionArchivoSerializer(data=request.data)
                print(transferencia_serializer)
                if transferencia_serializer.is_valid():
                    transferencia = transferencia_serializer.save()
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

@api_view(['GET'])
def get_contratos(request, pk):
    usuario = models.Usuario.objects.get(pk=pk)

    ct = ContentType.objects.get_for_model(usuario)
    contratos = models.Contrato.objects.filter(content_type=ct, object_id=usuario.pk).order_by('-fecha')

    serializer = serializers.ContratoSerializer(contratos, many=True)

    diccionario_respuesta = {
        'status': status.HTTP_200_OK,
        'data': serializer.data
    }

    return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

@api_view(['GET'])
def get_ultimo_contrato_ac_uso(request, pk):
    usuario = models.Usuario.objects.get(pk=pk)

    ct = ContentType.objects.get_for_model(usuario)
    ultimaVersionContrato = models.VersionContrato.objects.filter(tipoContrato="ac_uso").latest('fecha')
    contrato = models.Contrato.objects.filter(content_type=ct, object_id=usuario.pk, versionContrato=ultimaVersionContrato).latest('fecha')

    serializer = serializers.ContratoSerializer(instance=contrato)

    diccionario_respuesta = {
        'status': status.HTTP_200_OK,
        'data': serializer.data
    }

    return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

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


        
@login_required
def logout_view(request):
    if request.user.is_authenticated:
        usuario = models.Usuario.objects.filter(user=request.user)[0]
        EventoUsuario.objects.create(accion="logout", usuario=usuario)
    logout(request)

    return redirect('/inversionista/login/')


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

class restablecer_password(generics.CreateAPIView):
    """
    inversionista/login/

    Este Login es el verdadero API Endpoint para verificar el usuario 
    """

    def post(self, request, *args, **kwargs):
        
        username = request.data.get("username", "")
        try:
            inversionista = User.objects.get(username=username) 
            diccionario_respuesta = {
                'status': status.HTTP_200_OK,
            }
            inversionista.is_active = False
            inversionista.save()
            current_site = get_current_site(request)
            mail_subject = 'Restablece tu contraseña - CRECE'
            message = render_to_string('registro_inversionista/restablecer_password_email.html', {
                'usuario': inversionista,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(inversionista.pk)),
                'token':account_activation_token.make_token(inversionista),
            })
            plain_message = strip_tags(message)
            to_email = username
            email = EmailMessage(
                        mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
            )
            email.content_subtype = "html"
            email.send()
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

        except User.DoesNotExist:
            diccionario_respuesta = {
                'status': status.HTTP_404_NOT_FOUND,
                'message': "Usuario no encontrado",
                'data': {}
            }
            return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
             


    def get(self, request, *args, **kwargs):
        return render(request, 'registro_inversionista/restablecer_password.html')

def confirmar_email_restablecer_password(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):

        return render(request, 'registro_inversionista/restablecer_password_confirmar.html', {'usuario':user})
    else:
        return HttpResponse('Link de activación inválido!') 


class confirmar_restablecer_password_view(APIView):
    """
    inversionista/login/

    Este Login es el verdadero API Endpoint para verificar el usuario 
    """
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")
        new_pass = request.data.get("password")
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.set_password(new_pass)
            usuario = models.Usuario.objects.filter(user=user)[0]
            EventoUsuario.objects.create(accion="rec_contrasena", usuario=usuario)
            user.is_active = True
            user.save()
            
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


    def get(self, request, *args, **kwargs):
        return render(request, 'registro_inversionista/restablecer_password_confirmar.html')

class cambiar_password(generics.CreateAPIView):
    """
    inversionista/login/

    Este Login es el verdadero API Endpoint para verificar el usuario 
    """
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        print(request)
        usuario = models.Usuario.get_usuario(request)
        new_pass = request.data.get("password")
        user = User.objects.get(username=usuario.user)
        user.set_password(new_pass)
        user.save()
        login(request, user)

        diccionario_respuesta = {
                'status': status.HTTP_200_OK,
                'message': "Exito",
                'data': {}
            }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=status.HTTP_200_OK)


@api_view(['POST'])
def encuesta_preferencia_persona(request):
    try:
        pk = request.data.get("inversionista")
        lista_respuestas = request.data.get("lista_respuestas")
        usuario = models.Usuario.objects.get(pk=pk) 
        date = datetime.datetime.now()
        for pk_respuesta in lista_respuestas:
            respuesta = models.Respuesta.objects.get(pk=pk_respuesta)
            pk_pregunta = str(pk_respuesta)[0]
            pregunta = models.Pregunta.objects.get(pk=pk_pregunta)
            encuesta = models.Encuesta(id_pregunta= pregunta, id_respuesta=respuesta, id_usuario=usuario, fecha=date)
            encuesta.save()
      

        diccionario_respuesta = {
            'status': status.HTTP_200_OK,
        }

        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json')

    except models.Usuario.DoesNotExist:
        diccionario_respuesta = {
            'status': status.HTTP_404_NOT_FOUND,
            'message': MENSAJE_NOT_FOUND,
            'data': {}
        }
        return HttpResponse(json.dumps(diccionario_respuesta), content_type='application/json', status=404)
