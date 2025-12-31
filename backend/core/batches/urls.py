from django.urls import path
from .views import list_batches

urlpatterns = [
    path("admin/batches/", list_batches, name="list-batches"),
]
