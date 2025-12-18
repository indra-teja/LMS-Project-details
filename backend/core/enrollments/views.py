from rest_framework.decorators import api_view
from rest_framework.response import Response
from enrollments.models import Enrollment
from django.db.models import Avg
from enrollments.models import Enrollment
from quizzes.models import Quiz
from notifications.models import NotificationQuery
from accounts.models import User




@api_view(['POST'])
def mark_attendance(request):
    user = request.user
    course_id = request.data.get('course_id')

    enrollment = Enrollment.objects.get(
        student=user,
        course_id=course_id
    )

    # simple logic
    enrollment.attendance_percent += 5
    if enrollment.attendance_percent > 100:
        enrollment.attendance_percent = 100

    enrollment.save()

    return Response({"message": "Attendance marked"})




@api_view(['GET'])
def student_dashboard(request):
    # TEMP FIX: use first student
    user = User.objects.filter(role='STUDENT').first()

    enrollments = Enrollment.objects.filter(student=user)

    avg_progress = enrollments.aggregate(
        avg=Avg('progress_percent')
    )['avg'] or 0

    avg_attendance = enrollments.aggregate(
        avg=Avg('attendance_percent')
    )['avg'] or 0

    upcoming_quizzes = Quiz.objects.filter(student=user).count()

    recent_activity = NotificationQuery.objects.filter(
        user=user
    ).order_by('-created_at')[:5]

    activity_list = [
        {
            "message": a.message,
            "type": a.type,
            "created_at": a.created_at
        }
        for a in recent_activity
    ]

    return Response({
        "course_progress": round(avg_progress, 2),
        "attendance": round(avg_attendance, 2),
        "upcoming_quizzes": upcoming_quizzes,
        "recent_activity": activity_list
    })
