from typing import List, Optional
from datetime import datetime
from dataclasses import dataclass, field


@dataclass
class BaseDTO:
    # def __init__(self, **kwargs):
    #     for key, value in kwargs.items():
    #         setattr(self, key, value)
    pass

@dataclass
class UserDTO(BaseDTO):
    id: int
    name: str
    username: str
    avatar_url: str
    email: str


@dataclass
class ProjectDTO(BaseDTO):
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
    user: UserDTO
    project: ProjectDTO
    commit: CommitDTO
    builds: str


@dataclass
class TestReportDTO:
    total_time: int
    total_count: int
    success_count: int
    failed_count: int
    skipped_count: int
    error_count: int
    test_suites: List['TestSuiteDTO']


@dataclass
class TestSuiteDTO:
    name: str
    total_time: int
    total_count: int
    success_count: int
    failed_count: int
    skipped_count: int
    error_count: int
    test_cases: List['TestCaseDTO']


@dataclass
class TestCaseDTO:
    status: str
    name: str
    classname: str
    execution_time: int
    system_output: Optional[str]
    stack_trace: Optional[str]
