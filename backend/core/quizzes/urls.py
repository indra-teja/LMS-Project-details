from django.urls import path
from . import views


urlpatterns = [
    path('q_demo/',views.q_demo),
]