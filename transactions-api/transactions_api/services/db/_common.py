from typing import Generic, List, TypeVar

T = TypeVar('T')

class ListMixin(Generic[T]):
    """
    Mixin defining a listing operation
    """
    def list(self) -> List[T]:
        raise NotImplementedError


ID = TypeVar('ID')

class RetrieveMixin(Generic[ID, T]):
    """
    Mixin defining a retrieval operation, from an id
    """
    def retrieve(self, id:ID) -> T:
        raise NotImplementedError


class DeleteMixin(Generic[ID]):
    """
    Mixin defining a removal operation, from an id
    """
    def delete(self, id:ID):
        raise NotImplementedError

TC = TypeVar('TC')

class CreateMixin(Generic[TC, T]):
    """
    Mixin defining a creation operation and returns the created object
    """
    def create(self, obj:TC) -> T:
        raise NotImplementedError