from django.db import models
from datetime import date,datetime

# Create your models here.

class Student_info(models.Model):
    student_name = models.CharField(max_length=100)
    std_id = models.IntegerField(unique=True)
    bod =  models.DateField(default='2000-01-01')
    age = models.IntegerField()

    gender_choice= [ 
        ('M','Male'),
        ('F','Female')
        ]
    
    gender = models.CharField(default=True ,max_length=7, choices=gender_choice)
    email = models.EmailField(unique=True)
    registration_date = models.DateField(auto_now_add=True)
    contact = models.IntegerField()
    student_class = models.CharField(max_length=10, default=True)

    def save(self, *args, **kwargs):

        if (self.bod):
          bod = datetime.strptime(self.bod ,'%Y-%m-%d').date()
          today = date.today()
          self.age = today.year - bod.year - ((today.month,today.day) < (bod.month, bod.day))
        super().save(*args,**kwargs)



class student_attendence(models.Model):
    student = models.ForeignKey(Student_info,default=None ,on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    attendance = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'date'], name='unique_attendance_per_day')
        ]