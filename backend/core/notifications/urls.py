from django.urls import path
from . import views

urlpatterns = [
    # Student
    path("query/create/", views.create_query),
    path("query/student/", views.student_queries),

    # Admin
    path("admin/queries/", views.admin_list_queries),

    # Instructor
    path("instructor/queries/", views.instructor_queries),

    # Reply (admin / instructor)
    path("query/reply/<int:query_id>/", views.reply_query),
]
