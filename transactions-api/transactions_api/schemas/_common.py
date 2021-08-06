import abc
from datetime import datetime


from pydantic import BaseModel, Field

class RetrievableModelMixin:
    class NotFoundError(Exception):
        def __init__(self, id, *args: object) -> None:
            self.message = f'Element with id {str(id)} not found'

class UniqueModelMixin:
    class DuplicatedError(Exception):
        def __init__(self, field, value, *args: object) -> None:
            self.message = f'Element with {field} {value} already created'


class CreatedAtMixin(BaseModel):
    created_at:datetime = Field(default_factory=datetime.now)


class ModifedAtMixin((BaseModel)):
    modified_at:datetime = Field(default_factory=datetime.now)


