import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext';
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>
    );
}

export default MyApp;
