import { createContext, useContext, useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import Router from 'next/router';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookie.get('token'); // Obtener el token de las cookies
        if (token) {
            setUser(token); // Establecer el token en el estado si existe
        }
    }, []);

    const login = (token) => {
        // Guardar el token en cookies
        Cookie.set('token', token, { expires: 1, secure: true, sameSite: 'Strict' });
        setUser(token);
    };

    const logout = () => {
        Cookie.remove('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
