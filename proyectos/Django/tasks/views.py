from rest_framework import viewsets,generics, permissions
from rest_framework.response import Response
from .serializer import *
from .models import Task

class TaskView(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# In your Django views.py
from rest_framework.parsers import MultiPartParser, FormParser

class TaskViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = TaskSerializer