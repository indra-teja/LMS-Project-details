from django.db import models
from accounts.models import User
from courses.models import Course

class NotificationQuery(models.Model):
    TYPE_CHOICES = (
        ('QUERY', 'Query'),
        ('NOTIFICATION', 'Notification'),
        ('ANNOUNCEMENT', 'Announcement'),
        ('AUDIT', 'Audit'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_notifications'
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()

    related_course = models.ForeignKey(
        Course,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_notifications'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - {self.user.email}"




class Query(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="queries")
    question = models.TextField()
    reply = models.TextField(blank=True, null=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question[:30]
