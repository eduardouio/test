from django.shortcuts import render
from rest_framework import generics
from django.shortcuts import render
from .models import SolicitudTemporal, EncuestaSolicitudTemporal, UsuarioSolicitanteTemporal, SolicitantesPreAprobados
from registro_inversionista.models import Pregunta, Respuesta
from django.http import HttpResponse
from rest_framework import status
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.utils.html import strip_tags
from django.contrib.auth.models import User
from django.contrib import messages
# Create your views here.
class RegisterSolicitudTemporal(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        razon_social = request.data.get("razon_social", "")
        nombre_comercial = request.data.get("nombre_comercial", "")
        ruc = request.data.get("ruc", "")
        email = request.data.get("email", "")
        nombres = request.data.get("nombres").title()
        apellidos = request.data.get("apellidos").title()
        celular = request.data.get("celular")
        tipo_persona = request.data.get("tipo_persona")
        cedula = request.data.get("cedula")
        monto = request.data.get("monto")
        plazo = request.data.get("plazo")
        tasa = request.data.get("tasa")
        uso = request.data.get("uso")

        encuesta = request.data.get("encuesta")

        preguntas = encuesta.get("preguntas")
        respuestas = encuesta.get("respuestas")
        existe_solicitud = False
        if UsuarioSolicitanteTemporal.objects.filter(cedula=cedula).exists():
            usuario = UsuarioSolicitanteTemporal.objects.filter(cedula=cedula)[0]
            usuario.email = email
            usuario.nombres = nombres
            usuario.apellidos = apellidos
            usuario.celular = celular
            #validando si ya existe una solicitud temporal para ese RUC
            
            usuario.save()
            new_solicitud = SolicitudTemporal(
                razon_social=razon_social, nombre_comercial=nombre_comercial, ruc=ruc,
                tipo_persona=tipo_persona, monto=monto, plazo=plazo, tasa=tasa, uso_financiamiento=uso,
                id_usuario_solicitante_temporal= usuario
            )
            rechazar(tipo_persona,ruc,new_solicitud)
        else:
            if (existeCI(ruc)):
                #ya ha realizado una peticion con dicho ruc
                new_user = User( username=cedula, password=cedula,
                    email=email, first_name=nombres, last_name=apellidos,
                )

                new_user.set_password(cedula)
                new_user.is_active = False
                new_user.save()

                new_usuario = UsuarioSolicitanteTemporal(
                    email=email, nombres=nombres, apellidos=apellidos, celular=celular,
                    cedula=cedula, user=new_user
                )

                new_usuario.save()
                new_solicitud = SolicitudTemporal(
                    razon_social=razon_social, nombre_comercial=nombre_comercial, ruc=ruc,
                    tipo_persona=tipo_persona, monto=monto, plazo=plazo, tasa=tasa, uso_financiamiento=uso,
                    id_usuario_solicitante_temporal= new_usuario
                )
                rechazar(tipo_persona,ruc,new_solicitud)
                #validar tiempo (si lleva mas de un mes se actualiza la peticion)
            else:
                new_user = User( username=cedula, password=cedula,
                    email=email, first_name=nombres, last_name=apellidos,
                )

                new_user.set_password(cedula)
                new_user.is_active = False
                new_user.save()

                new_usuario = UsuarioSolicitanteTemporal(
                    email=email, nombres=nombres, apellidos=apellidos, celular=celular,
                    cedula=cedula, user=new_user
                )

                new_usuario.save()
                new_solicitud = SolicitudTemporal(
                    razon_social=razon_social, nombre_comercial=nombre_comercial, ruc=ruc,
                    tipo_persona=tipo_persona, monto=monto, plazo=plazo, tasa=tasa, uso_financiamiento=uso,
                    id_usuario_solicitante_temporal= new_usuario
                )
                rechazar(tipo_persona,ruc,new_solicitud)
        #guardar_contratos(nombres,apellidos,cedula, new_usuario) #falta hacer el contrato para solic

        #valida persona natural

        #guardando encuesta
        if (existe_solicitud==False):
            for i in range(len(preguntas)):
                pregunta = Pregunta.objects.filter(texto=preguntas[i])[0]
                respuesta = Respuesta.objects.filter(texto=respuestas[i])[0]
                encuesta = EncuestaSolicitudTemporal(id_pregunta= pregunta, id_respuesta=respuesta, id_solicitud_temporal=new_solicitud)
                encuesta.save()
                persona_natural="1";
                empresa="0";
                if(tipo_persona == persona_natural):
                    mail_subject = '¡Gracias por tu Solicitud!'
                    message = render_to_string('solicitante/registro_solicitud_email.html', {
                    'solicitud': new_solicitud,
                    'monto': numberWithCommas(float(monto)),
                    'tasa': numberWithCommas(float(tasa))
                    })
                    plain_message = strip_tags(message)
                    to_email = email
                    correo = EmailMessage(
                    mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
                    )
                    correo.content_subtype = "html"
                    correo.send()
                
                else:
                    mail_subject = '¡Gracias por tu Solicitud!'
                    message = render_to_string('solicitante/registro_solicitud_email_empresa.html', {
                    'solicitud': new_solicitud,
                    'monto': numberWithCommas(float(monto)),
                    'tasa': numberWithCommas(float(tasa))
                    })
                    plain_message = strip_tags(message)
                    to_email = email
                    correo = EmailMessage(
                    mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
                    )
                    correo.content_subtype = "html"
                    correo.send()

            

            #mail a admin
            print(tipo_persona)
            print(type(tipo_persona))
            mail_subject = 'Nueva solicitud en la plataforma'
            message = render_to_string('solicitante/email_registro_solicitud_admin.html', {
                'solicitud': new_solicitud,
                'tipo_persona': "Si" if tipo_persona == "1" else "No"
            })
            plain_message = strip_tags(message)
            to_email = "solicitudes@creceecuador.com"
            correo = EmailMessage(
                        mail_subject, message,from_email="El Equipo de CRECE", to=[to_email]
            )
            correo.content_subtype = "html"
            correo.send()

        response = HttpResponse(status=status.HTTP_200_OK)

        return response
    def get(self, request, *args, **kwargs):
        return render(request, 'solicitante/registro_solicitud.html')


def numberWithCommas(num):
    return f"{num:,.2f}"

def existeCI(RUC):
    try:
        solicitudesDB=SolicitudTemporal.objects.get(ruc=RUC)
        if (solicitudesDB.ruc==RUC):
            return True
    except SolicitudTemporal.DoesNotExist:
        solicitudesDB= None
        return False

def rechazar(tipoPersona,RUC,nueva_solicitud):
    if(tipoPersona=='1'):
        nueva_solicitud.estado = 4
        nueva_solicitud.razon_de_no_aprobacion=1
    else:
        try:
            preaprobados=SolicitantesPreAprobados.objects.get(ruc=RUC)
            if(preaprobados.estado==0):
                nueva_solicitud.estado =1
                # nueva_solicitud.razon_de_no_aprobacion=preaprobados.estado
            else:
                nueva_solicitud.estado = 4
                nueva_solicitud.razon_de_no_aprobacion=preaprobados.estado
        except SolicitantesPreAprobados.DoesNotExist:
            nueva_solicitud.estado = 4
    nueva_solicitud.save()
