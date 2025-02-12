import { useEffect, useState } from "react";
import { getAllTasks } from "../api/tasks.api";
import TaskCard from "./TaskCard";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit } from "react-icons/fa";
import { Tag } from "primereact/tag";

export function TasksList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NeonCard = ({ task }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    return (
      <motion.div
        className={`relative group`}
        initial={{ opacity: 0, scale: 0 }}
        onClick={() => navigate(`/tasks/${task.id}/`)}
        
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.98 }}
        exit={{ opacity: 0 }}
        whileHover={{ scale: 1.05 , cursor: "pointer" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="outline-2 outline-offset-0 outline-red-900 relative bg-black rounded-2xl p-6 h-full flex flex-col justify-between overflow-hidden group-hover:bg-gray-900 transition-colors duration-300 h-sombras">
          <div>
            <img
              src={
                task.portada
                  ? task.portada.replace(
                      "http://127.0.0.1:8000/media/",
                      "http://127.0.0.1:8000/usuarios/media/"
                    )
                  : "/bannerVacio.png"
              }
              alt={task.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-red-500 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-red-800 transition-all duration-300">
              {task.title}
            </h2>
            <p className="text-red-300 mb-2">{new Date(task.created_at).toLocaleString("es-ES")}</p>
            <p className="text-red-300">Creado por: <Tag value={task.creator.username} severity="danger" /></p>
          </div>
          <div className="mt-4 flex justify-between items-center">
            {task.archivo ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-red-500"
              >
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-red-800"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
            <div className="flex gap-2">
              {/* Botón Ver Detalles */}
            
              

              {/* Botón Editar (solo para el creador) */}
              {task.creator.id == user.id && (
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  onClick={() => navigate(`/tasks/${task.id}/edit`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit className="text-lg" />
                  Editar
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-700 to-green-900 opacity-20 rounded-2xl filter blur-md"></div>
        )}
      </motion.div>
    );
  };

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      setError(null);

      try {
        const res = await getAllTasks();
        const data = res;
        console.log(data);

        if (Array.isArray(data.data)) {
          const formattedTasks = data.data.map((task) => ({
            id: String(task.id),
            title: task.title ?? "Sin título",
            description: task.description ?? "",
            dateNow: task.dateNow,
            created_at: task.created_at,
            creator: task.creator,
            done: task.done,
            archivo: task.archivo,
            portada: task.portada,
          }));

          const sortedTasks = formattedTasks.sort(
            (a, b) => Number(b.id) - Number(a.id)
          );

          setTasks(sortedTasks);
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
    return <p>Cargando tareas...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="row" style={{ justifyContent: "space-evenly" }}>
      {tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <div className="max-w-7xl mx-auto relative ">
          <h1 className="text-6xl font-extrabold letraop text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-red-900" style={{opacity: 0, animation: "fadeIn 2s forwards"}}>
            Publicaciones
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </h1>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8  ">
            {tasks.map((task) => (
              <NeonCard  key={task.id} task={task} />
            ))}

          </div>
        </div>
      )}
    </div>
  );
}
