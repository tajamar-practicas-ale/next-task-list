const TaskList = ({ tasks }) => {
    return (
        <div className="mt-6">
            <h2 className="text-2xl">Mis Tareas</h2>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index} className="flex justify-between p-4 border-b">
                        <div>
                            <h3 className="font-bold">{task.title}</h3>
                            <p>{task.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
