from django.urls import path
from . import views

urlpatterns = [
    path('admin/', views.list_queries),
    path('admin/<int:id>/reply/', views.reply_query),
]
