from django.urls import path
from .views import *

urlpatterns = [
    # student
    path("student/", student_placements),
    path("apply/", apply_placement),

    # admin / instructor
    path("create/", create_placement),
    path("manage/", manage_placements),
    path("toggle/", toggle_placement),
    path("delete/", delete_placement),
    path("student/", student_placements),
]
