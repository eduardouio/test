from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register(r'inversionista', views.UsuariosViewSet)

# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('auth/register/', views.RegisterUsers.as_view(), name="auth-register"),
# Wire up our API using automatic URL routing.
]
