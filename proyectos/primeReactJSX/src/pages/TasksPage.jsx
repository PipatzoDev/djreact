import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  FaDownload,
  FaEdit,
  FaTrash,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

export function TaskPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toast = useRef(null);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/api/v1/tasks/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("tokens")).access
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar la publicación");

      const data = await response.json();
      setTask(data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar la publicación",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar esta publicación?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/api/v1/tasks/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("tokens")).access
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar la publicación");

      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Publicación eliminada correctamente",
        life: 3000,
      });
      navigate("/");
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la publicación",
        life: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!task) return null;

  const isCreator = user?.id === task.creator;
  const volverinicio = () => {
    navigate("/");
  };
  return (
    <div
      className="p-4 letraop"
    >
      <Toast ref={toast} />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card
          className="letraop bg-black border-2 border-red-900"
          style={{
            boxShadow: "0 0 50px 0 rgba(239, 68, 68, 0.5)",
            borderRadius: "20px",
          }}
        >
          {/* Encabezado */}
          <div className="mb-6" style={{ marginTop: "-20px" }}>
            <Button
              id="volverinicio"
              type="button"
              onClick={volverinicio}
              style={{
                borderRadius: "20%",
                float: "left",
                marginRight: "10px",
              }}
              icon="pi pi-arrow-left"
              outlined
              severity="danger"
            />

            <h1 className="letraop text-3xl font-bold text-white mb-2">
              {task.title}
            </h1>

            <div className="flex flexoff items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <FaClock />
                {format(new Date(task.created_at), "d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </div>
              <div className="flex items-center gap-2">
                <FaUser />
                {task.creator_name || "Usuario"}
              </div>
              <Tag
                className="letraop"
                severity={task.done ? "success" : "warning"}
                value={task.done ? "Completada" : "Pendiente"}
                icon={task.done ? "pi pi-check" : "pi pi-clock"}
              />
            </div>
          </div>

          {/* Imagen de portada */}
          {task.portada && (
            <div className="mb-6">
              <Image
                src={
                  task.portada
                    ? task.portada.replace(
                        "http://127.0.0.1:8000/media/",
                        "http://127.0.0.1:8000/usuarios/media/"
                      )
                    : "/bannerVacio.png"
                }
                alt="Portada de la tarea"
                width="100%"
                preview
                className="rounded-lg shadow-lg letraop"
              />
            </div>
          )}

          {/* Descripción */}
          <div className="mb-6 ">
            <h2 className="letraop text-xl font-semibold text-white mb-2">
              Descripción
            </h2>
            <p className="letraop text-gray-300 whitespace-pre-wrap bg-gray-700/30 rounded-lg" >
              {task.description || "Sin descripción"}
            </p>
          </div>

          {/* Información adicional */}
          {task.extra && (
            <div className="mb-6">
              <h2 className="letraop text-xl font-semibold text-white mb-2">
                Información adicional
              </h2>
              <p className="letraop text-gray-300 bg-gray-700/30 rounded-lg">{task.extra}</p>
            </div>
          )}

          {/* Archivo adjunto */}
          {task.archivo && (
            <div className="mb-6">
              <h2 className="letraop text-xl font-semibold text-white mb-2">
                Archivo adjunto
              </h2>
              <Button
                label={task.archivo.split("/").pop()}
                icon={<FaDownload className="mr-2" />}
                style={{overflow:"hidden"}}
                className=" p-button-outlined p-button-secondary"
                onClick={() => window.open(task.archivo, "_blank")}
              />
            </div>
          )}

          {/* Botones de acción */}
          {isCreator && (
            <div className="flex flexoff  gap-4 mt-6">
              <Button
                label="Editar"
                icon={<FaEdit className="mr-2" />}
                className="p-button-outlined"
                onClick={() => navigate(`/tasks/${id}/edit`)}
              />
              <Button
                label="Eliminar"
                icon={<FaTrash className="mr-2" />}
                className="p-button-outlined p-button-danger"
                onClick={handleDelete}
              />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default TaskPage;
