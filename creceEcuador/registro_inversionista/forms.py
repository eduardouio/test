from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms import ModelForm

from . import models
class SignupForm(ModelForm):
    email = forms.EmailField(max_length=200, help_text='Required')

    class Meta:
	    model = models.Usuario
	    fields = ('usuario', 'password', 'email', 'nombres', 'apellidos', 'tipo_persona', 'celular' )
	    widgets = {'password': forms.PasswordInput()}
