from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import User
from courses.models import Course

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


@api_view(['POST'])
def create_student(request):
    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response(
            {"error": "All fields required"},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"},
            status=400
        )

    student = User.objects.create_user(
        name=name,
        email=email,
        password=password,
        role="STUDENT"
    )

    return Response({
        "message": "Student created successfully",
        "id": student.id
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
