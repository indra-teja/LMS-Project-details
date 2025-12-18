from django.urls import path
from . import views

urlpatterns = [
    path('start-attendance/',views.generate_attendance_qr),
    path('admin/', views.list_courses),
    path('admin/create/', views.create_course),
    path('admin/<int:id>/', views.update_course),
    path('admin/<int:id>/delete/', views.delete_course),
    path('admin/<int:course_id>/content/upload/',views.upload_course_content),
    path('admin/<int:course_id>/content/',views.list_course_content),
    path('admin/<int:course_id>/content/upload/',views.upload_course_content),
    path('admin/content/<int:content_id>/delete/',views.delete_course_content),

]