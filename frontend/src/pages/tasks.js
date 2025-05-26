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
        console.log('Tareas iniciales:', tasks);
        console.log('Usuarios:', users);
    }, [user, router]);

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

    const handleDeleteUser = (id) => {
        deleteUserApi(id);
    }

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
