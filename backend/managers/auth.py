import jwt
import datetime
from flask import current_app
from models.user import db, User
from utils.exceptions import AuthError
from werkzeug.security import generate_password_hash, check_password_hash

class AuthManager:
    @staticmethod
    def register(username, password):
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            raise AuthError("El usuario ya existe.")

        user = User(username=username, password=password, role='user')  # 👈 Pasamos la contraseña sin hashear
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def login(username, password):
        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            raise AuthError("Credenciales inválidas.")

        payload = {
            'username': user.username,
            "role": user.role, 
            'exp': datetime.datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }
        token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
        return token, user


    @staticmethod
    def decode_token(token):
        try:
            payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            user = User.query.filter_by(username=payload['username']).first()
            if not user:
                raise AuthError("Usuario no encontrado.")
            return user
        except jwt.ExpiredSignatureError:
            raise AuthError("Token expirado.")
        except jwt.InvalidTokenError:
            raise AuthError("Token inválido.")
