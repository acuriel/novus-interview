from transactions_api.services.auth import JWTAuth


def test_encode_decode_auth_token():
    auth = JWTAuth('secret_key')
    user_id = 'test_user_id'
    auth_token = auth.encode_auth_token(user_id)
    decoded = auth.decode_auth_token(auth_token)
    assert decoded == user_id
