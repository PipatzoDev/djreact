from rest_framework import serializers
from .models import Task


# In serializers.py
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        
    def create(self, validated_data):
        portada = validated_data.pop('portada', None)
        archivo = validated_data.pop('archivo', None)
        task = Task.objects.create(**validated_data)
        
        if portada:
            task.portada = portada
        if archivo:
            task.archivo = archivo
        
        task.save()
        return task