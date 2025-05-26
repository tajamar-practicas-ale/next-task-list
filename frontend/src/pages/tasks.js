import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasksApi, createTaskApi, deleteUserApi, getUsersApi } from '../utils/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import UsersList from '@/components/UsersList';

const Tasks = ({ tasks, users }) => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState(tasks);
    const [userList, setUserList] = useState(users);
    const router = useRouter();

    console.log("User en <Tasks />:", user);

    useEffect(() => {
        // Función asíncrona para obtener tareas y usuarios según el rol
        const fetchData = async () => {
            try {
                // Obtener el token desde las cookies
                const token = Cookie.get('token');

                // Si no hay token (por ejemplo, después de logout), no hacer nada y evitar errores
                if (!token) return;

                // Obtener las tareas del usuario autenticado con el token
                const tasks = await getTasksApi(token);
                // Actualizar el estado local con la lista de tareas recibida
                setTaskList(tasks);

                // Si el usuario es admin, también obtener la lista de usuarios
                if (user?.role === 'admin') {
                    const users = await getUsersApi(token);
                    // Actualizar el estado local con la lista de usuarios
                    setUserList(users);
                } else {
                    // Si no es admin, limpiar la lista de usuarios para que no se muestre nada
                    setUserList([]);
                }
            } catch (error) {
                // En caso de error al obtener datos, mostrarlo en consola para debugging
                console.error('Error al obtener datos:', error);
            }
        };

        // Ejecutar la función asíncrona definida arriba
        fetchData();
        // Ejecutar cada vez que cambie el usuario (login, logout o cambio de rol)
    }, [user]);

    const handleAddTask = async (newTask) => {
        try {
            const token = Cookie.get('token');  // Obtener el token desde las cookies
            if (!token) {
                throw new Error('Token no encontrado');
            }
            const task = await createTaskApi(newTask.title, newTask.description, token); // Pasar el token
            setTaskList([...taskList, task]);
        } catch (error) {
            console.error('Error al crear tarea:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            const token = Cookie.get('token');
            if (!token) throw new Error('Token no encontrado');

            await deleteUserApi(id, token);
            setUserList((prev) => prev.filter((user) => user.id !== id));  // Actualizar listado tras eliminación
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };


    return (
        <div className="container mx-auto">
            {/* <div className="flex justify-between mt-4">
                <button onClick={HandleLogout} className="py-2 px-4 bg-red-500 text-white rounded-md">
                    Logout
                </button>
            </div> */}
            <TaskForm onSubmit={handleAddTask} />
            <TaskList tasks={taskList} />
            {user?.role === 'admin' ? (
                <UsersList onDelete={handleDeleteUser} users={userList} />
            ) : null}
        </div>
    );
};

export async function getServerSideProps(context) {
    const token = context.req.cookies.token;  // Obtener token desde cookies

    if (!token) {
        return { redirect: { destination: '/login', permanent: false } };  // Redirigir si no está autenticado
    }

    try {
        const tasks = await getTasksApi(token);  // Obtener tareas del servidor
        const users = await getUsersApi(token)
        console.log('Tareas obtenidas en el servidor:', tasks);  // Ver tareas obtenidas en el servidor
        console.log('Usuarios obtenidos en el servidor:', users);  // Ver tareas obtenidas en el servidor

        if (tasks.length === 0) {
            console.log('No se encontraron tareas en el servidor');
        }

        return { props: { tasks: tasks, users: users } };
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return { props: { tasks: [], users: [] } };  // Retorna tareas vacías en caso de error
    }
}


export default Tasks;
