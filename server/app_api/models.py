from django.db import models


# Create your models here.
class Membership(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey('app_auth.User', on_delete=models.CASCADE, related_name='memberships')
    # course permissions
    role = models.CharField(max_length=255, blank=True, default='student')

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('course', 'user'),
                                    name='problems_membership_course_user_uniq'),
        )


class Course(models.Model):
    title = models.CharField(max_length=255)
    members = models.ManyToManyField('app_auth.User', through=Membership)
    password = models.CharField(max_length=255, blank=True, null=True,
                                help_text=("Optional password for joining the course"))
    professor = models.CharField(max_length=255, blank=True, null=True)
    identifier_field = models.CharField(max_length=255, blank=True, null=True,
                                        help_text=("Default field to use for identifier field"))
    # identifier_text = models.CharField(max_length=255, blank=True)
