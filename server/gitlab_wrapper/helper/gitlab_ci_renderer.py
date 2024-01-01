import os
from dataclasses import dataclass

import yaml
from decouple import config

@dataclass
class Stage:
    name: str
    script_name: str
    only: [str]


'''
Attention : Your bash file in scripts should contain "&&" for each command since yml file only supports this type 
'''


def generate_gitlab_ci_contents():
    stages = create_stages()
    gitlab_ci = {"stages": []}

    for stage in stages:
        gitlab_ci["stages"].append(stage.name)
        gitlab_ci[stage.name] = {
            "stage": stage.name,
            "script": render_script(stage.script_name),
            "only": stage.only,
        }
    return yaml.dump(gitlab_ci)


# Add Your stage here
def create_stages() -> [Stage]:
    stages = [
        render_fork_update_stage()
    ]
    return stages


print('ss')


def render_fork_update_stage():
    return Stage(
        name='fork_update',
        script_name='fork_update',
        only=['master']
    )


def render_script(script_path):
    script_file_name = f"{script_path}.sh"
    return pre_script() + get_script(script_file_name)


def get_script(script_file_name):
    current_file_directory = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_file_directory, "scripts", script_file_name)
    with open(file_path, 'r') as bash_file:
        bash_script_contents = bash_file.read()
    return bash_script_contents


def pre_script():
    gitlab_access_token = config('ACCESS_TOKEN')
    return """set -e &&
      GITLAB_API_PRIVATE_TOKEN="{}" &&
    """.format(gitlab_access_token)
