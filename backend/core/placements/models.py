from django.db import models
from django.utils.timezone import now
from accounts.models import User
from courses.models import Course

class Placement(models.Model):
    company_name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    eligibility = models.CharField(max_length=200)
    apply_link = models.URLField()
    deadline = models.DateField()
    is_active = models.BooleanField(default=True)

    # 🔒 COURSE IS MANDATORY
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="placements"
    )

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="placements_created"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def status(self):
        if self.is_active and self.deadline >= now().date():
            return "ACTIVE"
        return "CLOSED"

    def __str__(self):
        return f"{self.company_name} - {self.role} ({self.course.title})"


class PlacementApplication(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    placement = models.ForeignKey(Placement, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "placement")
