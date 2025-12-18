from django.db import models
from accounts.models import User
from courses.models import Course

class Quiz(models.Model):
    QUIZ_TYPE_CHOICES = (
        ('MCQ', 'MCQ'),
        ('TF', 'True/False'),
        ('DESCRIPTIVE', 'Descriptive'),
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'STUDENT'}
    )

    score = models.IntegerField()
    total_marks = models.IntegerField()

    quiz_type = models.CharField(max_length=20, choices=QUIZ_TYPE_CHOICES)
    graded = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.email} - {self.course.title}"
