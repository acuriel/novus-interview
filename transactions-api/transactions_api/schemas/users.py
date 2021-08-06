from pydantic import BaseModel, validator
from pydantic.types import constr
from ._common import CreatedAtMixin, ModifedAtMixin, UniqueModelMixin, RetrievableModelMixin



class UserInDB(CreatedAtMixin, ModifedAtMixin, BaseModel):
    username:str
    password_hash:str
    balance:int = 10000


class UserRegistration(BaseModel):
    username:constr(min_length=3)
    password:constr(min_length=8)

    @validator('password')
    def validate_password(cls, v):
        #TODO: Add password validation
        return v

class UserAuthentication(UserRegistration):
    pass

class User(UniqueModelMixin, RetrievableModelMixin, CreatedAtMixin, ModifedAtMixin, BaseModel):
    username:str
    balance:int = 10000


class AuthenticationResponse(BaseModel):
    pass