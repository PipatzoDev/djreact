from django.db import models
from django.conf import settings  # Para usar el modelo de usuario
from django.utils.timezone import now
import os

def user_directory_path(instance, filename):
    # Genera la ruta: media/user_<id>/task_<id>/<filename>
    return f'user_{instance.creator.id}/task_{instance.id}/{filename}'

def user_portada_path(instance, filename):
    # Genera la ruta para las portadas
    return f'user_{instance.creator.id}/task_{instance.id}/portada/{filename}'

class Task(models.Model):
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, verbose_name="Descripción")
    created_at = models.DateTimeField(default=now, verbose_name="Fecha de creación")
    portada = models.ImageField(
        upload_to=user_portada_path, 
        null=True, 
        blank=True,
        verbose_name="Imagen de portada"
    )
    extra = models.CharField(max_length=200, verbose_name="Extras", null=True)
    done = models.BooleanField(default=False, verbose_name="Completada")
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Referencia al modelo de usuario
        on_delete=models.CASCADE,  # Si el usuario se elimina, sus tareas también
        related_name="tasks",      # Nombre relacionado para acceder a las tareas del usuario
        verbose_name="Creador"
    )
    archivo = models.FileField(
        upload_to=user_directory_path,
        verbose_name="Archivo adjunto",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Si es una nueva tarea (sin ID), primero guardamos para obtener el ID
        if not self.id:
            super().save(*args, **kwargs)
            
            # Si hay archivos, los movemos a la nueva ubicación con el ID
            if self.portada:
                original_path = self.portada.path
                new_path = user_portada_path(self, os.path.basename(original_path))
                self.portada.name = new_path
                
            if self.archivo:
                original_path = self.archivo.path
                new_path = user_directory_path(self, os.path.basename(original_path))
                self.archivo.name = new_path
                
            # Guardamos de nuevo con las rutas actualizadas
            super().save(update_fields=['portada', 'archivo'])
        else:
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Guardar las rutas de los directorios antes de eliminar
        if self.creator_id:
            user_dir = os.path.join(settings.MEDIA_ROOT, f'user_{self.creator.id}')
            task_dir = os.path.join(user_dir, f'task_{self.id}')
            
            # Eliminar el objeto
            super().delete(*args, **kwargs)
            
            # Eliminar el directorio de la tarea si existe
            if os.path.exists(task_dir):
                import shutil
                shutil.rmtree(task_dir)
                
            # Eliminar el directorio del usuario si está vacío
            try:
                os.rmdir(user_dir)
            except OSError:
                pass  # El directorio no está vacío o no existe
        else:
            super().delete(*args, **kwargs)
