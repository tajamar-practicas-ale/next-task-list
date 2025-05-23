import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from managers.auth import AuthManager
from managers.task import TaskManager
from decorators.token_required import token_required
from decorators.admin_required import admin_required
from utils.jwt import generate_token  # Importamos la función para generar el token
from models.user import db, User

app = Flask(__name__)

# CORS
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuración del JWT
app.config['JWT_SECRET_KEY'] = 'mysecretkey'  # Clave secreta para firmar el token
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)  # Tiempo de expiración del token

# Inicialización de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Ruta para registrar un nuevo usuario
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Usuario y contraseña requerida'}), 400

    try:
        user = AuthManager.register(username, password)
        return jsonify({'message': 'Usuario creado correctamente'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Ruta para hacer login y obtener un token JWT
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        # Verificar las credenciales
        if AuthManager.login(data['username'], data['password']):
            token = generate_token(data['username'])  # Generar el token JWT
            return jsonify({'token': token}), 200
        else:
            return jsonify({'message': 'Credenciales incorrectas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Ruta para eliminar a un usuario (Desde el admin)
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': f'Usuario {user.username} eliminado'}), 200

# Ruta para obtener todos los usuarios (Desde el admin)
@app.route('/api/users', methods=['GET'])
@token_required  # Ruta protegida con el decorador que valida el token
@admin_required
def get_users(current_user):
    try:
        print(f"Usuario admin autenticado: {current_user.username}")  # Depuración

        # Obtener todos los usuarios desde la base de datos
        users = User.query.all()

        # Serializar usuarios (sin contraseñas u otra info sensible)
        serialized_users = [
            {
                'id': user.id,
                'username': user.username,
                'is_admin': user.is_admin
            } for user in users
        ]

        return jsonify(serialized_users), 200

    except Exception as e:
        print(f"Error al obtener usuarios: {str(e)}")  # Depuración
        return jsonify({'error': str(e)}), 500

# Ruta para obtener las tareas del usuario autenticado
@app.route('/api/tasks', methods=['GET'])
@token_required  # Ruta protegida con el decorador que valida el token
def get_tasks(current_user):
    try:
        print(f"Usuario autenticado: {current_user.username}")  # Depuración
        tasks = TaskManager.get_tasks(current_user)
        return jsonify([vars(t) for t in tasks])
    except Exception as e:
        print(f"Error al obtener tareas: {str(e)}")  # Depuración del error
        return jsonify({'error': str(e)}), 500

# Ruta para agregar una nueva tarea
@app.route('/api/tasks', methods=['POST'])
@token_required  # Ruta protegida con el decorador que valida el token
def add_task(current_user):
    data = request.get_json()
    task = TaskManager.add_task(current_user, data['title'], data['description'])
    return jsonify(vars(task)), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', password='admin123', role='admin')  # Asegúrate de que tu modelo tenga el campo 'role'
            db.session.add(admin)
            db.session.commit()
            print('Usuario admin creado.')

    app.run(debug=True)  
