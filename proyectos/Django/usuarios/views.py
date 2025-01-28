from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets,generics, permissions
from rest_framework.response import Response
from .serializer import *
from rest_framework import status
from rest_framework.views import APIView


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