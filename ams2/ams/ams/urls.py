"""
URL configuration for ams project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from ams_app.views import *
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf.urls.static import static
from django.conf import settings
from django.urls import include
router = DefaultRouter()

router.register('Student_view',Student_view,basename='Student_view')
router.register('Teacher_view',Teacher_view,basename='Teacher_view')
router.register('AssignClassView',AssignClassView,basename='AssignClassView')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include(router.urls)),
    path('api/access/',CustomeLogin.as_view(),name='access'),
    path('api/refresh/',TokenRefreshView.as_view(),name='refresh'),

    path("login/", TemplateView.as_view(template_name='login.html'), name="login"),
    path("dashboard", TemplateView.as_view(template_name='dashbaord.html'), name="dashboard"),
    path("teacher_page", TemplateView.as_view(template_name='teacher_page.html'), name="teacher_page"),
    path("attendance", TemplateView.as_view(template_name='attendance.html'), name="attendance"),
    path("student_page", TemplateView.as_view(template_name='student_page.html'), name="student_page"),
    # path("student_attendance/", student_attendance, name="student_attendance"),
    path("teacher_regi/", teacher_regi_view, name="teacher_regi"),
    path("assign_class/", TemplateView.as_view(template_name='assign_class.html'), name="assign_class"),

    path('student_registration',student_registration_view, name='student_registration'),
    
    path('api/parent-check/', parent_check_api, name='parent_check_api'),
    path('progress/', progress_view, name='progress'),
    path('student_progress/<int:student_id>/', student_progress_detail_view, name='student_progress_detail'),
    
    path('parent_page/', TemplateView.as_view(template_name='parent_page.html'), name='parent_page'),
    path('api/parent-students/', ParentStudentsAPI.as_view(), name='parent_students_api')
]
# urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
