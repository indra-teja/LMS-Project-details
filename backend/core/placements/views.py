from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now
from .models import Placement, PlacementApplication
from accounts.models import User

# =====================================================
# STUDENT APIs
# =====================================================

@api_view(["GET"])
def student_placements(request):
    user_id = request.GET.get("user_id")
    if not user_id:
        return Response({"error": "User required"}, status=400)

    placements = Placement.objects.all().order_by("-created_at")
    applied_ids = PlacementApplication.objects.filter(
        student_id=user_id
    ).values_list("placement_id", flat=True)

    data = []
    for p in placements:
        status = "ACTIVE" if p.is_active and p.deadline >= now().date() else "CLOSED"
        data.append({
            "id": p.id,
            "company_name": p.company_name,
            "role": p.role,
            "eligibility": p.eligibility,
            "apply_link": p.apply_link,
            "deadline": p.deadline,
            "status": status,
            "applied": p.id in applied_ids
        })

    return Response(data)


@api_view(["POST"])
def apply_placement(request):
    user_id = request.data.get("user_id")
    placement_id = request.data.get("placement_id")

    if not user_id or not placement_id:
        return Response({"error": "Invalid data"}, status=400)

    PlacementApplication.objects.get_or_create(
        student_id=user_id,
        placement_id=placement_id
    )

    return Response({"message": "Applied successfully"})


# =====================================================
# ADMIN / INSTRUCTOR APIs
# =====================================================

# placements/views.py
from placements.models import Placement
from courses.models import Course
from accounts.models import User

@api_view(["POST"])
def create_placement(request):
    data = request.data

    required_fields = [
        "company_name",
        "role",
        "eligibility",
        "apply_link",
        "deadline",
        "course_id",
    ]

    for field in required_fields:
        if not data.get(field):
            return Response(
                {"error": f"{field} is required"},
                status=400
            )

    try:
        course = Course.objects.get(id=int(data["course_id"]))
    except (Course.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Invalid course"}, status=400)

    placement = Placement.objects.create(
        company_name=data["company_name"],
        role=data["role"],
        eligibility=data["eligibility"],
        apply_link=data["apply_link"],
        deadline=data["deadline"],
        course=course,
        created_by_id=data.get("created_by"),
        is_active=True
    )

    return Response(
        {"message": "Placement created successfully", "id": placement.id},
        status=201
    )

# =========================
# ADMIN / INSTRUCTOR LIST
# =========================
@api_view(["GET"])
def manage_placements(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return Response({"error": "user_id required"}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # 🔹 ADMIN → all placements
    if user.role == "ADMIN":
        placements = Placement.objects.select_related("course").all()

    # 🔹 INSTRUCTOR → only their course placements
    elif user.role == "INSTRUCTOR":
        courses = Course.objects.filter(instructor=user)
        placements = Placement.objects.select_related("course").filter(course__in=courses)

    else:
        return Response({"error": "Not allowed"}, status=403)

    data = []
    for p in placements.order_by("-created_at"):
        data.append({
            "id": p.id,
            "company_name": p.company_name,
            "role": p.role,
            "deadline": p.deadline,
            "is_active": p.is_active,
            "status": "ACTIVE" if p.is_active and p.deadline >= now().date() else "CLOSED",
            "course": p.course.title,  # ✅ REQUIRED
        })

    return Response(data)


# =========================
# TOGGLE STATUS
# =========================
@api_view(["POST"])
def toggle_placement(request):
    placement_id = request.data.get("placement_id")

    if not placement_id:
        return Response({"error": "placement_id required"}, status=400)

    try:
        placement = Placement.objects.get(id=placement_id)
    except Placement.DoesNotExist:
        return Response({"error": "Placement not found"}, status=404)

    placement.is_active = not placement.is_active
    placement.save()

    return Response({
        "message": "Status updated",
        "is_active": placement.is_active
    })


# =========================
# DELETE (ADMIN ONLY)
# =========================
@api_view(["DELETE"])
def delete_placement(request):
    user_id = request.data.get("user_id")
    placement_id = request.data.get("placement_id")

    if not user_id or not placement_id:
        return Response({"error": "Invalid data"}, status=400)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if user.role != "ADMIN":
        return Response({"error": "Admin only"}, status=403)

    Placement.objects.filter(id=placement_id).delete()
    return Response({"message": "Placement deleted"})


# placements/views.py
from enrollments.models import Enrollment

@api_view(["GET"])
def student_placements(request):
    student_id = request.GET.get("student_id")

    if not student_id:
        return Response({"error": "student_id required"}, status=400)

    try:
        student = User.objects.get(id=student_id, role="STUDENT")
    except User.DoesNotExist:
        return Response({"error": "Invalid student"}, status=404)

    enrolled_courses = Enrollment.objects.filter(
        student=student
    ).values_list("course_id", flat=True)

    placements = Placement.objects.filter(
        course_id__in=enrolled_courses,
        is_active=True
    ).order_by("-created_at")

    data = []
    for p in placements:
        data.append({
            "id": p.id,
            "company_name": p.company_name,
            "role": p.role,
            "eligibility": p.eligibility,
            "apply_link": p.apply_link,
            "deadline": p.deadline,
            "status": p.status(),
            "course": p.course.title,
            "created_at": p.created_at
        })

    return Response(data)


@api_view(["GET"])
def instructor_placements(request):
    instructor_id = request.GET.get("instructor_id")

    courses = Course.objects.filter(instructor_id=instructor_id)

    placements = Placement.objects.filter(course__in=courses)

    data = []
    for p in placements:
        data.append({
            "id": p.id,
            "company_name": p.company_name,
            "role": p.role,
            "deadline": p.deadline,
            "status": p.status(),
            "is_active": p.is_active,
            "course": p.course.title,
        })

    return Response(data)
