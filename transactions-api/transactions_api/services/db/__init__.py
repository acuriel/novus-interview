from .transactions import *
from .users import *
from pymongo import MongoClient

def get_mongo_db(mongo_url:str):
    client = MongoClient(mongo_url)
    return client.get_database('novus')
