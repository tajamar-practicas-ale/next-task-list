import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Home = () => {
    const { user } = useAuth();
    const router = useRouter();

    if (user) {
        // Redirige automáticamente a la página de tareas si ya está autenticado
        router.push('/tasks');
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl mb-4">Bienvenido a la App de Tareas</h1>
                <div>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-orange-700"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => router.push('/register')}
                        className="px-6 py-3 bg-gray-300 text-black rounded-md hover:bg-gray-400 ml-4"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
