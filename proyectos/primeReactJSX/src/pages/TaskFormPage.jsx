import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Checkbox } from "primereact/checkbox";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../context/AuthContext";
import { createTask, updateTask, getTask, deleteTask } from "../api/tasks.api";
import { useToast } from "../context/ToastContext";

export default function TaskFormPage({ onTaskCreated }) {
  const { user } = useAuth();
  const toast = useToast();
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        try {
          const res = await getTask(params.id);
          const task = res.data;

          setValue("title", task.title);
          setValue("description", task.description);
          setValue("extra", task.extra || "");
          setValue("done", task.done || false);
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo cargar la tarea",
            life: 3000,
          });
        }
      }
    }
    loadTask();
  }, [params.id, setValue, toast]);

  const onSubmit = handleSubmit(async (data) => {
    setCargando(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("creator", user.id);

      if (data.extra) formData.append("extra", data.extra);
      if (data.done !== undefined) formData.append("done", data.done.toString());
      if (data.portada) formData.append("portada", data.portada);
      if (data.archivo) formData.append("archivo", data.archivo);

      if (params.id) {
        await updateTask(params.id, formData);
        toast.current?.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: `Tarea "${data.title}" modificada`,
          life: 3000,
        });
      } else {
        await createTask(formData);
        toast.current?.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: `Tarea "${data.title}" creada`,
          life: 3000,
        });
      }

      onTaskCreated?.();
      navigate("/tasks");
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.response?.data?.detail || "No se pudo procesar la tarea",
        life: 3000,
      });
    } finally {
      setCargando(false);
    }
  });

  const handleFileSelect = (type) => (e) => {
    if (e.files && e.files.length > 0) {
      setValue(type, e.files[0]);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de eliminar esta tarea?")) {
      try {
        await deleteTask(params.id);
        toast.current?.show({
          severity: "success",
          summary: "¡Éxito!",
          detail: "Tarea eliminada",
          life: 3000,
        });
        navigate("/tasks");
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
    <div className="task-form-container">
      <h1>{params.id ? "Editar Tarea" : "Crear Nueva Tarea"}</h1>

      <form onSubmit={onSubmit}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="title">Título</label>
            <InputText
              {...register("title", { required: "El título es requerido" })}
              placeholder="Ingrese el título"
            />
            {errors.title && <small className="p-error">{errors.title.message}</small>}
          </div>

          <div className="p-field">
            <label htmlFor="description">Descripción</label>
            <InputTextarea
              {...register("description", { required: "La descripción es requerida" })}
              rows={3}
              placeholder="Descripción de la tarea"
            />
            {errors.description && <small className="p-error">{errors.description.message}</small>}
          </div>

          <div className="p-field">
            <label>Portada</label>
            <FileUpload
              mode="basic"
              name="portada"
              accept="image/*"
              maxFileSize={1000000}
              onSelect={handleFileSelect("portada")}
            />
          </div>

          <div className="p-field">
            <label htmlFor="extra">Extras</label>
            <InputText
              {...register("extra", { required: false })}
              placeholder="Información adicional"
            />
          </div>

          <div className="p-field-checkbox">
            <Controller
              name="done"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.checked)}
                />
              )}
            />
          </div>

          <div className="p-field">
            <label>Archivo Adjunto</label>
            <FileUpload
              mode="basic"
              name="archivo"
              onSelect={handleFileSelect("archivo")}
            />
          </div>

          {cargando ? (
            <ProgressSpinner />
          ) : (
            <Button type="submit" label={params.id ? "Actualizar" : "Crear"} className="p-mt-2" />
          )}
        </div>
      </form>

      {params.id && (
        <Button label="Eliminar" severity="danger" onClick={handleDelete} />
      )}
    </div>
  );
}
