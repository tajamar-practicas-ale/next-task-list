import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from managers.auth import AuthManager
from managers.task import TaskManager
from decorators.token_required import token_required
from utils.jwt import generate_token  # Importamos la función para generar el token

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configuración del JWT
app.config['JWT_SECRET_KEY'] = 'mysecretkey'  # Clave secreta para firmar el token
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)  # Tiempo de expiración del token

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
    app.run(debug=True)  
