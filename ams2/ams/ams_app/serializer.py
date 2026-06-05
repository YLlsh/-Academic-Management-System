from .models import *

from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class LoginSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        if user.role:
            data["role"] = user.role
        elif user.groups.filter(name = "clerk" ).exists():
            data["role"] = "clerk"
        elif user.groups.filter(name = "teacher").exists():
            data["role"] = "teacher"
        elif user.groups.filter(name = "admin").exists():
            data["role"] = "admin"

        return data
     

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['created_at','updated_at']

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'
        read_only_fields = ['user','created_at']

from datetime import datetime

class Assignclass_Serializer(serializers.ModelSerializer):

    teacher_name = serializers.CharField(source = 'teacher.full_name',read_only = True)
    
    time_slot = serializers.CharField(write_only = True)

    class Meta:
        model = Assign_class
        fields = ['teacher_name', 'class_name','teacher','time_slot','for_date']
        read_only_fields = ['create_at']

    def create(self, validated_data):

        time_slot = validated_data.pop('time_slot')

        if time_slot:
            start , end =  time_slot.split(' ')
            format = '%H:%M'
            start = datetime.strptime(start,format)

            end = datetime.strptime(end,format)

            validated_data['start'] = start
            validated_data['end'] = end
            
        return Assign_class.objects.create(**validated_data)
    
    
    
    
    
# class GetGuidance(serializers.ModelSerializer):
#     class Meta:
#         model = User