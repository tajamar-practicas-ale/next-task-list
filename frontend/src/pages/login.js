import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { loginApi } from '../utils/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await loginApi(username, password);
            login(token);
            router.push('/tasks');
        } catch (error) {
            alert('Error en las credenciales');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 text-black p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl font-semibold mb-4">Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-primary text-white rounded-md cursor-pointer transition-all duration-200 bg-orange-500 hover:bg-orange-700"
                >
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
};

export default Login;
