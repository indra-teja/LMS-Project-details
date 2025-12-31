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





class MockInterview(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    interview_no = models.IntegerField()  # NEW
    score = models.IntegerField()
    feedback = models.TextField(blank=True)
    attended_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.email} - Mock {self.interview_no}"


class WeeklyTest(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    week_no = models.IntegerField()
    score = models.IntegerField()
    total_marks = models.IntegerField()
    remarks = models.TextField(blank=True)  # ✅ NEW
    attended_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.email} - Week {self.week_no}"


class StudentProject(models.Model):
    STATUS_CHOICES = [
        ("NOT_STARTED", "Not Started"),
        ("IN_PROGRESS", "In Progress"),
        ("COMPLETED", "Completed"),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    technologies = models.CharField(max_length=300)
    github_link = models.URLField(blank=True, null=True)
    live_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    score = models.IntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return self.title
