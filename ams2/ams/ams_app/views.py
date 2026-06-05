from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializer import *
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
import string, random
# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework.permissions import BasePermission
# Create your views here.

class CustomeLogin(TokenObtainPairView):
    serializer_class = LoginSerializer


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        if request.user.groups.filter(name = 'teacher'):
            return super().has_permission(request, view)
    

class IsParent(BasePermission):
    def has_permission(self, request, view):
        if request.user.groups.filter(name = 'parent'):
            return super().has_permission(request, view)

class Student_view(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    # permission_classes = [IsAuthenticated]
def genearate(name):

    name = name.split(' ')[0]
    d = string.digits

    d = ''.join(random.choices(d, k=4))
    username = name+d

    return username




class Teacher_view(ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    # http_method_names = ['POST','GET']
    permission_classes = [IsAuthenticated,IsParent]  

    def perform_create(self, serializer):
        name = serializer.validated_data.get('full_name')
        username = password = genearate(name)

        u = User(username=username)
        u.set_password(password)
        u.save()

        serializer.save(user=u)

class AssignClassView(ModelViewSet):
    queryset = Assign_class.objects.all()
    serializer_class = Assignclass_Serializer
    permission_classes = [IsAuthenticated,IsParent]
    http_method_names = ["post","get"]


def student_registration_view(request):
    student_data = Student.objects.all().order_by('-created_at')
    return render(request, 'student_regi.html', {'student_data': student_data})


def teacher_regi_view(request):
    teacher_data = Teacher.objects.all().order_by('-created_at')
    return render(request, 'teacher_regi.html', {'teacher_data': teacher_data})

    
    
