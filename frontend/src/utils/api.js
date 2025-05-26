import Cookie from 'js-cookie';

const API_URL = 'http://localhost:5000/api';

const getToken = () => Cookie.get('token');

export const fetchApi = async (url, method = 'GET', body = null, token = getToken()) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
        let errorMessage = 'Error en la solicitud';
        try {
            const errorData = await res.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
            // fallback si no puede parsear JSON
        }
        throw new Error(errorMessage);
    }

    return res.json();
};


export const loginApi = async (username, password) => {
    const res = await fetchApi('/login', 'POST', { username, password });
    return res.token;
};

export const registerApi = async (username, password) => {
    const res = await fetchApi('/register', 'POST', { username, password });
    return res.message;
};

export const getUsersApi = async (passedToken) => {
    const token = passedToken || Cookie.get('token');
    try {
        const res = await fetchApi('/users', 'GET', null, token);  // Verifica que la llamada sea correcta
        console.log('Usuarios obtenidos desde la API:', res);  // Ver respuesta completa

        if (!Array.isArray(res)) {
            console.error('Error: La respuesta de usuarios no es un array', res);
        }

        return res;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }

}

export const deleteUserApi = async (user_id) => {
    const res = await fetchApi(`/users/${user_id}`, 'DELETE');
    return res.message;
};

export const getTasksApi = async (passedToken) => {
    const token = passedToken || Cookie.get('token'); // Obtener el token de las cookies
    try {
        const res = await fetchApi('/tasks', 'GET', null, token);  // Verifica que la llamada sea correcta
        console.log('Tareas obtenidas desde la API:', res);  // Ver respuesta completa

        if (!Array.isArray(res)) {
            console.error('Error: La respuesta de tareas no es un array', res);
        }

        return res;
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        throw error;
    }
};

export const createTaskApi = async (title, description, token) => {
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Pasa el token en la cabecera
            },
            body: JSON.stringify({ title, description })
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error;
    }
};
