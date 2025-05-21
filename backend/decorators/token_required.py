import jwt
from functools import wraps
from flask import request, jsonify, current_app
from models.datastore import DataStore

def token_required(f):
    """Decorador para proteger las rutas que requieren autenticación mediante JWT."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')  # Obtener el token del encabezado Authorization
        if not token:
            return jsonify({'error': 'Token is missing'}), 403
        
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        try:
            # Decodificar el token usando la clave secreta
            payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            user = DataStore.get_user(payload['username'])  # Obtener el usuario usando el payload del token
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 403

        # Pasar el usuario al siguiente endpoint
        return f(user, *args, **kwargs)
    
    return decorated
