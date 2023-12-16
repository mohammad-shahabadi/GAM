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
    def __init__(self, id=None, name=None, path=None, namespace_id=None):
        super().__init__(
            id=id,
            name=name,
            path=path,
            namespace_id=namespace_id,
            http_url=None
        )
        self.id = id
        self.name = name
        self.path = path
        self.namespace_id = namespace_id
        self.http_url = None
