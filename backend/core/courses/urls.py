from django.urls import path
from . import views

urlpatterns = [


    # ================= Admin APIs =================
    path("admin/",views.list_courses,name="admin_list_courses"),

    path("admin/create/",views.create_course,name="admin_create_course"),

    path("admin/<int:id>/",views.update_course,name="admin_update_course"),

    path("admin/<int:id>/delete/",views.delete_course,name="admin_delete_course"),

    path("admin/<int:course_id>/content/",views.list_course_content,name="admin_list_course_content"),

    path("admin/<int:course_id>/content/upload/",views.upload_course_content,name="admin_upload_course_content"),

    path("admin/content/<int:content_id>/delete/",views.delete_course_content,name="admin_delete_course_content"),

    # ================= Instructor APIs =================
    path("instructor/dashboard/",views.instructor_dashboard,name="instructor_dashboard"),

    path("instructor/add-course/",views.add_course,name="instructor_add_course"),

    path("instructor/<int:course_id>/content/",views.list_course_content,name="instructor_list_course_content"),

    path("instructor/<int:course_id>/content/upload/",views.upload_course_content,name="instructor_upload_course_content"),

    # ================= Instructor: Manage Courses =================
    path("instructor/courses/",views.instructor_list_courses,name="instructor_list_courses"),

    path("instructor/courses/<int:course_id>/delete/",views.instructor_delete_course,name="instructor_delete_course"),

    path("instructor/student-performance/",views.student_performance,name="student_performance"),

]
