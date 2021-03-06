from django.conf.urls import url
from django.urls import include, path
from rest_framework import routers
from . import views
from django.views.generic.base import TemplateView
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views



router = routers.DefaultRouter()
router.register(r'inversionista', views.UsuariosViewSet)
router.register(r'encuesta', views.EncuestaViewSet)
router.register(r'cantones', views.CantonViewSet)
router.register(r'preguntas', views.PreguntaViewSet)
router.register(r'respuestas', views.RespuestaViewSet)
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('registro/', views.RegisterUsers.as_view(), name="inversionista_register"),
    path('firma_contrato_ac_uso/', views.FirmarContratoAcUso.as_view(), name="firma_contrato_ac_uso"),
    url(r'^confirmar_email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.confirmar_email, name='confirmar_email'),
    url(r'fase1/', views.Proceso_formulario_inversion.as_view(), name="formulario-inversion"),
    path('login/', views.Login_Users.as_view(), name="inversionista_login"),
    path('dashboard/', views.Dashboard, name='dashboard'),
    path('contratos/<int:pk>/', views.get_contratos, name='contratos'),
    path('ultimo_ac_uso/<int:pk>/', views.get_ultimo_contrato_ac_uso, name='ultimo_ac_uso'),
    path('dashboard/perfil', views.DashboardPerfil, name='dashboard_perfil'),
    path('ingresa/', views.ingresar_como, name='ingresar_como'),
    path('logout/', views.logout_view, name='logout'),
    path('restablecer_password/', views.restablecer_password.as_view(), name='restablecer_password'),
    url(r'^confirmar_email_restablecer_password/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.confirmar_email_restablecer_password, name='confirmar_email_restablecer_password'),
    path('confirmar_restablecer_password/', views.confirmar_restablecer_password_view.as_view(), name='confirmar_restablecer_password'),
    path('reenviar_email/', views.reenviar_confirmacion_registro.as_view(), name="reenviar_email"),
    path('cambiar_password/', views.cambiar_password.as_view(), name="cambiar_password"),
    path('encuesta_preferencia_persona/', views.encuesta_preferencia_persona, name='encuesta_preferencia_persona'),


    url(r'^cedula/(?P<filename>[^/]+)$', views.ImagenCedulaView.as_view()),
    url(r'^profile_pic/(?P<filename>[^/]+)$', views.ImagenPerfilView.as_view()),
    url(r'^comprobante_transferencia/(?P<filename>[^/]+)$', views.SubirTransferenciaView.as_view()),
    path('registro/terminos_legales/', views.pdf_view_terminos_legales),
    path('registro/politicas_privacidad/', views.pdf_view_privacidad_proteccion_datos),
    path('registro/acuerdo_uso_sitio/', views.pdf_acuerdo_uso_sitio, name="acuerdo-uso-sitio"),

    #path('registro/', views.SignupView, name="registro"),
    # path('login/', views.LoginView, name="login"),
    path('bancos/', views.Bancos_list.as_view(), name="bancos-all"),
    path('<str:username>/', views.get_usuario, name='get_usuario'),
    path('modificar/<int:pk>/', views.DashboardPerfilUpdate, name='update_usuario_dashboard'),
    
# Wire up our API using automatic URL routing.
]
