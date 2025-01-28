from django.urls import path,include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path('api/profile/update/', UpdateProfileView.as_view(), name='profile_update'),
    path('api/profile/change-password/', ChangePasswordView.as_view(), name='change_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


