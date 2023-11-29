from abc import ABC


class BaseDTO(ABC):
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def serialize_without_none(self):
        serialized_data = {}
        for key, value in self.__dict__.items():
            if value is not None:
                serialized_data[key] = value
        return serialized_data
