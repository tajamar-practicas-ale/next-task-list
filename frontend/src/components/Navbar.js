import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';


const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/")
    }

    return (
        <nav className="bg-primary p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                {/* <Link href="/"> */}
                <span className="text-2xl font-bold">Task App</span>
                {/* </Link> */}
                <div>
                    {user ? (
                        <>
                            {/* <Link href="/tasks">
                                <span className="mr-4">Mis Tareas</span>
                            </Link> */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 cursor-pointer hover:bg-red-700 transition-all duration-200 text-white rounded-md"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <span className="px-6 py-3 bg-primary text-white cursor-pointer transition-all duration-200 rounded-md bg-orange-600 hover:bg-orange-700">Iniciar sesión</span>
                            </Link>
                            <Link href="/register">
                                <span className="px-6 py-3 bg-gray-300 text-black cursor-pointer transition-all duration-200 hover:text-white rounded-md hover:bg-gray-400 ml-4">Registrarse</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
