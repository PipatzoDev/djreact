import axios from 'axios';

// Define the base API instance
const tasksApi = axios.create({
    baseURL: "http://127.0.0.1:8000/tasks/api/v1/tasks/",
});

// API functions
export const getAllTasks = () => {
    return tasksApi.get("/");
};

export const getTask = (id) => 
    tasksApi.get(`/${id}/`);

export const createTask = (formData, config) => {
    return tasksApi.post("/", formData, config);
};

export const updateTask = (id, formData, config) => {
    return tasksApi.put(`/${id}/`, formData, config);
};

export const deleteTask = (id) => 
    tasksApi.delete(`/${id}/`);

export const getUserTasks = (userId) => {
    return tasksApi.get(`/user-tasks/${userId}/`);
};
