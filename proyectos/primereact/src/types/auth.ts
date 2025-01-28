export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    imagen?: string;
}  

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password2: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
}
export interface EditProfileData {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    imagen?: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    confirm_password: string;
}