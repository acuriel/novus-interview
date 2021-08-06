from transactions_api.services.db.transactions import MongoDbTransactionRepository
from pymongo import mongo_client
from transactions_api.services.db import get_mongo_db
from transactions_api.services.db.users import MongoDBUserRepository
from dependency_injector import containers, providers
from .services import JWTAuth, MockupTransactionRepository, MockupUserRepository
from .settings import settings


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    transaction_repository = providers.Singleton(MongoDbTransactionRepository, mongo_url=settings.mongo_url)
    user_repository = providers.Singleton(MongoDBUserRepository, mongo_url=settings.mongo_url)
    jwt_service = providers.Singleton(JWTAuth, secret_key=settings.secret_key)