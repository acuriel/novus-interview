import datetime
import jwt



class JWTAuth:
    """
    Defines the service for JWT authentication
    """
    def __init__(self, secret_key) -> None:
        self._secret_key = secret_key
    
    def encode_auth_token(self, user_id:str) -> str:
        """
        Generates the Auth Token
        :return: string
        """
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(payload,
            self._secret_key,
            algorithm='HS256'
        ), payload

    
    def decode_auth_token(self, auth_token:str) -> str:
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        return jwt.decode(auth_token, self._secret_key, algorithms=['HS256'])['sub']


