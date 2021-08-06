from typing import Dict, List

from pymongo.database import Database
from pymongo.mongo_client import MongoClient
from ._common import CreateMixin, ListMixin, RetrieveMixin
from transactions_api.schemas.users import UserAuthentication, UserInDB, UserRegistration, User


class UserRepostioryBase(CreateMixin[UserRegistration, User], ListMixin[User], RetrieveMixin[str, User]):
    def authenticate(self, user:UserAuthentication) -> User:
        raise NotImplementedError


class MockupUserRepository(UserRepostioryBase):
    def __init__(self) -> None:
        self._users:Dict[str, UserInDB] = {}
    
    def create(self, obj: UserRegistration) -> User:
        if obj.username in self._users:
            raise User.DuplicatedError(field='username', value=obj.username)
        new_user = UserInDB(username=obj.username, password_hash=obj.password)
        self._users[obj.username] = new_user
        return User(**new_user.dict())
    
    def list(self) -> List[User]:
        return list([User(**user_db.dict()) for user_db in self._users.values()])
    
    def retrieve(self, id: str) -> User:
        if id not in self._users:
            raise User.NotFoundError(id)
        return User(**self._users[id].dict())
    
    def authenticate(self, user:UserAuthentication) -> User:
        if user.username in self._users and self._users[user.username].password_hash == user.password:
            return User(**self._users[user.username].dict())


class MongoDBUserRepository(UserRepostioryBase):
    def __init__(self, mongo_url) -> None:
        self.db:Database = MongoClient(mongo_url).get_database('novus')
        self.db.users.create_index("username", unique=True)
    
    def create(self, obj: UserRegistration) -> User:
        found_user = self.db.users.find_one({'username':obj.username})
        if found_user:
            raise User.DuplicatedError(field='username', value=obj.username)
        new_user = UserInDB(username=obj.username, password_hash=obj.password)
        self.db.users.insert_one(new_user.dict())
        return User(**new_user.dict())
    
    def list(self, current_user:str = None) -> List[User]:
        users_db = list(self.db.users.find(
            {'username': {'$ne': current_user}} 
            if current_user 
            else {}
        ))
        return list([User(**user_db) for user_db in users_db])
    
    def retrieve(self, id: str) -> User:
        found_user = self.db.users.find_one({'username':id})
        if not found_user:
            raise User.NotFoundError(id)
        return User(**found_user)
    
    def authenticate(self, user:UserAuthentication) -> User:
        found_user = self.db.users.find_one({'username':user.username})
        if not found_user:
            raise User.NotFoundError(id)
        user_db = UserInDB(**found_user)
        if user_db.password_hash == user.password:
            return User(**found_user)
