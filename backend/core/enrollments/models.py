from django.db import models
from accounts.models import User
from courses.models import Course

class Enrollment(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'STUDENT'}
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    progress_percent = models.IntegerField(default=0)
    attendance_percent = models.IntegerField(default=0)

    certificate_issued = models.BooleanField(default=False)
    bookmarked = models.BooleanField(default=False)

    last_accessed = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.email} - {self.course.title}"
