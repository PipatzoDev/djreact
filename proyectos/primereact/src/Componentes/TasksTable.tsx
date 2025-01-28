import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAllTasks } from '../api/tasks.api'; // Asegúrate de que la API esté bien configurada

export default function TasksTable() {
    const [tasks, setTasks] = useState<any[]>([]); // Usamos un tipo más general (any[]) mientras recibimos los datos
    const [loading, setLoading] = useState<boolean>(true); // Estado de carga
    const [error, setError] = useState<string | null>(null); // Para capturar errores

    // Cargar tareas desde la API
    useEffect(() => {
        async function loadTasks() {
            try {
                const res = await getAllTasks(); // Realiza la llamada a la API
                if (res && res.data) {
                    setTasks(res.data); // Establecer los datos en el estado
                } else {
                    setError("No se encontraron tareas.");
                }
            } catch (err) {
                setError("Ocurrió un error al cargar las tareas.");
                console.error(err); // Para depurar el error
            } finally {
                setLoading(false); // Cuando termine la carga (ya sea exitosa o con error)
            }
        }
        loadTasks();
    }, []);
    
    const footer = `En total hay  ${tasks ? tasks.length : 0} tareas.`;

    // Función para mostrar el estado de la tarea (completada o no)
    const renderDone = (rowData: any) => {
        return rowData.done ? 'Completada' : 'Pendiente'; // Muestra "Completada" o "Pendiente" dependiendo del valor de 'done'
    };

    
    const renderArchivo = (rowData: any) => {
        // Verificamos si 'archivo' contiene el prefijo 'http://localhost:8000/media'
        if (rowData.archivo) {
            // Si ya tiene el prefijo 'http://localhost:8000/media', agregamos 'usuarios' antes de 'media'
            if (rowData.archivo.startsWith("http://localhost:8000/media")) {
                // Reemplazamos 'http://localhost:8000/media' con 'http://localhost:8000/usuarios/media'
                const archivoUrl = rowData.archivo.replace("http://localhost:8000/media", "http://localhost:8000/usuarios/media");
    
                return (
                    <a href={archivoUrl} target="_blank" rel="noopener noreferrer">
                        Ver Archivo
                    </a>
                );
            } else {
                // Si no tiene el prefijo, simplemente concatenamos correctamente
                return (
                    <a
                        href={`http://localhost:8000/usuarios/media/${rowData.archivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver Archivo
                    </a>
                );
            }
        } else {
            return <span>Vacío</span>; // Si no hay archivo
        }
    };
    



    const renderCreacion = (rowData: any) => {
        return new Date(rowData.created_at).toLocaleString(); // Muestra la fecha de creación en formato local
    };

    // Función para mostrar portada si existe
    const renderPortada = (rowData: any) => {
        if (rowData.portada) {
            if (rowData.portada.startsWith("http://localhost:8000/media")) {
                const portadaUrl = rowData.portada.replace("http://localhost:8000/media", "http://localhost:8000/usuarios/media");
    
                return (
                    <a href={portadaUrl} target="_blank" rel="noopener noreferrer">
                        Ver Portada
                    </a>
                );
            } else {
                // Si no tiene el prefijo, simplemente concatenamos correctamente
                return (
                    <a
                        href={`http://localhost:8000/usuarios/media/${rowData.portada}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver Archivo
                    </a>
                );
            }
        } else {
            return <span>Vacío</span>; // Si no hay archivo
        }
    };
    

    return (
        <div className="card">
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p>{error}</p> // Muestra el error si existe
            ) : (
                <DataTable 
                    selectionMode="single"  
                    footer={footer} 
                    stripedRows 
                    paginator 
                    rows={5} 
                    rowsPerPageOptions={[5, 10, 25, 50]} 
                    value={tasks} 
                    tableStyle={{ minWidth: '50rem' }} 
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="title" header="Título" sortable></Column>
                    <Column field="created_at" body={renderCreacion} header="Creado el" sortable></Column>
                    <Column field="done" header="Completada?" body={renderDone} sortable></Column>
                    <Column field="archivo" header="Archivo" body={renderArchivo} sortable></Column>
                    <Column field="portada" header="Portada" body={renderPortada} sortable></Column>
                </DataTable>
            )}
        </div>
    );
}
