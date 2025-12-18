from django.urls import path
from django.http import HttpResponse

def n_demo(request):
    obj = HttpResponse("This is demo code of notifications.")
    return obj


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Query

# List all student queries
@api_view(['GET'])
def list_queries(request):
    queries = Query.objects.all().order_by("-created_at")

    data = []
    for q in queries:
        data.append({
            "id": q.id,
            "student": q.student.name,
            "question": q.question,
            "reply": q.reply,
            "is_resolved": q.is_resolved
        })

    return Response(data)


# Reply to a query
@api_view(['POST'])
def reply_query(request, id):
    try:
        query = Query.objects.get(id=id)
    except Query.DoesNotExist:
        return Response({"error": "Query not found"}, status=404)

    reply = request.data.get("reply")
    if not reply:
        return Response({"error": "Reply required"}, status=400)

    query.reply = reply
    query.is_resolved = True
    query.save()

    return Response({"message": "Reply sent successfully"})
