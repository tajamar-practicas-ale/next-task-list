import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;
