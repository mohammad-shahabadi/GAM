import secrets

from django.http import HttpResponse, Http404
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from app_api.models import Course, ProblemSet, Submission, Repository
from .gitlab_wrapper import GitLabWrapper
from .helper import gitlab_ci_renderer
from .webhook_dto import GitlabWebhookPipelinePayloadDTO


def render_gitlab_ci(request, course_id, key, problem_set):
    # Called by GitLab CI with the course's GAM_COURSE_SECRET variable in the URL
    course = Course.objects.filter(id=course_id).first()
    if course is None or not secrets.compare_digest(key.encode(), course.git_secret_key.encode()):
        raise Http404
    if not ProblemSet.objects.filter(id=problem_set, course=course).exists():
        raise Http404

    gitlab_ci_yml = gitlab_ci_renderer.generate_gitlab_ci_contents()
    response = HttpResponse(gitlab_ci_yml, content_type='application/x-yaml')
    response['Content-Disposition'] = 'attachment; filename="gitlab-ci.yml"'
    return response


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])  # GitLab authenticates with the X-Gitlab-Token header instead
def gitlabPipelineWebhook(request):
    try:
        payload_data = request.data

        repository = Repository.objects.select_related('problem__problem_set__course').filter(
            git_reference_id=payload_data.get('project', {}).get('id')).first()
        received_token = request.headers.get('X-Gitlab-Token', '')
        if repository is None or not secrets.compare_digest(
                received_token.encode(), repository.problem.problem_set.course.git_secret_key.encode()):
            return Response({'error': 'Invalid webhook token'}, status=status.HTTP_403_FORBIDDEN)

        if payload_data['object_kind'] == "pipeline":
            webhook_dto = GitlabWebhookPipelinePayloadDTO(**payload_data)
            if webhook_dto.object_attributes['status'] == "success":
                save_test_result_by_pipeline_event(webhook_dto)

        return Response({'status': 'Webhook received successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        # Handle validation or deserialization errors
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def save_test_result_by_pipeline_event(webhook_dto: GitlabWebhookPipelinePayloadDTO):
    # todo handle case when pipeline is not successful
    if webhook_dto.object_attributes['status'] == "success":
        gitlab = GitLabWrapper()
        test_report = gitlab.get_test_report(webhook_dto.project['id'], webhook_dto.object_attributes['id'])
        existing_final_submission = Submission.objects.filter(repository__git_reference_id=webhook_dto.project['id'],
                                                              is_final=True).first()

        submission, created = Submission.objects.update_or_create(
            commit_sha=webhook_dto.commit['id'],
            defaults={
                'test_result': test_report.test_suites,
                'status': webhook_dto.object_attributes['status'],
                'score_ratio': test_report.success_count / test_report.total_count,
                'pipeline_id': webhook_dto.object_attributes['id'],
                'repository': Repository.objects.get(git_reference_id=webhook_dto.project['id']),
                'is_final': True if (test_report.success_count / test_report.total_count) > (existing_final_submission.score_ratio if existing_final_submission else -1) else False
            }
        )

        if existing_final_submission and submission.is_final:
            existing_final_submission.is_final = False
            existing_final_submission.save()
