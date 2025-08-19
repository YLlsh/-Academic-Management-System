from django.shortcuts import render, redirect
from .models import *
from home import models

from datetime import date

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

from datetime import date

def student_attendance(request):
    if request.method == "POST":
        pr = request.POST.getlist("Present")
        ab = request.POST.getlist("Absent")

        Students = Student_info.objects.all()
        att=Student_Attendence.objects.all()

        for d in att:
            if d.date == date.today():
                messages.info(request,"Today's attendence are already Done")
                return redirect("/a/")
            
            

        for s in Students:
            if f"Present_{s.std_id}" in pr:
                attendance = True
            elif f"Absent_{s.std_id}" in ab:
                attendance = False
            else:
                continue   # if no selection, skip

            Student_Attendence.objects.create(
                Student=s,
                date=date.today(),
                attendance=attendance,
            )

        messages.info(request,"Today's attendence are Complete")
        return redirect("/a/")
            

  
    Students = Student_info.objects.all()
    context = {
        "Students":Students
    }

    return render(request, 'std_attendence.html',context)