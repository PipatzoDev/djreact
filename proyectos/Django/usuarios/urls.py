from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView, 
    UserProfileView, 
    UpdateProfileView, 
    ChangePasswordView,
    PasswordResetView,
    PasswordResetConfirmView
)
from django.conf import settings
from django.conf.urls.static import static

app_name = 'usuarios'

urlpatterns = [
    # Rutas de autenticación
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rutas de usuarios
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path('api/profile/update/', UpdateProfileView.as_view(), name='profile_update'),
    path('api/profile/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('api/password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('api/password-reset-confirm/<uidb64>/<token>/', 
         PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]

# Añadir rutas de media solo en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


