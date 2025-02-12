import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../css/mispost.css';
import { Card } from "primereact/card";
import TasksTable from "../Componentes/TasksTable";

function mispost() {
  return (
    <>
    <div className="container-fluid" >
      <div className="card flex justify-content-center  " >
            <TasksTable></TasksTable>
      </div>
    </div>
    </>
  );
}

export default mispost;
