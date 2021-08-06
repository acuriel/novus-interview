from abc import abstractmethod
from typing import Dict, List
from uuid import UUID
from dependency_injector.wiring import register_loader_containers

from pymongo import MongoClient

from transactions_api.schemas.transactions import Transaction, TransactionInDb, TransactionOnCreation, TransactionUdpate


class TransactionRepositoryBase:
    @abstractmethod
    def list(self, user_id:str) -> List[Transaction]:
        raise NotImplementedError
    
    @abstractmethod
    def retrieve(self, user_id:str, id:str) -> Transaction:
        raise NotImplementedError
    
    @abstractmethod
    def create(self, user_id:str, transaction:TransactionOnCreation) -> Transaction:
        raise NotImplementedError
    
    @abstractmethod
    def update_comment(self, user_id:str, id:str, transaction:TransactionUdpate) -> Transaction:
        raise NotImplementedError


class MockupTransactionRepository(TransactionRepositoryBase):
    def __init__(self) -> None:
        self.transactions:Dict[str, Transaction] = {}

    def list(self, user_id:str) -> List[Transaction]:
        return list(self.transactions.values())
    
    def retrieve(self, user_id:str, id: str) -> Transaction:
        if id in self.transactions:
            return self.transactions[id]
        raise Transaction.NotFound(id)
    
    def create(self, user_id:str, transaction: TransactionOnCreation) -> Transaction:
        full_transaction = Transaction(**transaction.dict())
        self.transactions[str(full_transaction.id)] = full_transaction
        return full_transaction


class MongoDbTransactionRepository(TransactionRepositoryBase):
    def __init__(self, mongo_url) -> None:
        self.db = MongoClient(mongo_url).get_database('novus')
    
    
    def list(self, user_id:str) -> List[Transaction]:
        transactions = self.db.movements.find({
            '$or': [
                {'user_id':user_id},
                {'partner':user_id}
            ]
        })
        return [Transaction(**t) for t in transactions]
    
    def create(self, user_id:str, transaction: TransactionOnCreation) -> Transaction:
        transaction_db = TransactionInDb(**transaction.dict(), user_id=user_id)
        partner = self.db.users.find_one({'username': transaction_db.partner})
        if not partner:
            raise Exception("Partner not found")
        
        self.db.movements.insert_one(transaction_db.dict())
        return Transaction(**transaction_db.dict())

    def update_comment(self, user_id: str, id: str, new_comment:str):
        transaction = self.db.movements.find_one({
            'id':UUID(id),
            '$or': [
                {'user_id':user_id},
                {'partner':user_id}
            ]
        })
        if not transaction:
            raise Transaction.NotFoundError(id)
        transaction_db = TransactionInDb(**transaction)
        field_comment = 'comment_owner' if transaction_db.user_id == user_id else 'comment_partner'
        self.db.movements.update_one(
            {'id':UUID(id)},
            {'$set': {field_comment:new_comment}})
    
    def retrieve(self, user_id: str, id: str) -> Transaction:
        transaction = self.db.movements.find_one({
            'id':UUID(id),
            '$or': [
                {'user_id':user_id},
                {'partner':user_id}
            ]
        })
        if not transaction:
            raise Transaction.NotFoundError(id)
        transaction_db = TransactionInDb(**transaction)
        real_comment = transaction_db.comment_owner if transaction_db.user_id == user_id else transaction_db.comment_partner
        return Transaction(**transaction, comment=real_comment)