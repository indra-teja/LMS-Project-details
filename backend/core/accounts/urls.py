from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login),
    path('admin/dashboard/', views.admin_dashboard),

    # Students
    path('admin/students/', views.list_students),
    path('admin/students/create/', views.create_student),
    path('admin/students/<int:id>/', views.update_student),
    path('admin/students/<int:id>/delete/', views.delete_student),

     # instructors
    path('admin/instructors/', views.list_instructors),
    path('admin/instructors/create/', views.create_instructor),
    path('admin/instructors/<int:id>/', views.update_instructor),
    path('admin/instructors/<int:id>/delete/', views.delete_instructor),
]