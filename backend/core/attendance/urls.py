from django.urls import path
from . import views

urlpatterns = [
    path("start-attendance/", views.generate_attendance_qr),
    path("mark-attendance/", views.mark_attendance),
    path("attendance-summary/", views.student_attendance_summary),
]
