from django.http import HttpResponse
from .helper import gitlab_ci_renderer

def render_gitlab_ci(request, class_id, key, problem_set):
    gitlab_ci_yml = gitlab_ci_renderer.generate_gitlab_ci_contents()
    response = HttpResponse(gitlab_ci_yml, content_type='application/x-yaml')
    response['Content-Disposition'] = 'attachment; filename="gitlab-ci.yml"'
    return response

