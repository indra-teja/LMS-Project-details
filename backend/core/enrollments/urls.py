from django.urls import path
from . import views

urlpatterns = [
    path("student-courses/", views.student_courses),
    path("student-course/<int:course_id>/", views.student_course_detail),
    path("mark-content-complete/", views.mark_content_complete),
    path("student-dashboard/", views.student_dashboard),
    path("student-performance/", views.student_performance),
    #path("mark-attendance/", views.mark_attendance),
    #path("attendance-summary/", views.student_attendance_summary),
    path("students/", views.list_students),
    path("add-mock-interview/", views.add_mock_interview),
    path("add-weekly-test/", views.add_weekly_test),
    path("course/<int:course_id>/students/", views.course_students),

]
