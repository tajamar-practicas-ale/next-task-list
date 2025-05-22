import { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title && description) {
            onSubmit({ title, description });
            setTitle('');
            setDescription('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col w-[30%] mx-auto gap-5 space-x-4">
            <h2 className='text-center text-2xl uppercase font-bold'>Agregar tarea</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md w-full"
                placeholder="Título"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md w-full"
                placeholder="Descripción"
            />
            <button type="submit" className="py-2 px-4 bg-blue-500 cursor-pointer transition-all duration-200 hover:bg-blue-700 w-[200px] mx-auto text-white rounded-md">
                Añadir tarea
            </button>
        </form>
    );
};

export default TaskForm;
