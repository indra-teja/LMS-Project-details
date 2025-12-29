from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg
from courses.models import CourseContent
from enrollments.models import Enrollment
from quizzes.models import QuizAttempt
from notifications.models import NotificationQuery
from accounts.models import User
from courses.models import ContentProgress


from django.utils import timezone
from enrollments.models import Enrollment
from attendance.models import AttendanceSession, AttendanceRecord





@api_view(['GET'])
def student_dashboard(request):
    user = User.objects.filter(role='STUDENT').first()

    enrollments = Enrollment.objects.filter(student=user)

    if not enrollments.exists():
        return Response({
            "course_progress": 0,
            "attendance": 0,
            "upcoming_quizzes": 0,
            "recent_activity": []
        })

    avg_progress = enrollments.aggregate(
        avg=Avg('progress_percent')
    )['avg']

    avg_attendance = enrollments.aggregate(
        avg=Avg('attendance_percent')
    )['avg']

    upcoming_quizzes = QuizAttempt.objects.filter(student=user).count()

    recent_activity = NotificationQuery.objects.filter(
        user=user
    ).order_by('-created_at')[:5]

    return Response({
        "course_progress": round(avg_progress, 2),
        "attendance": round(avg_attendance, 2),
        "upcoming_quizzes": upcoming_quizzes,
        "recent_activity": [
            {
                "message": a.message,
                "type": a.type,
                "created_at": a.created_at
            } for a in recent_activity
        ]
    })


@api_view(["GET"])
def student_courses(request):
    student_id = request.GET.get("student_id")

    if not student_id:
        return Response(
            {"error": "student_id is required"},
            status=400
        )

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid student"},
            status=404
        )

    enrollments = Enrollment.objects.select_related("course").filter(
        student=student
    )

    return Response([
        {
            "id": e.course.id,
            "title": e.course.title,
            "progress": e.progress_percent,
        }
        for e in enrollments
    ])






@api_view(["GET"])
def student_course_detail(request, course_id):
    student_id = request.GET.get("student_id")

    if not student_id:
        return Response({"error": "student_id missing"}, status=400)

    try:
        student = User.objects.get(id=int(student_id), role="STUDENT")
    except (User.DoesNotExist, ValueError):
        return Response({"error": "Invalid student"}, status=404)

    try:
        enrollment = Enrollment.objects.get(
            student=student,
            course_id=course_id
        )
    except Enrollment.DoesNotExist:
        return Response({"error": "Course not assigned"}, status=404)

    contents = CourseContent.objects.filter(course_id=course_id)

    completed_ids = set(
        ContentProgress.objects.filter(
            student=student,
            content__course_id=course_id
        ).values_list("content_id", flat=True)
    )

    return Response({
        "id": enrollment.course.id,
        "title": enrollment.course.title,
        "progress": enrollment.progress_percent,
        "attendance": enrollment.attendance_percent,
        "description": enrollment.course.description,
        "contents": [
            {
                "id": c.id,
                "title": c.title,
                "type": c.content_type,
                "file": c.file.url if c.file else None,
                "video_url": c.video_url,
                "completed": c.id in completed_ids
            }
            for c in contents
        ]
    })



@api_view(["POST"])
def mark_content_complete(request):
    student_id = request.data.get("student_id")
    content_id = request.data.get("content_id")

    student = User.objects.get(id=student_id, role="STUDENT")
    content = CourseContent.objects.get(id=content_id)

    ContentProgress.objects.get_or_create(
        student=student,
        content=content
    )

    enrollment = Enrollment.objects.get(
        student=student,
        course=content.course
    )

    total = CourseContent.objects.filter(course=content.course).count()
    completed = ContentProgress.objects.filter(
        student=student,
        content__course=content.course
    ).count()

    if total == 0:
        enrollment.progress_percent = 0
    else:
        # ✅ Cap progress at 90% until course completion rules are met
        calculated = int((completed / total) * 100)
        enrollment.progress_percent = min(calculated, 90)

    enrollment.save()

    return Response({"progress": enrollment.progress_percent})




@api_view(["GET"])
def student_performance(request):
    student_id = request.GET.get("student_id")

    if not student_id:
        return Response({"error": "student_id required"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    # ---------------- Course Progress ----------------
    enrollments = Enrollment.objects.filter(student=student)

    avg_progress = enrollments.aggregate(
        avg=Avg("progress_percent")
    )["avg"] or 0

    completed = int(avg_progress)
    remaining = 100 - completed if completed <= 100 else 0

    # ---------------- Quiz Performance ----------------
    quizzes = QuizAttempt.objects.filter(student=student)

    quiz_data = []
    for q in quizzes:
        if q.total_marks and q.total_marks > 0:
            percentage = int((q.score / q.total_marks) * 100)
        else:
            percentage = 0

        quiz_data.append({
            "quiz": q.quiz.title,
            "score": percentage
        })

    return Response({
        "progress": {
            "completed": completed,
            "remaining": remaining
        },
        "quizzes": quiz_data
    })
