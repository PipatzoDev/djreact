import { useEffect, useState } from "react";
import { getAllTasks } from "../api/tasks.api";
import TaskCard from "./TaskCard";

// Define API response type correctly
interface GetAllTasksResponse {
  data: Task[];
}

// Updated interface for Task to match the API response
interface Task {
  id: string; // Ensure it's always a string
  title?: string; // Optional to prevent undefined errors
  description?: string;
  dateNow?: string;
  created_at?: string;
  creator?: string;
  done?: boolean;
  archivo?: string;
  portada?: string;
}

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const res = await getAllTasks(); // API Call
        const data: GetAllTasksResponse = res; // Ensure correct type

        // Validate that res.data exists and is an array
        if (Array.isArray(data.data)) {
          // Convert `id` to string and provide default values
          const formattedTasks: Task[] = data.data.map((task) => ({
            id: String(task.id), // Ensure id is a string
            title: task.title ?? "Sin título", // Default value for title
            description: task.description ?? "", // Default empty string
            dateNow: task.dateNow,
            created_at: task.created_at,
            creator: task.creator,
            done: task.done,
            archivo: task.archivo,
            portada: task.portada,
          }));

          // Sort tasks by ID in descending order
          const sortedTasks = formattedTasks.sort((a, b) => Number(b.id) - Number(a.id));

          setTasks(sortedTasks);
          console.log("Datos recibidos:", sortedTasks);
        } else {
          console.error("Los datos obtenidos no son un array:", data);
          setError("Los datos obtenidos no son un array.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error al cargar las tareas:", error.message);
          setError(error.message);
        } else {
          console.error("Error desconocido al cargar las tareas:", error);
          setError("Error desconocido al cargar las tareas.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  if (loading) {
    return <p>Cargando tareas...</p>; // Loading state
  }

  if (error) {
    return <p>Error: {error}</p>; // Error state
  }

  return (
    <div 
      className="row" 
      style={{ 
        justifyContent: 'space-evenly', 
        marginRight: '100px' 
      }}
    >
      {tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
          />
        ))
      )}
    </div>
  );
}
