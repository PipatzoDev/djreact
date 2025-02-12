import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getAllTasks, getUserTasks } from "../api/tasks.api";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import '../css/tablas.css';
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { ProgressSpinner } from 'primereact/progressspinner';

const BACKEND_URL = "http://127.0.0.1:8000";

export default function TasksTable() {
  const { user, userGroups } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [viewMode, setViewMode] = useState('user');

  // Función de depuración

  // Función mejorada para verificar si el usuario es VIP
  const isVipUser = () => {
    console.log('Checking VIP status:', {
      userGroups,
      hasGroups: Boolean(userGroups),
      groupsLength: userGroups?.length
    });

    if (!userGroups || !Array.isArray(userGroups)) {
      console.log('No groups found or invalid format');
      return false;
    }

    const isVip = userGroups.some(group => {
      return group.name?.toLowerCase() === 'vip';
    });

    return isVip;
  };

  useEffect(() => {
    if (!isVipUser() && viewMode === 'all') {
      console.log('Forcing user mode - not VIP');
      setViewMode('user');
    }
  }, [userGroups]);

  useEffect(() => {
    loadTasks();
  }, [viewMode]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      let res;
      
      if (viewMode === 'user' && user) {
        res = await getUserTasks(user.id);
      } else {
        res = await getAllTasks();
      }
      
      if (res.data) {
        setTasks(res.data);
      }
    } catch (error) {
      console.error("Error al cargar las publicaciones:", error);
      setError("Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    const vipStatus = isVipUser();

    return (
      <div className="flex flexoff justify-between items-center p-1 w-full">
        <div className=" items-center gap-4">
          <h5 className="m-0 letraop text-2xl font-semibold text-emphasis" >
            {viewMode === 'user' ? 'Mis publicaciones' : 'Todas las publicaciones'}
          </h5>
          <div className="flex gap-2" style={{marginTop:'10px'}}>

            {vipStatus && (
              <Button
                icon="pi pi-globe"
                severity={viewMode === 'all' ? 'danger' : 'secondary'}
                className="p-button-sm "
                style={{borderRadius:'10px'}}
                onClick={() => setViewMode('all')}
                tooltip="Ver todas las publicaciones"
                tooltipOptions={{position:'top',style:{fontFamily:'Orbitron',fontSize:'16px'}}}
                />
              )}
            <Button

              icon="pi pi-user"
              style={{borderRadius:'10px'}}
              severity={viewMode === 'user' ? 'danger' : 'secondary'}
              className="p-button-sm"
              onClick={() => setViewMode('user')}
              tooltip="Ver mis publicaciones"
              tooltipOptions={{position:'top',style:{fontFamily:'Orbitron',fontSize:'16px'}}}
            />
          </div>
        </div>
        <span className="p-input-icon-left">
          {globalFilterValue ? null : <i className="pi pi-search"style={{marginLeft:"10px"}} /> }
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="     Buscar publicación..."
            className="p-inputtext-sm"
          />
        </span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag 
        severity={rowData.done ? "success" : "warning"}
        value={rowData.done ? "Completada" : "Pendiente"}
        className={rowData.done ? "bg-green-700" : "bg-yellow-700"}
      />
    );
  };

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.created_at).toLocaleString();
  };

  const fileBodyTemplate = (rowData) => {
    if (rowData.archivo) {
      const fileName = rowData.archivo.split('/').pop();
      const fileUrl = rowData.archivo.startsWith('http') 
        ? rowData.archivo 
        : `${BACKEND_URL}${rowData.archivo}`;
      
      return (
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-400 flex items-center"
        >
          <i className="pi pi-file mr-2" />
          {fileName}
        </a>
      );
    }
    return <span className="text-gray-500">Sin archivo</span>;
  };

  const coverBodyTemplate = (rowData) => {
    if (rowData.portada) {
      const coverUrl = rowData.portada.startsWith('http') 
        ? rowData.portada 
        : `${BACKEND_URL}${rowData.portada}`;
      
      return (
        <img 
          src={coverUrl} 
          alt="Portada" 
          className="w-12 h-12 rounded-lg object-cover border-2 border-red-900"
        />
      );
    }
    return <span className="text-gray-500">Sin portada</span>;
  };

  const header = renderHeader();

  return (
    <div className="" >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ProgressSpinner />
        </div>
      ) : error ? (
        <div className="p-4 bg-danger text-emphasis rounded-lg">
          <i className="pi pi-exclamation-circle mr-2" />
          {error}
        </div>
      ) : (
        <div className="custom-datatable-wrapper   "style={{boxShadow:'0 0 50px 0 rgba(0, 0, 0, 0.5)', }}>
          <DataTable
            value={tasks}
            paginator
            rows={10}
            dataKey="id"
            filters={filters}
            filterDisplay="menu"
            loading={loading}
            responsiveLayout="scroll"
            header={header}
            emptyMessage={viewMode === 'user' ? "No tienes publiciones creadas" : "No hay publicaciones disponibles"}
            className="letraop"
            stripedRows
            sortMode="multiple"

          >
            <Column 
              field="id" 
              header="ID" 
              sortable 
              className="custom-column"
              headerClassName="custom-column-header"
              style={{ width: '5%' }}
            />
            <Column 
              field="title" 
              header="Título" 
              sortable 
              filter 
              className="custom-column"
              headerClassName="custom-column-header"
              style={{ width: '25%' }}
            />
            <Column
              field="created_at"
              header="Fecha Creación"
              body={dateBodyTemplate}
              sortable
              className="custom-column"
              headerClassName="custom-column-header"
              style={{ width: '15%' }}
            />
            <Column
              field="done"
              header="Estado"
              body={statusBodyTemplate}
              sortable
              className="custom-column"
              headerClassName="custom-column-header"
              style={{ width: '10%' }}
            />
            <Column
              field="portada"
              header="Portada"
              body={coverBodyTemplate}
              className="custom-column"
              headerClassName="custom-column-header"
              style={{ width: '15%' }}
            />
            <Column
              field="archivo"
              header="Archivo"
              body={fileBodyTemplate}
              className="custom-column"
              headerClassName="custom-column-header"
              style={{ width: '20%' }}
            />
            {viewMode === 'all' && (
              <Column
                field="creator.username"
                header="Autor"
                sortable
                className="custom-column"
                headerClassName="custom-column-header"
                style={{ width: '10%' }}
                body={(rowData) => {
                  return rowData.creator|| 'Usuario Desconocido';
                }}
              />
            )}
          </DataTable>
        </div>
      )}
    </div>
  );
}
