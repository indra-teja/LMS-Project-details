from django.urls import path
from . import views
from .views import test_email


urlpatterns = [
    path('login/', views.login),
    path('admin/dashboard/', views.admin_dashboard),

    # Students
    path('admin/students/', views.list_students),
    path('admin/students/create/', views.create_student),
    path('admin/students/<int:id>/', views.update_student),
    path('admin/students/<int:id>/delete/', views.delete_student),
    path("student/profile/", views.student_profile),
    path("student/profile/update/", views.update_student_profile),
    path("change-password/", views.change_password),
    path("admin/students/<int:id>/restore/", views.restore_student),
    path("admin/students/<int:id>/force-delete/", views.force_delete_student),



     # instructors
    path('admin/instructors/', views.list_instructors),
    path('admin/instructors/create/', views.create_instructor),
    path('admin/instructors/<int:id>/', views.update_instructor),
    path('admin/instructors/<int:id>/delete/', views.delete_instructor),
    path("instructor/profile/", views.instructor_profile),


    # Email related 
    path("test-email/", test_email),             

]