from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
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

    def perform_create(self, serializer):
        guardian_phone = serializer.validated_data.get('guardian_phone')
        guardian_name = serializer.validated_data.get('guardian_name')
        if guardian_phone:
            guardian_phone = guardian_phone.strip()
            if not User.objects.filter(username=guardian_phone).exists():
                parent_user = User(username=guardian_phone, role="perents")
                parent_user.set_password(guardian_phone)
                parent_user.save()
        serializer.save()

    @action(detail=True, methods=['get'])
    def family_details(self, request, pk=None):
        student = self.get_object()
        siblings = Student.objects.filter(guardian_phone=student.guardian_phone).exclude(id=student.id)
        
        sibling_list = []
        for s in siblings:
            sibling_list.append({
                "student_id": s.student_id,
                "full_name": s.full_name,
                "student_class": s.student_class,
                "email": s.email,
                "phone": s.phone
            })
            
        data = {
            "student_id": student.student_id,
            "full_name": student.full_name,
            "student_class": student.student_class,
            "email": student.email,
            "phone": student.phone,
            "address": student.address,
            "guardian_name": student.guardian_name,
            "guardian_phone": student.guardian_phone,
            "siblings": sibling_list
        }
        return Response(data)
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
    # permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        name = serializer.validated_data.get('full_name')
        username = password = genearate(name)

        u = User(username=username, role="teacher")
        u.set_password(password)
        u.save()

        serializer.save(user=u)

class AssignClassView(ModelViewSet):
    queryset = Assign_class.objects.all()
    serializer_class = Assignclass_Serializer
    # permission_classes = [IsAuthenticated,IsParent]
    http_method_names = ["post","get"]


def student_registration_view(request):
    student_data = Student.objects.all().order_by('-created_at')
    return render(request, 'student_regi.html', {'student_data': student_data})


def teacher_regi_view(request):
    teacher_data = Teacher.objects.all().order_by('-created_at')
    return render(request, 'teacher_regi.html', {'teacher_data': teacher_data})


from django.http import JsonResponse

def parent_check_api(request):
    phone = request.GET.get('phone', '').strip()
    if not phone:
        return JsonResponse({'exists': False, 'message': 'Phone is required.'}, status=400)
    
    parent = User.objects.filter(username=phone, role='perents').first()
    if parent:
        student = Student.objects.filter(guardian_phone=phone).first()
        guardian_name = student.guardian_name if student else "Parent"
        return JsonResponse({'exists': True, 'name': guardian_name})
    else:
        return JsonResponse({'exists': False})


def progress_view(request):
    student_data = Student.objects.all().order_by('-created_at')
    return render(request, 'progress.html', {'student_data': student_data})


def student_progress_detail_view(request, student_id):
    try:
        student = Student.objects.get(id=student_id)
    except Student.DoesNotExist:
        student = Student.objects.get(student_id=student_id)
        
    monthly_progress = [
        {"month": "January", "attendance": "95%", "grade": "A+", "performance": "Excellent progress in science and maths."},
        {"month": "February", "attendance": "92%", "grade": "A", "performance": "Consistent performance in all subjects."},
        {"month": "March", "attendance": "98%", "grade": "A+", "performance": "Outstanding performance in term exams."},
        {"month": "April", "attendance": "89%", "grade": "B+", "performance": "Needs slight improvement in literature."},
        {"month": "May", "attendance": "94%", "grade": "A", "performance": "Very active participation in classroom activities."}
    ]
    return render(request, 'student_progress.html', {
        'student': student,
        'monthly_progress': monthly_progress
    })


from rest_framework_simplejwt.authentication import JWTAuthentication

class ParentStudentsAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        parent_phone = request.user.username
        students = Student.objects.filter(guardian_phone=parent_phone)
        
        student_list = []
        for s in students:
            student_list.append({
                "id": s.id,
                "student_id": s.student_id,
                "full_name": s.full_name,
                "student_class": s.student_class,
                "course": s.course or "-",
                "email": s.email,
                "phone": s.phone,
                "attendance": "94%",
                "grade": "A",
                "teacher": "Mr. Sharma (Maths)",
                "progress": [
                    {"month": "January", "attendance": "95%", "grade": "A+", "remarks": "Excellent progress."},
                    {"month": "February", "attendance": "92%", "grade": "A", "remarks": "Consistently good."},
                    {"month": "March", "attendance": "98%", "grade": "A+", "remarks": "Outstanding exam score."},
                    {"month": "April", "attendance": "89%", "grade": "B+", "remarks": "Needs focus on biology."},
                    {"month": "May", "attendance": "94%", "grade": "A", "remarks": "Good overall results."}
                ]
            })
        return Response(student_list)

