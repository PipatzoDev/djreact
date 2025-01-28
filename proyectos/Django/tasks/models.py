from django.db import models
from django.conf import settings  # Para usar el modelo de usuario
from django.utils.timezone import now

class Task(models.Model):
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, verbose_name="Descripción")
    created_at = models.DateTimeField(default=now, verbose_name="Fecha de creación")
    portada =  models.ImageField(upload_to='tasks_portadas/', null=True, blank=True)
    extra = models.CharField(max_length=200, verbose_name="Extras" ,null=True)
    done = models.BooleanField(default=False, verbose_name="Completada")
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Referencia al modelo de usuario
        on_delete=models.CASCADE,  # Si el usuario se elimina, sus tareas también
        related_name="tasks",      # Nombre relacionado para acceder a las tareas del usuario
        verbose_name="Creador"
    )
    archivo = models.FileField(upload_to='tasks_archivos/', null=True, blank=True, verbose_name="Archivo adjunto")

    def __str__(self):
        return self.title
