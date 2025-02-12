from rest_framework import viewsets,generics, permissions
from rest_framework.response import Response
from .serializer import *
from .models import Task
from rest_framework.decorators import api_view
from rest_framework import status

class TaskView(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# In your Django views.py
from rest_framework.parsers import MultiPartParser, FormParser

class TaskViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = TaskSerializer

@api_view(['GET'])
def get_user_tasks(request, user_id):
    try:
        tasks = Task.objects.filter(creator_id=user_id)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": "Error al obtener las tareas del usuario"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
