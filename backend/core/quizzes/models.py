from django.db import models
from accounts.models import User
from courses.models import Course

# ================= Quiz created by Instructor =================
class Quiz(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="quizzes"
    )
    title = models.CharField(max_length=200)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'INSTRUCTOR'}
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# ================= Questions =================
class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions"
    )
    question_text = models.TextField()

    def __str__(self):
        return self.question_text


# ================= Options =================
class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="options"
    )
    option_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.option_text


# ================= Student Attempt / Result =================
class QuizAttempt(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'STUDENT'}
    )
    score = models.IntegerField()
    total_marks = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
