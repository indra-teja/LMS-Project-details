import uuid
from django.utils.timezone import now, timedelta
from rest_framework.response import Response
from courses.models import Course
from accounts.models import User
from .models import Course, CourseContent
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from enrollments.models import Enrollment
from attendance.models import AttendanceSession
from quizzes.models import Quiz
from django.db.models import Avg, Count, Q
from quizzes.models import QuizAttempt
from attendance.models import AttendanceRecord



import os
from django.conf import settings




# LIST courses
@api_view(['GET'])
def list_courses(request):
    courses = Course.objects.all()

    data = []
    for c in courses:
        data.append({
            "id": c.id,
            "title": c.title,
            "instructor_id": c.instructor.id if c.instructor else None,
            "instructor_name": c.instructor.name if c.instructor else "Not Assigned"
        })

    return Response(data)


# CREATE course
@api_view(['POST'])
def create_course(request):
    title = request.data.get("title")
    instructor_id = request.data.get("instructor_id")

    if not title or not instructor_id:
        return Response({"error": "All fields required"}, status=400)

    try:
        instructor = User.objects.get(id=instructor_id, role="INSTRUCTOR")
    except User.DoesNotExist:
        return Response({"error": "Instructor not found"}, status=404)

    course = Course.objects.create(
        title=title,
        instructor=instructor
    )

    return Response({
        "message": "Course created successfully",
        "id": course.id,
        "instructor_name": instructor.name
    })


# UPDATE course
@api_view(['GET', 'PUT'])
def update_course(request, id):
    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    # ---------- GET ----------
    if request.method == "GET":
        return Response({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "instructor_id": course.instructor.id
        })

    # ---------- PUT ----------
    title = request.data.get("title")
    description = request.data.get("description")
    instructor_id = request.data.get("instructor_id")

    if title:
        course.title = title

    if description:
        course.description = description

    if instructor_id:
        try:
            instructor = User.objects.get(
                id=instructor_id,
                role="INSTRUCTOR"
            )
            course.instructor = instructor
        except User.DoesNotExist:
            return Response(
                {"error": "Instructor not found"},
                status=404
            )

    course.save()
    return Response({"message": "Course updated successfully"})


# DELETE course
@api_view(['DELETE'])
def delete_course(request, id):
    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    course.delete()
    return Response({"message": "Course deleted successfully"})





