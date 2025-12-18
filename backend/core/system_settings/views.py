from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SystemSettings

@api_view(['GET'])
def get_settings(request):
    settings = SystemSettings.objects.first()
    return Response({
        "site_name": settings.site_name,
        "support_email": settings.support_email,
        "allow_self_registration": settings.allow_self_registration,
        "max_login_attempts": settings.max_login_attempts,
        "max_courses_per_instructor": settings.max_courses_per_instructor,
        "course_approval_required": settings.course_approval_required,
        "min_completion_percent": settings.min_completion_percent,
        "auto_generate_certificates": settings.min_completion_percent,
        "quiz_pass_percent": settings.quiz_pass_percent,
        "max_quiz_attempts": settings.max_quiz_attempts,
        "default_dark_mode": settings.default_dark_mode,
    })


@api_view(['PUT'])
def update_settings(request):
    settings = SystemSettings.objects.first()

    for key, value in request.data.items():
        setattr(settings, key, value)

    settings.save()
    return Response({"message": "Settings updated"})
