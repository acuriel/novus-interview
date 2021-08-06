import pytest
from flask import Flask
from transactions_api.app import create_app

def test_app_creation():
    app = create_app()
    assert isinstance(app, Flask)

@pytest.mark.parametrize('blueprint_name', ['transactions', 'auth'])
def test_app_contains_blueprint(blueprint_name):
    app = create_app()
    assert blueprint_name in app.blueprints