import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userGroups, setUserGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            checkUserSession();
        } else {
            setLoading(false);
        }
    }, []);

    const checkUserSession = async () => {
        try {
            const tokens = localStorage.getItem('tokens');
            if (!tokens) throw new Error('No tokens found');

            const response = await fetch('http://127.0.0.1:8000/usuarios/api/profile/', {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(tokens).access}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setUserGroups(userData.groups || []); // Guardamos los grupos
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error checking session:', error);
            logout();
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/usuarios/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error en el inicio de sesión');
            }

            const data = await response.json();
            
            // Guardar tokens
            localStorage.setItem('tokens', JSON.stringify({
                access: data.access,
                refresh: data.refresh
            }));

            // Obtener datos del usuario
            const userResponse = await fetch('http://127.0.0.1:8000/usuarios/api/profile/', {
                headers: {
                    'Authorization': `Bearer ${data.access}`
                }
            });

            if (!userResponse.ok) {
                throw new Error('Error al obtener datos del usuario');
            }

            const userData = await userResponse.json();
            setUser(userData);
            
            // Asegurarnos que la navegación ocurra después de establecer el usuario
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 100);

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        const response = await fetch('http://127.0.0.1:8000/usuarios/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en el registro');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tokens');
        navigate('/login', { replace: true });
    };

    const updateUser = (newData) => {
        setUser(newData);
    };

    const value = {
        user,
        login,
        logout,
        register,
        loading,
        userGroups,
        updateUser,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
