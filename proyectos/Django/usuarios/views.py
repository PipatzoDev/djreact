from django.shortcuts import render
from django.core.mail import EmailMessage
# Create your views here.
from rest_framework import viewsets,generics, permissions
from rest_framework.response import Response
from .serializers import *
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model


User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.check_password(request.data.get('old_password')):
            return Response({'message': 'Contraseña actual incorrecta'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        user.set_password(request.data.get('new_password'))
        user.save()
        return Response({'message': 'Contraseña actualizada exitosamente'})

class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'No existe usuario con este correo'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Generar token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # URL de reset (ajusta según tu dominio frontend)
        reset_url = f'http://localhost:5173/password-reset-confirm/{uid}/{token}'
        
        # Enviar email
        email_message = EmailMessage(
        subject="🔴 Restablecer Contraseña 🔴",
        body=f"Buenas,\n\nHaz click en el siguiente enlace para restablecer tu contraseña: {reset_url}",
        from_email="pipatzo@gmail.com",
        to=[email],
        )

        
        email_message.send(fail_silently=False)
        
        return Response({'message': 'Email enviado correctamente'})

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, User.DoesNotExist):
            return Response(
                {'error': 'Token inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'Token inválido o expirado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_password = request.data.get('new_password')
        if not new_password:
            return Response(
                {'error': 'Nueva contraseña requerida'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Contraseña actualizada correctamente'})