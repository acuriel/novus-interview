import json
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

from .routes import transactions
from .containers import Container
from .routes import transactions, auth
from . import decorators
from .settings import settings
from .schemas import UserInDB, TransactionInDb


def load_fixtures():
    client = MongoClient(settings.mongo_url)
    db = client.get_database('novus')
    with open('fixtures/users.json') as users_fs:
        print("Reading users fixture")
        users = [UserInDB(username=user['username'], password_hash=user['password']) for user in json.load(users_fs)]
        print("Loading Users to DB")
        db.users.insert_many([user.dict() for user in users])
    with open('fixtures/movements.json') as movements_fs:
        print("Reading mvoements fixture")
        movements = [TransactionInDb(**movement) for movement in json.load(movements_fs)]
        print("Loading Movements to DB")
        db.movements.insert_many([movement.dict() for movement in movements])
    client.close()


def create_app() -> Flask:
    container = Container()
    container.wire(modules=[transactions, auth, decorators])
    flask_app = Flask(__name__)
    # flask_app.config['CORS_HEADERS'] = 'Content-Type'
    flask_app.container = container
    flask_app.register_blueprint(transactions.transactions_blueprint)
    flask_app.register_blueprint(auth.auth_blueprint)
    CORS(flask_app, resources=r'/*', supports_credentials=True)
    return flask_app

if(settings.preload_data):
    print("Preloading Test Data")
    load_fixtures()
else:
    print("No test data to preload")

app = create_app()

@app.route('/ping')
def ping():
    return "Service working 🚀"
