import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasksApi, createTaskApi } from '../utils/api';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useRouter } from 'next/router';

const Tasks = ({ tasks }) => {
    const { user } = useAuth();
    const [taskList, setTaskList] = useState(tasks);
    const router = useRouter();

    useEffect(() => {
        console.log('Tareas iniciales:', tasks);
    }, [user, router]);

    const handleAddTask = async (newTask) => {
        try {
            const task = await createTaskApi(newTask.title, newTask.description);
            setTaskList([...taskList, task]);
        } catch (error) {
            console.error('Error al crear tarea:', error);
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
        </div>
    );
};

export async function getServerSideProps(context) {
    const token = context.req.cookies.token;  // Obtener token desde cookies

    if (!token) {
        return { redirect: { destination: '/login', permanent: false } };  // Redirigir si no está autenticado
    }

    try {
        const tasks = await getTasksApi();  // Obtener tareas del servidor
        console.log('Tareas obtenidas en el servidor:', tasks);  // Ver tareas obtenidas en el servidor

        if (tasks.length === 0) {
            console.log('No se encontraron tareas en el servidor');
        }

        return { props: { tasks: tasks } };
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return { props: { tasks: [] } };  // Retorna tareas vacías en caso de error
    }
}


export default Tasks;
