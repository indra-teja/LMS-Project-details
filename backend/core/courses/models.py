from django.db import models
from accounts.models import User

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    instructor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'INSTRUCTOR'}
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CourseContent(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="contents"
    )
    title = models.CharField(max_length=200)

    CONTENT_TYPE = (
        ("VIDEO", "Video"),
        ("PDF", "PDF"),
        ("LINK", "Link"),
    )
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE)

    file = models.FileField(
        upload_to="course_files/",
        blank=True,
        null=True
    )
    video_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)


class ContentProgress(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.ForeignKey(CourseContent, on_delete=models.CASCADE)
    completed = models.BooleanField(default=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "content")
