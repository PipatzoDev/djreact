import axios from 'axios';

// Define the base API instance
const tasksApi = axios.create({
    baseURL: "http://127.0.0.1:8000/tasks/api/v1/tasks/"
});

// API functions without TypeScript types
export const getAllTasks = () => 
    tasksApi.get("/");

export const getTask = (id) => 
    tasksApi.get(`/${id}/`);

export const createTask = (task) => 
    tasksApi.post("/", task, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const updateTask = (id, task) => 
    tasksApi.put(`/${id}/`, task, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const deleteTask = (id) => 
    tasksApi.delete(`/${id}/`);
