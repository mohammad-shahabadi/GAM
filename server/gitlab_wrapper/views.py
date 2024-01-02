from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .gitlab_wrapper import GitLabWrapper
from .webhook_dto import GitlabWebhookPipelinePayloadDTO, TestReportDTO
from app_api.models import Submission
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
        webhook_dto = GitlabWebhookPipelinePayloadDTO(**payload_data)

        if webhook_dto.object_kind == "pipeline" and webhook_dto.object_attributes['status'] == "success":
            gitlab = GitLabWrapper()
            test_report = gitlab.get_test_report(webhook_dto.project['id'], webhook_dto.object_attributes['id'])
            save_test_result_by_project_id(webhook_dto, test_report)

        # You can also send a response back to the client
        return Response({'status': 'Webhook received successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        # Handle validation or deserialization errors
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def save_test_result_by_project_id(webhook_dto: GitlabWebhookPipelinePayloadDTO, test_report: TestReportDTO):
    # print("saving project submission with id : ", webhook_dto.project.id)
    submission = Submission(project_id=webhook_dto.project['id'], pipeline_id=webhook_dto.object_attributes['id'],
                            passed_test_cases=test_report.success_count / test_report.total_count,
                            commit_sha=webhook_dto.commit['id'],
                            status=webhook_dto.object_attributes['status'])
    submission.save()
