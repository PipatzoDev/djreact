import React, { useEffect, useState } from "react";
import "../index.css";
import "../css/form.css";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";
import { useAuth } from "../context/AuthContext";
import { createTask, updateTask, getTask, deleteTask } from "../api/tasks.api";
import { useToast } from "../context/ToastContext";
import { Toast } from "primereact/toast";
import { motion } from "framer-motion";

export default function TaskFormPage({ onTaskCreated }) {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      done: false,
    },
  });

  const done = watch("done");

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        try {
          const res = await getTask(params.id);
          const task = res.data;
          setData(task); // Guardamos los datos de la tarea

          setValue("title", task.title);
          setValue("description", task.description);
          setValue("extra", task.extra || "");
          setValue("done", task.done || false);
          setValue("archivo", task.archivo || null);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo cargar la publicacion",
            life: 3000,
          });
        }
      }
    }
    loadTask();
  }, [params.id, setValue, toast]);

  const volverinicio = () => {
    navigate("/");
  };
  const onSubmit = handleSubmit(async (data) => {
    setCargando(true);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Agregar campos básicos
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("creator", user.id);

      // Agregar campos opcionales solo si tienen valor
      if (data.extra) {
        formData.append("extra", data.extra);
      }

      if (data.done !== undefined) {
        formData.append("done", data.done.toString());
      }

      // Para actualización, solo agregar archivos si son nuevos
      if (params.id) {
        // Si hay nuevos archivos, agregarlos
        if (data.portada instanceof File) {
          formData.append("portada", data.portada);
        }
        if (data.archivo instanceof File) {
          formData.append("archivo", data.archivo);
        }
      } else {
        // Para nueva tarea, agregar archivos si existen
        if (data.portada) {
          formData.append("portada", data.portada);
        }
        if (data.archivo) {
          formData.append("archivo", data.archivo);
        }
      }

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("tokens")).access
          }`,
        },
      };

      let response;
      if (params.id) {
        response = await updateTask(params.id, formData, config);
        toast.current?.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: `Publicacion "${data.title}" modificada`,
          life: 3000,
        });
      } else {
        response = await createTask(formData, config);
        toast.current?.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: `Publicacion "${data.title}" creada`,
          life: 3000,
        });
      }

      onTaskCreated?.();
      navigate("/");
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error.response?.data?.detail || "No se pudo procesar la publicacion",
        life: 3000,
      });
    } finally {
      setCargando(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  const handleFileSelect = (type) => (e) => {
    if (e.files && e.files.length > 0) {
      const file = e.files[0];
      setValue(type, file);

      // Si estamos editando, marcar el campo como "touched"
      if (params.id) {
        form.setFieldTouched(type, true);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de eliminar esta publicacion?")) {
      try {
        await deleteTask(params.id);
        toast.current?.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: "Tarea eliminada",
          life: 3000,
        });
        navigate("/");
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar la tarea",
          life: 3000,
        });
      }
    }
  };

  return (
    <div className="block form-task">
     

      <motion.div
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.4,
        }}
        style={{ width: "100%" }}
        className=" relative"
      >
        <motion.div
          className="outline-2 outline-offset-0 outline-red-900 relative bg-black rounded-2xl  p-6 overflow-hidden"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 50px 0 rgba(239, 68, 68, 0.5)",
          }}
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-field"
            >
              <label className="mb-2">Título</label>
              <InputText
                {...register("title", { required: true })}
                className="w-full hover-pipa p-3 bg-gray-800 border border-red-900 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                placeholder="Título de la tarea"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  Título es requerido
                </span>
              )}

              <label className=" mb-2 block">Descripción</label>
              <InputTextarea
                {...register("description")}
                className="w-full hover-pipa p-3 bg-gray-800 border border-red-900 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                rows={4}
                placeholder="Descripción de la tarea"
              />

              <label className="mb-2 block">Extra: </label>
              <InputText
                style={{ marginBottom: "10px" }}
                {...register("extra")}
                className="w-full hover-pipa p-3 bg-gray-800 border border-red-900 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                placeholder="Extra de la tarea"
              />
              {errors.extra && (
                <span className="text-red-500 text-sm">Extra es requerido</span>
              )}
              <div className="flex task-form-block justify-between gap-4 items-center">
                <label className="mb-2 block">Estado: </label>
                <Controller
                  name="done"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        inputId="done"
                        onChange={(e) => field.onChange(e.checked)}
                        checked={field.value}
                        style={{ accentColor: "red" , marginBottom: "10px" }}
                        variant="outlined"
                      />
                    </div>
                  )}
                />

                <label className="mb-2 block ">
                  Portada <span className="text-red-300">1MB máximo</span>
                </label>

                <FileUpload
                  mode="basic"
                  name="portada"
                  style={{ marginBottom: "10px" }}
                  accept="image/*"
                  maxFileSize={1000000} // 1MB
                  onSelect={handleFileSelect("portada")}
                  chooseLabel={
                    data?.portada ? (
                      <label className="letraop">Cambiar portada</label>
                    ) : (
                      <label className="letraop">Subir portada</label>
                    )
                  }
                  className="w-full"
                />

                <label className="" style={{ width: "100%" }}>
                  Archivo Adjunto{" "}
                  <span className="text-red-300">50MB máximo</span>
                </label>
                <FileUpload
                  mode="basic"
                  style={{ marginBottom: "10px" }}
                  name="archivo"
                  maxFileSize={52428800}
                  onSelect={handleFileSelect("archivo")}
                  chooseLabel={
                    data?.archivo ? (
                      <label className="letraop">
                        {data?.archivo.split("/").pop()}
                      </label>
                    ) : (
                      <label className="letraop">Subir archivo</label>
                    )
                  }
                  className="w-full"
                />
                {isUploading && (
                  <div className="mt-2">
                    <ProgressBar
                      value={uploadProgress}
                      showValue={true}
                      className="h-2 bg-gray-700"
                      style={{
                        "--progress-bg": "rgb(239, 68, 68)",
                      }}
                    />
                    <div className="text-sm text-red-300 mt-1">
                      {uploadProgress === 100
                        ? "Procesando archivo..."
                        : `Subiendo: ${uploadProgress}%`}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            <hr></hr>
            {params.id ? (
              <Button
                id="volverinicio"
                type="button"
                onClick={volverinicio}
                style={{ borderRadius: "20%", float: "left" }}
                icon="pi pi-arrow-left"
                outlined
                severity="danger"
              />
            ) : (
              <Button
                id="refresh"
                type="button"
                tooltip="Recargar publicaciones"
                tooltipOptions={{
                  position: "top",
                  style: { fontFamily: "Orbitron", fontSize: "16px" },
                }}
                onClick={volverinicio}
                style={{ borderRadius: "20%", float: "left" }}
                icon="pi pi-refresh"
                outlined
                severity="info"
              />
            )}

            <div className="flex justify-end gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  type="submit"
                  disabled={cargando}
                  className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg hover:from-red-800 hover:to-red-950 transition-all"
                  label={cargando ? "Guardando..." : "Guardar"}
                  icon="pi pi-save"
                />
              </motion.div>
              {params.id && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={handleDelete}
                    icon="pi pi-trash"
                    style={{
                      borderRadius: "20%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    severity="danger"
                  ></Button>
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>

      {cargando && (
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="text-red-500 text-4xl"
        >
          <i className="pi pi-spin pi-spinner" />
        </motion.div>
      )}
    </div>
  );
}
