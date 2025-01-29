import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import '../css/mispost.css';
import { Card } from "primereact/card";
import TasksTable from "../Componentes/TasksTable";

function mispost() {
  return (
    <>
      <div className="card flex justify-content-center card-perso">
        <Card title="Mis Post">
            <TasksTable></TasksTable>
        </Card>
      </div>
    </>
  );
}

export default mispost;
