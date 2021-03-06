from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.contrib.auth import authenticate

from . import models

respuestas_pregunta_1 = [
    ('1', '3 a 6 meses'),
    ('2', '6 a 12 meses'),
    ('3', 'mas de 12 meses'),
]

respuestas_pregunta_2 = [
    ('1', '500 a 1000'),
    ('2', '1000 a 3000'),
    ('3', '3000 a 5000'),
    ('4', 'mas de 5000'),
]

respuestas_pregunta_3 = [
    ('1', 'Bajo'),
    ('2', 'Alto'),
    ('3', 'Altisimo'),
]

respuestas_pregunta_4 = [
    ('1', 'Familiar o amigo'),
    ('2', 'Charla o conferencia'),
    ('3', 'Redes sociales'),
    ('4', 'Buscando en Google'),
    ('5', 'Volante'),
]



class SignupForm(ModelForm):

    required_css_class = 'required'

    class Meta:
        model = models.Usuario
        fields = ( 'nombres', 'apellidos','usuario', 'password', 'email', 'tipo_persona', 'celular', 'canton' )
        widgets = {'password': forms.PasswordInput()}
    
    def clean_usuario(self):
        # cleaned_data = super().clean()

        # username = cleaned_data.get("usuario")

        username = self.cleaned_data['usuario']
        if User.objects.exclude(pk=self.instance.pk).filter(username=username).exists():
            raise forms.ValidationError(u'Username "%s" is already in use.' % username)
        return username

    

class Encuesta_form(forms.Form):
    """docstring for Encuesta_form"""
    pregunta_1 = forms.ChoiceField(
        label='¿En cuánto tiempo esperas recuperar tus inversiones?',
        required=False,
        widget=forms.RadioSelect,
        choices=respuestas_pregunta_1,
    )
    pregunta_2 = forms.ChoiceField(
        label='¿Cuánto esperas invertir a través de CRECE?',
        required=False,
        widget=forms.RadioSelect,
        choices=respuestas_pregunta_2,
    )
    pregunta_3 = forms.ChoiceField(
        label='¿Qué nivel de riesgo se ajusta a tu perfil?',
        required=False,
        widget=forms.RadioSelect,
        choices=respuestas_pregunta_3,
    )
    pregunta_4 = forms.ChoiceField(
        label='¿Cómo conociste a CRECE?',
        required=False,
        widget=forms.RadioSelect,
        choices=respuestas_pregunta_4,
    )

class Login_form(forms.Form):
    # TODO: Define form fields here
    required_css_class = 'required'
    username = forms.CharField(required=True,
                                widget=forms.TextInput(attrs={'placeholder': 'usuario o correo electronico'}))
    password = forms.CharField(required=True,
                                widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")
        password = cleaned_data.get("password")
        user = authenticate(username=username, password=password)
        if not (user):
            raise forms.ValidationError("Usuario o password incorrecto.")