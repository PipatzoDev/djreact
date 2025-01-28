import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthTokens, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
            checkUserSession();
        } else {
            setLoading(false);
        }
    }, []);

    const checkUserSession = async (): Promise<void> => {
        try {
            const tokens = localStorage.getItem('tokens');
            if (!tokens) throw new Error('No tokens found');

            const response = await fetch('http://localhost:8000/usuarios/api/profile/', {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(tokens).access}`
                }
            });
            
            if (response.ok) {
                const userData: User = await response.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            logout();
        }
        setLoading(false);
    };

    const login = async (credentials: LoginCredentials): Promise<void> => {
        const response = await fetch('http://localhost:8000/usuarios/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }

        const tokens: AuthTokens = await response.json();
        localStorage.setItem('tokens', JSON.stringify(tokens));
        await checkUserSession();
    };

    const register = async (userData: RegisterData): Promise<void> => {
        const response = await fetch('http://localhost:8000/usuarios/api/register/', {
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

    const logout = (): void => {
        localStorage.removeItem('tokens');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};