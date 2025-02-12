from django.urls import path,include
from rest_framework import routers
from tasks import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'tasks', views.TaskView, 'tasks')


urlpatterns = [
    path("api/v1/", include(router.urls)), 
    path('api/v1/tasks/user-tasks/<int:user_id>/', views.get_user_tasks, name='user-tasks'),
]
