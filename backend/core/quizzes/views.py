from django.urls import path
from django.http import HttpResponse

def q_demo(request):
    obj = HttpResponse("This is demo code of quizzes.")
    return obj
