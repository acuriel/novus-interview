from typing import Optional
from pydantic import BaseModel, validator
from uuid import uuid4
import math

from pydantic import Field
from pydantic.error_wrappers import ValidationError
from pydantic.types import UUID4, conint, constr

from ._common import CreatedAtMixin, ModifedAtMixin, RetrievableModelMixin


class TransactionInDb(RetrievableModelMixin, CreatedAtMixin, ModifedAtMixin, BaseModel):
    id:UUID4 = Field(default_factory=uuid4)
    amount: conint(gt=0) # NOTE: amount in cents -> Real Amount x 100
    currency: constr(regex=r'^[A-Z]{3}$') 
    booked:bool = False
    description:Optional[str] = ""
    comment_owner:str = ""
    comment_partner:str = ""

    user_id:str
    partner:Optional[str] 


class Transaction(RetrievableModelMixin, CreatedAtMixin, ModifedAtMixin, BaseModel):
    id:UUID4 = Field(default_factory=uuid4)
    amount: conint(gt=0) # NOTE: amount in cents -> Real Amount x 100
    currency: constr(regex=r'^[A-Z]{3}$') 
    booked:bool = False
    description:Optional[str] = ""
    comment:str = ""

    user_id:str
    partner:Optional[str]  # TODO: replace with User model


class TransactionOnCreation(BaseModel):
    amount: conint(gt=0) # NOTE: amount in cents -> Real Amount x 100
    currency: constr(regex=r'^[A-Z]{3}$')  
    partner:str  # TODO: replace with User model

    @validator('amount')
    def amount_is_integer(cls, v):
        #TODO: Add password validation
        if math.floor(v) != v:
            raise ValidationError("Must be an integer representing the amount in cents")
        return v

class TransactionUdpate(BaseModel):
    comment:str