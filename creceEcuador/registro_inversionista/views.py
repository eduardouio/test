from django.shortcuts import render, redirect
from rest_framework import viewsets, generics,status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from . import models
from . import serializers

#confirmacion de email
from django.http import HttpResponse
from .forms import SignupForm
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from .tokens import account_activation_token
from django.core.mail import EmailMessage

class UsuariosViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Usuario.objects.all()
    serializer_class = serializers.UsuarioSerializer

class RegisterUsers(generics.CreateAPIView):
    """
    POST auth/register/inversionista/
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UsuarioSerializer

    def post(self, request, *args, **kwargs):
        signup(request)
        usuario = request.data.get("usuario", "")
        password = request.data.get("password", "")
        email = request.data.get("email", "")
        nombres = request.data.get("nombres")
        apellidos = request.data.get("apellidos")
        celular = request.data.get("celular")
        tipo_persona = request.data.get("tipo_persona")
        new_user = User.objects.filter(username=usuario)[0]
        models.Usuario.objects.create(usuario=usuario, nombres=nombres, apellidos=apellidos, email=email, celular=celular, tipo_persona=tipo_persona, user=new_user)
        return Response({"mensaje": "Su cuenta ha sido agregada correctamente"},status=status.HTTP_200_OK, )
        #return HttpResponse('Please confirm your email address to complete the registration')

    def get(self, request, *args, **kwargs):
        form = SignupForm()
        return render(request, 'signup.html', {'form': form})

class EncuestaViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    permission_classes =[permissions.IsAuthenticated]
    queryset = models.Encuesta.objects.all()
    serializer_class = serializers.EncuestaSerializer

def signup(request):
    form = SignupForm(request.POST)
    if form.is_valid():
        usuario_input = form.save(commit=False)
        new_user = User(
            username=usuario_input.usuario, password=usuario_input.password, 
            email=usuario_input.email, first_name=usuario_input.nombres, last_name=usuario_input.apellidos,
        )
        new_user.is_active = False
        new_user.save()
        current_site = get_current_site(request)
        mail_subject = 'Activa tu cuenta de Crece Ecuador'
        message = render_to_string('acc_active_email.html', {
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
        return HttpResponse('Por favor confirma tu correo electrónico')



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
        #login(request, user)
        # return redirect('home')
        return HttpResponse('Su usuario ha sido confirmado con exito')
    else:
        return HttpResponse('Activation link is invalid!')