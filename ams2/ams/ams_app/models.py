from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomeUser(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("perents", "Perents")
    )
    
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)  # its allowe dublicate yet
    phone = models.CharField(max_length=15)

    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, blank=True, null=True)

    course = models.CharField(max_length=50, blank=True, null=True)
    student_class = models.CharField(max_length=100, blank=True, null=True)

    address = models.TextField()

    guardian_name = models.CharField(max_length=100, blank=True, null=True)
    guardian_phone = models.CharField(max_length=15, blank=True, null=True)

    student_photo = models.ImageField(blank=True, null=True, upload_to="student_photo")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_id} - {self.full_name}"



class Teacher(models.Model):
    # ================= Basic Info =================
    teacher_id = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(CustomeUser, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)

    # ================= Personal Info =================
    date_of_joining = models.DateField()

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    # ================= Academic Info =================
    DEPARTMENT_CHOICES = [
        ("science", "Science"),
        ("commerce", "Commerce"),
        ("arts", "Arts"),
        ("maths", "Mathematics"),
        ("computer", "Computer"),
    ]
    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES)

    qualification = models.CharField(max_length=100)
    address = models.TextField()

    emergency_name = models.CharField(max_length=100, blank=True, null=True)

    emergency_phone = models.CharField(max_length=10, blank=True, null=True)

    teacher_photo = models.ImageField(upload_to="teachers/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher_id} - {self.full_name}"


class Assign_class(models.Model):
    class_name = models.CharField(max_length=50)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    start = models.TimeField()
    end = models.TimeField()
    for_date = models.DateField()
    create_at = models.DateTimeField(auto_now_add=True)
    
