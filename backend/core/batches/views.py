from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Batch

@api_view(["GET"])
def list_batches(request):
    batches = Batch.objects.all().values("id", "name")
    return Response(batches)
