from django.shortcuts import render, redirect
from home.models import *

from django.contrib import messages
# Create your views

def student_regi(request):
    if request.method == "POST":
        student_name = request.POST.get("student_name")
        std_id = request.POST.get("std_id")
        bod = request.POST.get("bod")
        gender = request.POST.get("gender")
        email = request.POST.get("email")
        contact = request.POST.get("contact")
        student_class = request.POST.get("student_class")

        Student_info.objects.create(
            student_name = student_name,
            std_id = std_id,
            bod = bod,
            gender = gender,
            email = email,
            contact = contact,
            student_class = student_class
        )
        messages.info(request, "Registration Success")
        return redirect("/")
    return render(request, "std_regi.html")

