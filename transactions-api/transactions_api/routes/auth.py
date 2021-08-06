from flask_cors import CORS
from transactions_api.decorators import jwt_protected
from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from dependency_injector.wiring import inject, Provide

from transactions_api.services import UserRepostioryBase, JWTAuth
from transactions_api.schemas.users import User, UserAuthentication, UserRegistration
from transactions_api.containers import Container


auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.post('/auth/register')
@inject
def register_user(user_repository:UserRepostioryBase = Provide[Container.user_repository]):
    try:
        user = UserRegistration(**request.get_json())
        registered_user = user_repository.create(user)
        return registered_user.dict(), 201
    except ValidationError as e:
        return jsonify(e.errors()), 400
    except User.DuplicatedError as e:
        return e.message, 400


@auth_blueprint.post('/auth/login')
@inject
def login_user(
    user_repository:UserRepostioryBase = Provide[Container.user_repository],
    jwt_service:JWTAuth = Provide[Container.jwt_service],
    ):
    try:
        user = user_repository.authenticate(UserAuthentication(**request.get_json()))
        if not user:
            return "Username or password incorrect", 403
        token, payload = jwt_service.encode_auth_token(user.username)
        if token:
            return {'issued_at':payload['iat'], 'expires_at': payload['exp'], 'token': token, 'user_id': user.username}
    except ValidationError as e:
        return jsonify(e.errors()), 400


@auth_blueprint.post('/auth/logout')
@jwt_protected
@inject
def logout_user(
    currentuser:User,
    jwt_service:JWTAuth = Provide[Container.jwt_service],
    ):
    pass # TODO: implement

@auth_blueprint.get('/users/me')
@jwt_protected
def get_current_user(current_user:User):
    return current_user.dict()


#TODO: Remove endpoints, just for testing
@auth_blueprint.get('/users')
@jwt_protected
@inject
def list_users(current_user:User, user_repository:UserRepostioryBase = Provide[Container.user_repository]):
    return jsonify([user.dict() for user in user_repository.list(current_user = current_user.username)])
