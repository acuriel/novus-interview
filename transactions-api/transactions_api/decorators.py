from functools import wraps

from .containers import Container
from transactions_api.services.db.users import MockupUserRepository, MongoDBUserRepository

from flask import request

from transactions_api.services import JWTAuth
from .settings import settings


def jwt_protected(f): # TODO: Fix issue when injecting services and chaining decorators
   @wraps(f)
   def decorator(*args, **kwargs):
       auth_service = JWTAuth(settings.secret_key)
       user_repository = MongoDBUserRepository(settings.mongo_url)
       token = None
       if 'Authorization' in request.headers:
           token = request.headers['Authorization'].split(' ')[1]
 
       if not token:
           return 'Unauthorized', 401
       try:
           user_id = auth_service.decode_auth_token(token)
           current_user = user_repository.retrieve(user_id)
       except Exception as e:
           print(e)
           return 'Invalid Token', 401
 
       return f(current_user=current_user, *args, **kwargs)
   return decorator