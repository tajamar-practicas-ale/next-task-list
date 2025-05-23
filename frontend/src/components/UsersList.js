import React from 'react'

const UsersList = ({ handleDeleteUser, users }) => {

    return (
        <div className="mt-6">
            <h2 className="text-2xl text-center font-bold mt-12 uppercase">Mis Tareas</h2>
            <ul className="flex flex-col gap-5 p-5">
                {users.map((user, index) => (
                    <li key={index} className="flex w-[60%] mx-auto justify-between rounded-2xl p-4 border">
                        <div className="flex justify-evenly">
                            <h3 className="font-bold text-lg">{user.username}</h3>
                            <button className='bg-red-500 p-2 text-white rounded-lg' onClick={handleDeleteUser(user.id)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UsersList