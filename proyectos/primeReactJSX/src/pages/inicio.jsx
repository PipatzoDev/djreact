import { useCallback, useState } from "react";
import { Button } from "primereact/button";
import { TasksList } from "../Componentes/TasksList";
import "../css/inicio.css";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import TaskFormPage from "./TaskFormPage";

function Inicio() {
  const [visible, setVisible] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);

  const handleTaskCreated = useCallback(() => {
    setRefreshTasks((prev) => prev + 1);
    setVisible(false);
  }, []);
  return (
    <>
      <Dialog
        header="Crear Post"
        visible={visible}
        modal={false}
        contentStyle={{   width: "100%",}}
        unstyled={false}
        maximizable={true}
        resizable={true}
        headerStyle={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "40px",
          backgroundColor: "#ce0000",
          boxShadow: "0 10px 5px rgba(0, 0, 0, 0.5)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          padding: "10px",
        }}
        className="p-dialog"
        style={{width: "50%"}}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <TaskFormPage onTaskCreated={handleTaskCreated} />
      </Dialog>
      <div className="container-fluid ">
        <h1>
          <i
            className="pi pi-home"
            style={{ fontSize: "2.5rem", paddingLeft: "10px" }}
          ></i>{" "}
          Inicio
        </h1>

        <Button
          onClick={() => setVisible(true)}
          style={{ borderRadius: "5px" }}
          label="+ Crear Tareas"
        />


          <TasksList key={refreshTasks} />

      </div>
    </>
  );
}

export default Inicio;
