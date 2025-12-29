from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now
from datetime import timedelta
import uuid
from django.views.decorators.csrf import csrf_exempt
from attendance.models import AttendanceSession, AttendanceRecord
from courses.models import Course
from enrollments.models import Enrollment
from accounts.models import User


@csrf_exempt
@api_view(["POST"])
def generate_attendance_qr(request):
    course_id = request.data.get("course_id")
    instructor_id = request.data.get("instructor_id")

    if not course_id or not instructor_id:
        return Response({"error": "Invalid data"}, status=400)

    try:
        instructor = User.objects.get(id=instructor_id, role="INSTRUCTOR")
    except User.DoesNotExist:
        return Response({"error": "Only instructors allowed"}, status=403)

    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Invalid course"}, status=404)

    if course.instructor_id != instructor.id:
        return Response(
            {"error": "Course not assigned to this instructor"},
            status=403
        )

    session = AttendanceSession.objects.create(
        course=course,
        instructor=instructor,
        token=str(uuid.uuid4()),
        expires_at=now() + timedelta(minutes=5),
        is_active=True
    )

    return Response({
        "token": session.token,
        "expires_at": session.expires_at
    })



@api_view(["POST"])
def mark_attendance(request):
    student_id = request.data.get("student_id")
    token = request.data.get("token")

    if not student_id or not token:
        return Response({"error": "Invalid data"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    try:
        session = AttendanceSession.objects.get(token=token, is_active=True)
    except AttendanceSession.DoesNotExist:
        return Response({"error": "Invalid or expired token"}, status=404)

    if session.is_expired():
        session.is_active = False
        session.save()
        return Response({"error": "Token expired"}, status=400)

    # ✅ check enrollment
    if not Enrollment.objects.filter(student=student, course=session.course).exists():
        return Response({"error": "Student not enrolled"}, status=403)

    AttendanceRecord.objects.get_or_create(
        session=session,
        student=student
    )

    return Response({"message": "Attendance marked successfully"})


@api_view(["GET"])
def student_attendance_summary(request):
    student_id = request.GET.get("student_id")

    present = AttendanceRecord.objects.filter(student_id=student_id).count()
    total = AttendanceSession.objects.filter(
        course__enrollment__student_id=student_id
    ).count()

    return Response({
        "present": present,
        "absent": max(total - present, 0)
    })

