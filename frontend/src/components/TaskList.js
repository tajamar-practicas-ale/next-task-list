const TaskList = ({ tasks }) => {
    return (
        <div className="mt-6">
            <h2 className="text-2xl text-center font-bold mt-12 uppercase">Mis Tareas</h2>
            <ul className="flex flex-col gap-5 p-5">
                {tasks.map((task) => (
                    <li key={task.id} className="flex w-[60%] mx-auto justify-between rounded-2xl p-4 border">
                        <div className="flex flex-col gap-2 text-lg">
                            <h3 className="font-bold ">{task.title}</h3>
                            <p className="text-neutral-300">{task.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
