import { useState } from 'react';
import { useRouter } from 'next/router';
import { registerApi } from '../utils/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerApi(username, password);
            router.push('/login');
        } catch (error) {
            alert('Error al registrar usuario');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl text-black font-semibold mb-4">Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full text-black p-2 mb-4 border border-gray-300 rounded-md"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full text-black p-2 mb-4 border border-gray-300 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-primary text-white rounded-md cursor-pointer transition-all duration-200 bg-orange-500 hover:bg-orange-700"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
