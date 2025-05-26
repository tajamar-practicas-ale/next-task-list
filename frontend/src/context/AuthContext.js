import { createContext, useContext, useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import Router from 'next/router';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookie.get('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // 👈 decodificar token
                setUser(decoded);
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setUser(null);
            }
        }
    }, []);

    const login = (token) => {
        Cookie.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
        try {
            const decoded = jwtDecode(token); // 👈 decodificar token
            setUser(decoded);
        } catch (error) {
            console.error('Token inválido en login:', error);
            setUser(null);
        }
    };

    const logout = () => {
        Cookie.remove('token');
        setUser(null);
        Router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
