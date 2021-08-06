from flask_cors import CORS, cross_origin
from transactions_api.schemas.users import User
from pydantic.error_wrappers import ValidationError
from transactions_api.schemas.transactions import Transaction, TransactionOnCreation, TransactionUdpate
from flask import Blueprint, jsonify, request
from dependency_injector.wiring import inject, Provide

from transactions_api.services.db import TransactionRepositoryBase
from transactions_api.containers import Container
from transactions_api.decorators import jwt_protected


transactions_blueprint = Blueprint('transactions', __name__)
# CORS(transactions_blueprint)

@transactions_blueprint.get('/movements')
@jwt_protected
@inject
def list_movements(current_user:User, transaction_repository:TransactionRepositoryBase = Provide[Container.transaction_repository]):
     return jsonify([t.dict() for t in transaction_repository.list(current_user.username)]) 


@transactions_blueprint.get('/movements/<movement_id>')
@jwt_protected
@inject
def retrieve_transaction(
    current_user:User,
    movement_id:str,
    transaction_repository:TransactionRepositoryBase = Provide[Container.transaction_repository]
):
    try:
        return transaction_repository.retrieve(current_user.username, movement_id).dict()
    except Transaction.NotFoundError as e: # TODO: Move 404 handling to a middleware
        return e.message, 404


@transactions_blueprint.post('/movements')
@jwt_protected
@inject
def create_transaction(current_user:User, transaction_repository:TransactionRepositoryBase = Provide[Container.transaction_repository]):
    try:
        new_transaction = TransactionOnCreation(**request.get_json())
        return transaction_repository.create(current_user.username, new_transaction).dict(), 201
    except ValidationError as e:
        return jsonify(e.errors()), 400

@transactions_blueprint.patch('/movements/<movement_id>')
@jwt_protected
@inject
def update_transaction(
    current_user:User, 
    movement_id:str,
    transaction_repository:TransactionRepositoryBase = Provide[Container.transaction_repository]):
    try:
        transaction_update = TransactionUdpate(**request.get_json())
        transaction_repository.update_comment(current_user.username, movement_id, transaction_update.comment)
        return {}, 201
    except ValidationError as e:
        return jsonify(e.errors()), 400
