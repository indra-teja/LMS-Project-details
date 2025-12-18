from django.urls import path,include
from . import views

urlpatterns = [
    path('e_demo/',views.mark_attendance),
    path('student-dashboard/', views.student_dashboard),
]

