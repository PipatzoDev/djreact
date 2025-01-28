import { useEffect, useState } from "react";
import { getAllTasks } from "../api/tasks.api";
import TaskCard from "./TaskCard";

export function TasksList() {
  // Estado para las tareas
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await getAllTasks();

        // Verificar que los datos sean un array
        if (Array.isArray(res.data)) {
         
          // Ordenar las tareas por fecha más reciente (dateNow)
          const sortedTasks = res.data.sort((a, b) => {
            return b.id - a.id; // Ordena por ID, el más grande primero
          });

          // Actualizar el estado con las tareas ordenadas
          setTasks(sortedTasks);
          console.log("Datos recibidos:", sortedTasks);

        } else {
          console.error("Los datos obtenidos no son un array:", res.data);
        }
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      }
    }

    loadTasks();
  }, []); // Dependencia vacía para cargar las tareas al montar el componente

  return (
    <div className="row" style={{justifyContent:'space-evenly',marginRight:'100px'}}>

        {tasks.length === 0 ? (
          <p>No hay tareas disponibles.</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}

    </div>
  );
}
