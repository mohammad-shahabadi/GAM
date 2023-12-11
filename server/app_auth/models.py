from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    student_number = models.CharField(max_length=10, blank=True, null=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Role(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return self.role


class UserRoles(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roles = models.ManyToManyField(Role)

    def __str__(self):
        return f"{self.user.username} - {', '.join(role.role for role in self.roles.all())}"
