import jwt
import datetime
from flask import current_app

def generate_token(user):
    """Genera un token JWT con el nombre de usuario y fecha de expiración."""
    payload = {
        'username': user.username,
        "role": user.role, 
        'exp': datetime.datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']  # Expiración del token
    }
    
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')  # Generamos el token
    return token
