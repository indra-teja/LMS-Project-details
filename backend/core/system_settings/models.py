from django.db import models

class SystemSettings(models.Model):
    site_name = models.CharField(max_length=100, default="LMS Portal")
    support_email = models.EmailField(default="support@example.com")

    allow_self_registration = models.BooleanField(default=True)
    max_login_attempts = models.IntegerField(default=5)

    max_courses_per_instructor = models.IntegerField(default=10)
    course_approval_required = models.BooleanField(default=False)

    min_completion_percent = models.IntegerField(default=70)
    auto_generate_certificates = models.BooleanField(default=True)

    quiz_pass_percent = models.IntegerField(default=50)
    max_quiz_attempts = models.IntegerField(default=3)

    default_dark_mode = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "System Settings"
