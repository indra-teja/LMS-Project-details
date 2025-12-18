from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_settings),
    path('update/', views.update_settings),
]
