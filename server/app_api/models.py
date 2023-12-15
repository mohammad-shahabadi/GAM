from django.db import models


# Create your models here.
class Membership(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey('app_auth.User', on_delete=models.CASCADE, related_name='memberships')
    # course permissions
    role = models.CharField(max_length=255, blank=True, default='student')
    git_reference_id = models.IntegerField(blank=True, null=True)

    class Meta:
        constraints = (
            models.UniqueConstraint(fields=('course', 'user'),
                                    name='problems_membership_course_user_uniq'),
        )


class Course(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=255, blank=True, null=True)
    members = models.ManyToManyField('app_auth.User', through=Membership)
    password = models.CharField(max_length=255, blank=True, null=True,
                                help_text="Optional password for joining the course")
    professor = models.CharField(max_length=255, blank=True, null=True)
    identifier_field = models.CharField(max_length=255, blank=True, null=True,
                                        help_text="Default field to use for identifier field")
    git_path = models.CharField(max_length=30)
    git_reference_id = models.IntegerField(blank=True, null=True)


class ProblemSet(models.Model):
    title = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='problem_sets')
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)


class Problem(models.Model):
    title = models.CharField(max_length=255)
    priority = models.PositiveIntegerField(blank=True, null=True,
                                           help_text="Order of this problem in problem set")
    problem_set = models.ForeignKey(ProblemSet, on_delete=models.CASCADE, related_name='problems')
    points = models.PositiveIntegerField()
    content = models.TextField(blank=True, null=True)
    # token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True,
    #                          help_text="Secret token for problem operations")
    # template = models.FilePathField(path=settings.TESTERS_TEMPLATE_DIR, recursive=False,
    #                                 allow_files=False, allow_folders=True)
    # gitlab_id = models.BigIntegerField(unique=True, blank=True)
    # gitlab_path = models.CharField(max_length=255, blank=True)
