import jwt, datetime
from models.datastore import DataStore
from models.user import User
from utils.exceptions import AuthError

SECRET_KEY = 'mysecretkey'

class AuthManager:
    @staticmethod
    def register(username, password):
        if DataStore.get_user(username):
            raise AuthError("El usuario ya existe.")
        user = User(username, password)
        DataStore.add_user(user)
        return user

    @staticmethod
    def login(username, password):
        user = DataStore.get_user(username)
        if not user or user.password != password:
            raise AuthError("Credenciales inválidas.")

        payload = {
            'username': username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    @staticmethod
    def decode_token(token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return DataStore.get_user(payload['username'])
        except jwt.ExpiredSignatureError:
            raise AuthError("Token expirado.")
        except jwt.InvalidTokenError:
            raise AuthError("Token inválido.")
