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
        <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md w-full"
                placeholder="Título de la tarea"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="py-2 px-4 border border-gray-300 rounded-md w-full"
                placeholder="Descripción de la tarea"
            />
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
                Añadir tarea
            </button>
        </form>
    );
};

export default TaskForm;
