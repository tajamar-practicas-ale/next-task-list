import jwt
from functools import wraps
from flask import request, jsonify, current_app
from managers.auth import AuthManager

def token_required(f):
    """Decorador para proteger las rutas que requieren autenticación mediante JWT."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 403

        if token.startswith('Bearer '):
            token = token.split(' ')[1]

        try:
            user = AuthManager.decode_token(token)  # decode_token ya decodifica el JWT y devuelve el usuario
        except AuthError as e:
            return jsonify({'error': str(e)}), 401

        return f(user, *args, **kwargs)

    return decorated
