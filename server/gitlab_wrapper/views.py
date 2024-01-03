from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .gitlab_wrapper import GitLabWrapper
from .webhook_dto import GitlabWebhookPipelinePayloadDTO, TestReportDTO
from app_api.models import Submission, Repository
from django.http import HttpResponse
from .helper import gitlab_ci_renderer


def render_gitlab_ci(request, class_id, key, problem_set):
    gitlab_ci_yml = gitlab_ci_renderer.generate_gitlab_ci_contents()
    response = HttpResponse(gitlab_ci_yml, content_type='application/x-yaml')
    response['Content-Disposition'] = 'attachment; filename="gitlab-ci.yml"'
    return response


@api_view(['POST'])
def gitlabPipelineWebhook(request):
    try:
        # Assuming the webhook payload is in JSON format
        payload_data = request.data

        # Deserialize the JSON payload into the DTO

        if payload_data['object_kind'] == "pipeline":
            webhook_dto = GitlabWebhookPipelinePayloadDTO(**payload_data)
            if webhook_dto.object_attributes['status'] == "success":
                save_test_result_by_pipeline_event(webhook_dto)

        # You can also send a response back to the client
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
