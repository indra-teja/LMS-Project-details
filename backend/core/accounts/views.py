from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import User
from enrollments.models import Enrollment
from courses.models import Course
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.hashers import check_password

from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth.hashers import make_password






@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=400
        )

    user = authenticate(request, email=email, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=401
        )

    if not user.is_active:
        return Response(
            {"error": "Account deactivated"},
            status=403
        )

    return Response({
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "role": user.role
    })




@api_view(['GET'])
def admin_dashboard(request):
    total_students = User.objects.filter(role='STUDENT').count()
    total_instructors = User.objects.filter(role='INSTRUCTOR').count()
    total_admins = User.objects.filter(role='ADMIN').count()
    active_users = User.objects.filter(is_active=True).count()
    total_courses = Course.objects.count()

    return Response({
        "students": total_students,
        "instructors": total_instructors,
        "admins": total_admins,
        "active_users": active_users,
        "courses": total_courses
    })





@api_view(['GET'])
def list_students(request):
    students = User.objects.filter(role='STUDENT')

    data = []
    for s in students:
        data.append({
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "is_active": s.is_active
        })

    return Response(data)


@api_view(["POST"])
def create_student(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")
    courses = request.data.get("courses", [])

    if not name or not email or not password:
        return Response({"error": "All fields required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    # Create student
    student = User.objects.create_user(
        name=name,
        email=email,
        password=password,
        role="STUDENT"
    )

    # Enroll student to selected courses
    for course_id in courses:
        try:
            course = Course.objects.get(id=course_id)
            Enrollment.objects.create(
                student=student,
                course=course
            )
        except Course.DoesNotExist:
            continue

    return Response({
        "message": "Student created successfully",
        "id": student.id,
        "name": student.name,
        "email": student.email
    })


@api_view(['PUT'])
def update_student(request, id):
    try:
        student = User.objects.get(id=id, role="STUDENT")
    except User.DoesNotExist:
        return Response(
            {"error": "Student not found"},
            status=404
        )

    student.name = request.data.get("name", student.name)
    student.email = request.data.get("email", student.email)
    student.save()

    return Response({"message": "Student updated successfully"})



@api_view(['DELETE'])
def delete_student(request, id):
    try:
        student = User.objects.get(id=id, role="STUDENT")
    except User.DoesNotExist:
        return Response(
            {"error": "Student not found"},
            status=404
        )

    student.delete()
    return Response({"message": "Student deleted successfully"})



# LIST instructors
@api_view(['GET'])
def list_instructors(request):
    instructors = User.objects.filter(role='INSTRUCTOR')

    data = []
    for i in instructors:
        data.append({
            "id": i.id,
            "name": i.name,
            "email": i.email,
            "is_active": i.is_active
        })

    return Response(data)


# CREATE instructor
@api_view(['POST'])
def create_instructor(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response({"error": "All fields required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    instructor = User.objects.create_user(
        name=name,
        email=email,
        password=password,
        role="INSTRUCTOR"
    )

    return Response({
        "message": "Instructor created successfully",
        "id": instructor.id
    })


# UPDATE instructor
@api_view(['PUT'])
def update_instructor(request, id):
    try:
        instructor = User.objects.get(id=id, role="INSTRUCTOR")
    except User.DoesNotExist:
        return Response({"error": "Instructor not found"}, status=404)

    instructor.name = request.data.get("name", instructor.name)
    instructor.email = request.data.get("email", instructor.email)
    instructor.save()

    return Response({"message": "Instructor updated successfully"})


# DELETE instructor
@api_view(['DELETE'])
def delete_instructor(request, id):
    try:
        instructor = User.objects.get(id=id, role="INSTRUCTOR")
    except User.DoesNotExist:
        return Response({"error": "Instructor not found"}, status=404)

    instructor.delete()
    return Response({"message": "Instructor deleted successfully"})





@api_view(["GET", "PUT"])
def instructor_profile(request):
    # For now, pick the first instructor (no auth as you requested)
    instructor = User.objects.filter(role="INSTRUCTOR").first()

    if not instructor:
        return Response({"error": "Instructor not found"}, status=404)

    # ---------- GET PROFILE ----------
    if request.method == "GET":
        return Response({
            "id": instructor.id,
            "name": instructor.name,
            "email": instructor.email,
            "role": instructor.role,
            "profile_photo": (
                instructor.profile_photo.url
                if instructor.profile_photo else None
            ),
        })

    # ---------- UPDATE PROFILE ----------
    if request.method == "PUT":
        instructor.name = request.data.get("name", instructor.name)

        if request.FILES.get("profile_photo"):
            instructor.profile_photo = request.FILES["profile_photo"]

        instructor.save()
        return Response({"message": "Profile updated successfully"})
    




@api_view(["GET"])
def student_profile(request):
    student_id = request.GET.get("student_id")

    if not student_id:
        return Response({"error": "Student ID required"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    return Response({
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "profile_photo": student.profile_photo.url if student.profile_photo else None
    })


@api_view(["POST"])
def update_student_profile(request):
    student_id = request.POST.get("student_id")

    if not student_id:
        return Response({"error": "Student ID required"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Student not found"}, status=404)

    student.name = request.POST.get("name", student.name)
    student.phone = request.POST.get("phone", student.phone)

    if request.FILES.get("profile_photo"):
        student.profile_photo = request.FILES["profile_photo"]

    student.save()

    return Response({
        "message": "Profile updated successfully",
        "profile_photo": student.profile_photo.url if student.profile_photo else None
    })







@api_view(["POST"])
def change_password(request):
    user_id = request.data.get("user_id")
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user_id or not old_password or not new_password:
        return Response({"error": "All fields are required"}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully"})


# Email Sending Code 

@api_view(["GET"])
def test_email(request):
    send_mail(
        subject="Test Email from LMS",
        message="If you received this email, Django email setup is working.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["steffantao04@gmail.com"],
        fail_silently=False,
    )
    return Response({"message": "Test email sent successfully"})


@api_view(["POST"])
def create_student(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")
    courses = request.data.get("courses", [])

    if not name or not email or not password:
        return Response({"error": "All fields are required"}, status=400)

    # Create student
    student = User.objects.create(
        name=name,
        email=email,
        role="STUDENT",
        password=make_password(password),
    )

    # Assign courses if any
    if courses:
        student.courses.set(courses)

    # ======================
    # SEND EMAIL
    # ======================
    subject = "Welcome to LMS – Your Login Details"

    message = f"""
Hello {name},

Welcome to our Learning Management System.

Your login credentials are below:

Login URL: http://localhost:5173/login
Email: {email}
Password: {password}

Please log in and change your password after first login.

Regards,
LMS Admin Team
"""

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

    return Response(
        {
            "message": "Student created and email sent",
            "id": student.id,
            "email": student.email,
        },
        status=201,
    )
