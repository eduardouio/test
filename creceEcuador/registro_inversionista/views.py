from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect
from rest_framework.decorators import api_view
import requests


from . import models
from . import serializers

#confirmacion de email
from django.http import HttpResponse
from .forms import SignupForm, Encuesta_form, Login_form
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage

import json

# Get the JWT settings, add these lines after the import/from lines
# from rest_framework_jwt.settings import api_settings
# jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
# jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UsuariosViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer


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
        queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        usuario = request.data.get("usuario", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        nombres = request.data.get("nombres")
        apellidos = request.data.get("apellidos")
        celular = request.data.get("celular")
        tipo_persona = request.data.get("tipo_persona")


        new_user = User( username=usuario, password=password, 
                            email=email, first_name=nombres, last_name=apellidos,
                        )
        new_user.set_password(password)
        new_user.is_active = False
        new_user.save()

        new_usuario = models.Usuario(usuario=usuario, nombres=nombres, apellidos=apellidos, 
                                        email=email, celular=celular, tipo_persona=tipo_persona, user=new_user)
        new_usuario.save()
        current_site = get_current_site(request)
        mail_subject = 'Activa tu cuenta de Crece Ecuador'
        message = render_to_string('registro_inversionista/acc_active_email.html', {
            'usuario': new_usuario,
            'domain': current_site.domain,
            'uid':urlsafe_base64_encode(force_bytes(new_user.pk)),
            'token':account_activation_token.make_token(new_user),
        })
        to_email = email
        email = EmailMessage(
                    mail_subject, message, to=[to_email]
        )
        email.send()


        return Response(status=status.HTTP_200_OK)

    #     form = SignupForm(request.POST)
    #     if form.is_valid():

    #         signup(request, form)
    #         usuario = request.data.get("usuario", "")
    #         password = request.data.get("password", "")
    #         email = request.data.get("email", "")
    #         nombres = request.data.get("nombres")
    #         apellidos = request.data.get("apellidos")
    #         celular = request.data.get("celular")
    #         tipo_persona = request.data.get("tipo_persona")
    #         new_user = User.objects.filter(username=usuario)[0]
    #         models.Usuario.objects.create(usuario=usuario, nombres=nombres, apellidos=apellidos, email=email, celular=celular, tipo_persona=tipo_persona, user=new_user)
    #         return HttpResponseRedirect('?submitted=True')
    #     submitted = False
    #     encuesta_form = Encuesta_form()
    #     return render(request, 'registro_inversionista/signup.html', {'form': form, 'encuesta_form': encuesta_form, 'submitted': submitted})

    # def get(self, request, *args, **kwargs):
    #     submitted = False
    #     form = SignupForm()
    #     encuesta_form = Encuesta_form()
    #     if 'submitted' in request.GET:
    #         submitted = True
    #     return render(request, 'registro_inversionista/signup.html', {'form': form, 'encuesta_form': encuesta_form, 'submitted': submitted})


class EncuestaViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Encuesta.objects.all()
    serializer_class = serializers.EncuestaSerializer

def signup(request, form):
    #form = SignupForm(request.POST)
    usuario_input = form.save(commit=False)
    new_user = User(
        username=usuario_input.usuario, password=usuario_input.password, 
        email=usuario_input.email, first_name=usuario_input.nombres, last_name=usuario_input.apellidos,
    )
    new_user.set_password(usuario_input.password)
    new_user.is_active = False
    new_user.save()
    current_site = get_current_site(request)
    mail_subject = 'Activa tu cuenta de Crece Ecuador'
    message = render_to_string('registro_inversionista/acc_active_email.html', {
        'usuario': usuario_input,
        'domain': current_site.domain,
        'uid':urlsafe_base64_encode(force_bytes(new_user.pk)),
        'token':account_activation_token.make_token(new_user),
    })
    to_email = form.cleaned_data.get('email')
    email = EmailMessage(
                mail_subject, message, to=[to_email]
    )
    email.send()
    
def SignupView(request):
    submitted = False
    encuesta_form = Encuesta_form()
    if request.method == 'POST':

        form = SignupForm(request.POST)

        if form.is_valid():

            cd = form.cleaned_data

            r = requests.post('http://localhost:8000/inversionista/register_inversionista/', 
                                  data = {'usuario':cd.get('usuario'), 'password': cd.get('password'),
                                            'email':cd.get('email'),'nombres':cd.get('nombres'),
                                            'apellidos':cd.get('apellidos'), 'celular':cd.get('celular'),
                                            'tipo_persona':cd.get('tipo_persona')})
            return HttpResponseRedirect('?submitted=True')
            
    else:
        encuesta_form = Encuesta_form()
        form = SignupForm()
        if 'submitted' in request.GET:
             submitted = True
 
    return render(request, 'registro_inversionista/signup.html', {'form': form, 'submitted': submitted, 'encuesta_form': encuesta_form})



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

        username = user.username

        # r = requests.post('http://localhost:8000/inversionista/login_inversionista/', 
        #                          data = {'username': username, 'password': password})        
        # return render(request, 'http://127.0.0.1:8000/inversionista/dashboard/', 
        #                             {'user': user.username})
        #login(request, user)
        # return redirect('home')

        #return HttpResponse('Su usuario ha sido confirmado con!')
        return redirect('http://localhost:8000/inversionista/login/')
    else:
        return HttpResponse('Link de activación inválido!')




class Proceso_formulario_inversion(generics.CreateAPIView):
    """
    inversionista/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        #Invesionista
        nombre = request.data.get("nombre")
        apellidos = request.data.get("apellidos")
        cedula = request.data.get("cedula")
        celular = request.data.get("celular")
        conyuge = request.data.get("conyuge")
        direccion_domicilio = request.data.get("direccion_domicilio")
        ciudad = request.data.get("ciudad")
        provincia = request.data.get("provincia")
        telefono_domicilio = request.data.get("telefono_domicilio")

        #Principal fuente de ingresos
        fuente_ingresos = request.data.get("fuente_ingresos")
        direccion_fuente_ingresos = request.data.get("direccion_fuente_ingresos")
        ciudad_fuentes_ingresos = request.data.get("ciudad_fuentes_ingresos")
        ingresos_mensuales = request.data.get("ingresos_mensuales")

        #Cuenta bancaria
        banco = request.data.get("banco")
        numero_cuenta = request.data.get("numero_cuenta")
        tipo_cuenta = request.data.get("tipo_cuenta")

        descripcion_ingresos = json.dumps(fuente_ingresos).upper()
        #inversionista ****Revisar
        inversionista = models.Usuario.objects.filter(cedula=cedula)[0]
        

        if conyuge:
            nombres_conyuge = request.data.get("nombres_conyuge")
            apellidos_conyuge = request.data.get("apellidos_conyuge")
            cedula_conyuge = request.data.get("cedula_conyuge")
            new_conyuge = models.Conyuge(nombres= nombres_conyuge, apellidos=apellidos_conyuge, cedula=cedula_conyuge)
            new_conyuge.save()

            inversionista.conyuge_id = new_conyuge
        
        new_ingresos = models.Fuente_ingresos(descripcion= descripcion_ingresos, direccion= direccion_fuente_ingresos,
                                                ciudad= ciudad_fuentes_ingresos, ingresos_mensuales=ingresos_mensuales)
        new_ingresos.save()
        
        new_banco = models.Banco(nombre=banco)
        new_banco.save()

        new_cuenta_bancaria = models.Cuenta_bancaria(numero_cuenta= numero_cuenta, tipo_cuenta= tipo_cuenta, banco= new_banco)
        new_cuenta_bancaria.save()
        

        #agregando al inversionista respectivo
        inversionista.ciudad = ciudad
        inversionista.provincia = provincia
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
            r = requests.post('http://localhost:8000/api/token/', data = {'username':username, 'password': password})
            dic_tokens = r.json()
            usuario = serializers.UserSerializer(user,
                                                 context=self.get_serializer_context()).data
            return Response({'tokens':dic_tokens, 'user':usuario},  status=status.HTTP_200_OK) 


        return Response(status=status.HTTP_401_UNAUTHORIZED)



def Dashboard(request):
    return render(request, 'registro_inversionista/dashboard_inversionista.html')




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
            

            r = requests.post('http://127.0.0.1:8000/inversionista/login_inversionista/', 
                                data = {'username':cd.get('username'), 'password': cd.get('password')})
            dic_tokens = r.json().get('tokens')
            user = r.json().get('user')
            return render(request, 'registro_inversionista/dashboard_inversionista.html', 
                                    {'submitted': submitted, 'tokens': dic_tokens, 'user': user.get('username')})
            
    else:
        form = Login_form()
        if 'submitted' in request.GET:
             submitted = True
 
    return render(request, 'registro_inversionista/login.html', {'form': form, 'submitted': submitted})



