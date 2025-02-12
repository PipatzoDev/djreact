import { useCallback, useState } from "react";
import { Button } from "primereact/button";
import { TasksList } from "../Componentes/TasksList";
import "../css/inicio.css";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import TaskFormPage from "./TaskFormPage";
import { Ripple } from 'primereact/ripple';

function Inicio() {
  const [visible, setVisible] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleTaskCreated = useCallback(() => {
    setRefreshTasks((prev) => prev + 1);
    setVisible(false);
  }, []);

  
  return (
    <>
      <div className="flex justify-center">
        <TaskFormPage onTaskCreated={handleTaskCreated} />
        </div>
      <div className="">
     

        <TasksList key={refreshTasks} />
      </div>
    </>
  );
}

export default Inicio;
