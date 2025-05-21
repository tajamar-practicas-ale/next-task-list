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
                <Link href="/">
                    <span className="text-2xl font-bold">Task App</span>
                </Link>
                <div>
                    {user ? (
                        <>
                            <Link href="/tasks">
                                <span className="mr-4">Mis Tareas</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <span className="mr-4">Login</span>
                            </Link>
                            <Link href="/register">
                                <span className="mr-4">Register</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
