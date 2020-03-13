from django.conf.urls import url
from django.urls import include, path
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register(r'inversionista', views.UsuariosViewSet)
router.register(r'encuesta', views.EncuestaViewSet)
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('register/', views.RegisterUsers.as_view(), name="auth-register"),
    url(r'^confirmar_email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.confirmar_email, name='confirmar_email'),
# Wire up our API using automatic URL routing.
]
