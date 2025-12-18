import uuid
from django.utils.timezone import now, timedelta
from rest_framework.decorators import api_view
from rest_framework.response import Response
from courses.models import Course
from accounts.models import User
from .models import Course, CourseContent

import os
from django.conf import settings



@api_view(['POST'])
def generate_attendance_qr(request):
    course_id = request.data.get('course_id')

    token = str(uuid.uuid4())
    expires_at = now() + timedelta(minutes=5)

    data = {
        "course_id": course_id,
        "token": token,
        "expires_at": expires_at
    }

    return Response(data)






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
@api_view(['PUT'])
def update_course(request, id):
    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=404)

    title = request.data.get("title")
    instructor_id = request.data.get("instructor_id")

    if title:
        course.title = title

    if instructor_id:
        try:
            instructor = User.objects.get(id=instructor_id, role="INSTRUCTOR")
            course.instructor = instructor
        except User.DoesNotExist:
            return Response({"error": "Instructor not found"}, status=404)

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
