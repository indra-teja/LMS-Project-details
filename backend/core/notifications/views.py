from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import User
from notifications.models import Query


# ================= STUDENT: CREATE QUERY =================
@api_view(["POST"])
def create_query(request):
    print("DEBUG POST DATA:", request.data)

    student_id = request.data.get("student_id")
    question = request.data.get("question")

    # strict validation
    if student_id in [None, "", "null"]:
        return Response({"error": "Student not logged in"}, status=400)

    if not question or not question.strip():
        return Response({"error": "Question cannot be empty"}, status=400)

    try:
        student = User.objects.get(id=int(student_id), role="STUDENT")
    except (User.DoesNotExist, ValueError):
        return Response({"error": "Invalid student"}, status=404)

    Query.objects.create(
        student=student,
        question=question.strip()
    )

    return Response({"message": "Query submitted successfully"})


# ================= STUDENT: VIEW OWN QUERIES =================
@api_view(["GET"])
def student_queries(request):
    student_id = request.GET.get("student_id")

    if student_id in [None, "", "null"]:
        return Response({"error": "Student not logged in"}, status=400)

    queries = Query.objects.filter(
        student_id=student_id
    ).order_by("-created_at")

    data = []
    for q in queries:
        data.append({
            "id": q.id,
            "question": q.question,
            "reply": q.reply,
            "is_resolved": q.is_resolved,
            "created_at": q.created_at,
        })

    return Response(data)


# ================= ADMIN: LIST ALL QUERIES =================
@api_view(["GET"])
def admin_list_queries(request):
    queries = Query.objects.select_related("student").order_by("-created_at")

    data = []
    for q in queries:
        data.append({
            "id": q.id,
            "student": q.student.name,
            "email": q.student.email,
            "question": q.question,
            "reply": q.reply,
            "is_resolved": q.is_resolved,
            "created_at": q.created_at,
        })

    return Response(data)


# ================= INSTRUCTOR: LIST ALL QUERIES =================
@api_view(["GET"])
def instructor_queries(request):
    queries = Query.objects.select_related("student").order_by("-created_at")

    data = []
    for q in queries:
        data.append({
            "id": q.id,
            "student": q.student.name,
            "email": q.student.email,
            "question": q.question,
            "reply": q.reply,
            "is_resolved": q.is_resolved,
            "created_at": q.created_at,
        })

    return Response(data)


# ================= ADMIN / INSTRUCTOR: REPLY =================
@api_view(["POST"])
def reply_query(request, query_id):
    reply_text = request.data.get("reply")

    if not reply_text or not reply_text.strip():
        return Response({"error": "Reply cannot be empty"}, status=400)

    try:
        query = Query.objects.get(id=query_id)
    except Query.DoesNotExist:
        return Response({"error": "Query not found"}, status=404)

    query.reply = reply_text.strip()
    query.is_resolved = True
    query.save()

    return Response({"message": "Reply sent successfully"})