@api_view(['POST'])
def upload_course_content(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    title = request.POST.get("title")
    content_type = request.POST.get("content_type")

    if not title or not content_type:
        return Response({"error": "Missing fields"}, status=400)

    content = CourseContent(
        course=course,
        title=title,
        content_type=content_type
    )

    if content_type in ["VIDEO", "PDF"]:
        if "file" not in request.FILES:
            return Response({"error": "File required"}, status=400)
        content.file = request.FILES["file"]

    if content_type == "LINK":
        content.video_url = request.POST.get("video_url")

    content.save()
    return Response({"message": "Content uploaded successfully"})



@api_view(['GET'])
def list_course_content(request, course_id):
    contents = CourseContent.objects.filter(course_id=course_id)

    data = []
    for c in contents:
        data.append({
            "id": c.id,
            "title": c.title,
            "content_type": c.content_type,
            "file": c.file.url if c.file else None,
            "video_url": c.video_url,
        })

    return Response(data)



@api_view(['DELETE'])
def delete_course_content(request, content_id):
    try:
        content = CourseContent.objects.get(id=content_id)
    except CourseContent.DoesNotExist:
        return Response({"error": "Content not found"}, status=404)

    # delete file from disk
    if content.file:
        file_path = os.path.join(settings.MEDIA_ROOT, content.file.name)
        if os.path.exists(file_path):
            os.remove(file_path)

    content.delete()
    return Response({"message": "Content deleted successfully"})



@api_view(['GET'])
def instructor_dashboard(request):
    # TEMPORARY: hardcoded instructor (same idea as admin dashboard)
    instructor_id = 2  # instructor@gmail.com (change if needed)

    courses = Course.objects.filter(instructor_id=instructor_id)
    course_ids = courses.values_list("id", flat=True)

    students_count = Enrollment.objects.filter(
        course_id__in=course_ids
    ).values("student").distinct().count()

    quizzes_count = Quiz.objects.filter(
        course_id__in=course_ids
    ).count()

    attendance_sessions = AttendanceSession.objects.filter(
        instructor_id=instructor_id
    ).count()

    return Response({
        "courses": courses.count(),
        "students": students_count,
        "quizzes": quizzes_count,
        "attendance_sessions": attendance_sessions
    })




@api_view(['POST'])
def add_course(request):
    title = request.data.get("title")
    description = request.data.get("description")

    # TEMP: hardcoded instructor (same pattern as admin)
    instructor = User.objects.get(email="instructor@gmail.com")

    course = Course.objects.create(
        title=title,
        description=description,
        instructor=instructor
    )

    return Response({
        "message": "Course created successfully",
        "course_id": course.id
    })




@api_view(['POST'])
def upload_course_content(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return Response(
            {"error": "Course not found"},
            status=404
        )

    content_type = request.data.get("content_type")
    title = request.data.get("title")

    if not title or not content_type:
        return Response(
            {"error": "Title and content type are required"},
            status=400
        )

    if content_type in ["VIDEO", "PDF"]:
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "File missing"},
                status=400
            )

        CourseContent.objects.create(
            course=course,
            title=title,
            content_type=content_type,
            file=file
        )

    elif content_type == "LINK":
        video_url = request.data.get("video_url")
        if not video_url:
            return Response(
                {"error": "Video URL missing"},
                status=400
            )

        CourseContent.objects.create(
            course=course,
            title=title,
            content_type=content_type,
            video_url=video_url
        )

    else:
        return Response(
            {"error": "Invalid content type"},
            status=400
        )

    return Response(
        {"message": "Content added successfully"},
        status=201
    )



# ================= Instructor: List Courses =================
@api_view(["GET"])
def instructor_list_courses(request):
    # TEMP: hardcoded instructor
    instructor = User.objects.get(email="instructor@gmail.com")

    courses = Course.objects.filter(instructor=instructor)

    data = []
    for c in courses:
        data.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "is_active": c.is_active,
            "created_at": c.created_at,
        })

    return Response(data)


# ================= Instructor: Delete Course =================
@api_view(["DELETE"])
def instructor_delete_course(request, course_id):
    try:
        course = Course.objects.get(id=course_id)
        course.delete()
        return Response({"message": "Course deleted"})
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)






@api_view(["GET"])
def student_performance(request):
    search = request.GET.get("search")

    if not search:
        return Response({"error": "Search parameter required"}, status=400)

    try:
        student = User.objects.get(
            Q(email__icontains=search) | Q(name__icontains=search),
            role="STUDENT"
        )
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)
    except User.MultipleObjectsReturned:
        return Response(
            {"error": "Multiple students found. Please refine search."},
            status=400
        )

    # ---------- Quiz Performance ----------
    quiz_data = QuizAttempt.objects.filter(student=student).aggregate(
        avg_score=Avg("score"),
        avg_total=Avg("total_marks")
    )

    quiz_percentage = 0
    if quiz_data["avg_total"]:
        quiz_percentage = round(
            (quiz_data["avg_score"] / quiz_data["avg_total"]) * 100, 2
        )

    # ---------- Attendance ----------
    total_classes = AttendanceRecord.objects.filter(
        student=student
    ).values("session").distinct().count()

    present_classes = AttendanceRecord.objects.filter(
        student=student
    ).count()

    attendance_percentage = (
        round((present_classes / total_classes) * 100, 2)
        if total_classes > 0 else 0
    )

    # ---------- Status ----------
    if quiz_percentage >= 75 and attendance_percentage >= 80:
        status = "Good"
    elif quiz_percentage >= 50:
        status = "Average"
    else:
        status = "Needs Improvement"

    return Response({
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
        },
        "quiz_percentage": quiz_percentage,
        "attendance_percentage": attendance_percentage,
        "status": status
    })
