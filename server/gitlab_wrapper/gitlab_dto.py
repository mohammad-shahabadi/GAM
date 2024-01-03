from dataclasses import dataclass
from typing import List, Optional

from .base_dto import BaseDTO


class GroupDTO(BaseDTO):
    def __init__(self, id=None, parent_id=None, name=None, path=None, description=None):
        super().__init__(
            id=id,
            parent_id=parent_id,
            name=name,
            path=path,
            description=description
        )
        self.id = id
        self.parent_id = parent_id
        self.name = name
        self.path = path
        self.description = description


class UserDTO(BaseDTO):
    def __init__(self, id=None, name=None, username=None, email=None, password=None):
        super().__init__(
            id=id,
            name=name,
            username=username,
            email=email,
            password=password
        )
        self.id = id
        self.name = name
        self.username = username
        self.email = email
        self.password = password


class ProjectDTO(BaseDTO):
    def __init__(self, id=None, name=None, path=None, namespace_id=None, http_url=None):
        super().__init__(
            id=id,
            name=name,
            path=path,
            namespace_id=namespace_id,
            http_url=http_url
        )
        self.id = id
        self.name = name
        self.path = path
        self.namespace_id = namespace_id
        self.http_url = http_url

@dataclass
class WebhookDTO(BaseDTO):
    project_id: int
    url: str
    pipeline_events: int

@dataclass
class UserDTO2(BaseDTO):
    id: int
    name: str
    username: str
    avatar_url: str
    email: str


@dataclass
class ProjectDTO2(BaseDTO):
    id: int
    name: str
    description: str
    web_url: str
    avatar_url: Optional[str]
    git_ssh_url: str
    git_http_url: str
    namespace: str
    visibility_level: int
    path_with_namespace: str
    default_branch: str
    ci_config_path: str


@dataclass
class CommitAuthorDTO(BaseDTO):
    name: str
    email: str


@dataclass
class CommitDTO(BaseDTO):
    id: str
    message: str
    title: str
    timestamp: str
    url: str
    author: CommitAuthorDTO


@dataclass
class ObjectAttributesDTO(BaseDTO):
    id: int
    ref: str
    tag: bool
    sha: str
    before_sha: str
    source: str
    status: str
    detailed_status: str
    stages: List[str]
    created_at: str
    finished_at: str
    duration: int
    queued_duration: int
    variables: List[BaseDTO]


@dataclass
class GitlabWebhookPipelinePayloadDTO(BaseDTO):
    object_kind: str
    object_attributes: ObjectAttributesDTO
    merge_request: Optional[BaseDTO]
    user: UserDTO2
    project: ProjectDTO2
    commit: CommitDTO
