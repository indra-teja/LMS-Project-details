from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_quiz),
    path("<int:quiz_id>/add-question/", views.add_question),
    path("<int:quiz_id>/", views.quiz_detail),
    path("student-quizzes/", views.student_quizzes),
    path("<int:quiz_id>/questions/", views.quiz_questions),
    path("submit/", views.submit_quiz),
]
