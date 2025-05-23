from flask import jsonify
from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'error': 'Acceso solo para administradores'}), 403
        return f(current_user, *args, **kwargs)
    return decorated
