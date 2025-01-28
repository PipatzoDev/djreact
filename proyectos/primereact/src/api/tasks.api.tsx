import axios from 'axios';


const tasksApi = axios.create({
    baseURL: "http://localhost:8000/tasks/api/v1/tasks/",
})

export const getAllTasks = () => tasksApi.get("/");


export const deleteTask = (id) => tasksApi.delete(`/${id}/`);


export const getTask = (id) => tasksApi.get(`/${id}/`)
export const createTask = (task: FormData) => 
    tasksApi.post("/", task, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  
  export const updateTask = (id: string, task: FormData) => 
    tasksApi.put(`/${id}/`, task, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
