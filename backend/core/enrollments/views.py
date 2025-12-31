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
from .models import MockInterview, WeeklyTest, StudentProject

from courses.models import Course   





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






from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg
from accounts.models import User
from enrollments.models import Enrollment, WeeklyTest
from quizzes.models import QuizAttempt
from attendance.models import AttendanceRecord, AttendanceSession

@api_view(["GET"])
def student_performance(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return Response({"error": "user_id required"}, status=400)

    try:
        student = User.objects.get(id=user_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    # ---------------- Course Progress ----------------
    enrollments = Enrollment.objects.filter(student=student)

    avg_progress = enrollments.aggregate(
        avg=Avg("progress_percent")
    )["avg"] or 0

    completed = int(avg_progress)
    remaining = max(0, 100 - completed)

    # ---------------- Quiz Performance ----------------
    quizzes = QuizAttempt.objects.filter(student=student)

    quiz_data = []
    for q in quizzes:
        percentage = int((q.score / q.total_marks) * 100) if q.total_marks else 0
        quiz_data.append({
            "quiz": q.quiz.title,
            "score": percentage
        })

    # ---------------- Weekly Tests ----------------
    weekly_tests = WeeklyTest.objects.filter(student=student)

    weekly_details = []
    weekly_total_score = 0

    for wt in weekly_tests:
        percent = int((wt.score / wt.total_marks) * 100) if wt.total_marks else 0
        weekly_total_score += percent

        weekly_details.append({
            "week_no": wt.week_no,
            "score": wt.score,
            "total_marks": wt.total_marks,
            "remarks": wt.remarks
        })

    weekly_avg = (
        int(weekly_total_score / len(weekly_tests))
        if weekly_tests.exists() else 0
    )

    # ---------------- Attendance ----------------
    present_classes = AttendanceRecord.objects.filter(student=student).count()
    total_classes = AttendanceSession.objects.count()

    attendance_percentage = (
        round((present_classes / total_classes) * 100, 2)
        if total_classes > 0 else 0
    )

    # ---------------- FINAL RESPONSE ----------------
    return Response({
        "progress": {
            "completed": completed,
            "remaining": remaining
        },
        "quizzes": quiz_data,

        "weekly_tests": {
            "count": weekly_tests.count(),
            "average_score": weekly_avg,
            "details": weekly_details
        },

        "attendance": {
            "percentage": attendance_percentage
        },

        "project": {
            "title": "Learning Management System",
            "status": "In Progress",
            "score": None,
            "technologies": ["React", "Django"]
        }
    })




@api_view(["GET"])
def list_students(request):
    students = User.objects.filter(role="STUDENT").values("id", "email")
    return Response(students)


@api_view(["POST"])
def add_mock_interview(request):
    student_id = request.data.get("student_id")
    interview_no = request.data.get("interview_no")
    score = request.data.get("score")
    feedback = request.data.get("feedback", "")

    if not student_id or not interview_no or score is None:
        return Response(
            {"error": "student_id, interview_no and score required"},
            status=400
        )

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    MockInterview.objects.create(
        student=student,
        interview_no=int(interview_no),
        score=int(score),
        feedback=feedback
    )

    return Response({"message": "Mock interview added successfully"})






@api_view(["POST"])
def add_weekly_test(request):
    user_id = request.data.get("user_id")
    student_id = request.data.get("student_id")
    week_no = request.data.get("week_no")
    score = request.data.get("score")
    total_marks = request.data.get("total_marks")
    remarks = request.data.get("remarks", "")  # ✅ NEW

    try:
        instructor = User.objects.get(id=user_id, role="INSTRUCTOR")
    except User.DoesNotExist:
        return Response({"error": "Instructor not allowed"}, status=403)

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    if not all([week_no, score, total_marks]):
        return Response({"error": "All fields required"}, status=400)

    WeeklyTest.objects.create(
        student=student,
        week_no=week_no,
        score=score,
        total_marks=total_marks,
        remarks=remarks   # ✅ SAVE
    )

    return Response({"message": "Weekly test added successfully"})





from rest_framework.decorators import api_view
from rest_framework.response import Response

from enrollments.models import Enrollment
from courses.models import Course

@api_view(["GET"])
def course_students(request, course_id):

    # DEBUG: confirm course exists
    if not Course.objects.filter(id=course_id).exists():
        return Response(
            {"error": f"Course with id {course_id} not found"},
            status=404
        )

    enrollments = Enrollment.objects.filter(
        course_id=course_id   #  safest filter
    ).select_related("student")

    students = []
    for e in enrollments:
        students.append({
            "id": e.student.id,
            "name": e.student.name,
            "email": e.student.email,
        })

    return Response(students)
