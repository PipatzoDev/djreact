import axios from 'axios';

// Define the base API instance
const tasksApi = axios.create({
    baseURL: "http://localhost:8000/tasks/api/v1/tasks/"
});

// Define interfaces for type safety
interface Task {
    id: string;
    // Add other task properties here based on your API response
}

// API function types
type GetAllTasksResponse = Task[];
type SingleTaskResponse = Task;

// API functions with proper typing
export const getAllTasks = () => 
    tasksApi.get<GetAllTasksResponse>("/");

export const getTask = (id: string) => 
    tasksApi.get<SingleTaskResponse>(`/${id}/`);

export const createTask = (task: FormData) => 
    tasksApi.post<SingleTaskResponse>("/", task, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const updateTask = (id: string, task: FormData) => 
    tasksApi.put<SingleTaskResponse>(`/${id}/`, task, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

export const deleteTask = (id: string) => 
    tasksApi.delete(`/${id}/`);