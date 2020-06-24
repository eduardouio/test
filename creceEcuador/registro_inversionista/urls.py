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
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('register_inversionista/', views.RegisterUsers.as_view(), name="inversionista_register"),
    path('registro/', views.SignupView, name="registro"),
    url(r'^confirmar_email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.confirmar_email, name='confirmar_email'),
    url(r'fase1/', views.Proceso_formulario_inversion.as_view(), name="formulario-inversion"),
    path('login/', views.Login_Users.as_view(), name="inversionista_login"),
    path('dashboard/', views.Dashboard, name='dashboard'),
   

    url(r'^cedula/(?P<filename>[^/]+)$', views.ImagenCedulaView.as_view()),
    path('completa_datos/', views.completar_datos_financieros_view, name="completa_datos"),
    url(r'^comprobante_transferencia/(?P<filename>[^/]+)$', views.SubirTransferenciaView.as_view()),
    path('subir_transferencia/', views.subir_transferencia_view, name="subir_transferencia"),

    path('login/', views.LoginView, name="login"),
    path('bancos/', views.Bancos_list.as_view(), name="bancos-all"),
    path('<str:username>/', views.get_usuario, name='get_usuario'),
    
# Wire up our API using automatic URL routing.
]
