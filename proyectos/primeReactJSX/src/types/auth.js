export const User = {
    id: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    imagen: ''
};  

export const AuthTokens = {
    access: '',
    refresh: ''
};

export const LoginCredentials = {
    username: '',
    password: ''
};

export const RegisterData = {
    username: '',
    email: '',
    password: '',
    password2: ''
};

export const AuthContextType = {
    user: null,
    loading: false,
    login: async (credentials) => {},
    register: async (userData) => {},
    logout: () => {}
};

export const EditProfileData = {
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    imagen: ''
};

export const ChangePasswordData = {
    old_password: '',
    new_password: '',
    confirm_password: ''
};
