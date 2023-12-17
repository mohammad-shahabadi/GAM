from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    student_number = models.CharField(max_length=10, blank=True, null=True)
    git_reference_id = models.IntegerField(blank=True, null=True)
    role = models.CharField(max_length=10)

    def __str__(self):
        return self.username
