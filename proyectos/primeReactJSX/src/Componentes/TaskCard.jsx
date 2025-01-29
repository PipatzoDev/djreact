import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';

import "../css/taskformpage.css";
import "../css/cardinicio.css";
import "../css/imagenes.css";

const TaskCard = ({ task }) => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const header = task.portada ? (
    <img
      className="imgCardHeader"
      alt="Card"
      src={task.portada.replace(
        "http://localhost:8000/media/",
        "http://localhost:8000/usuarios/media/"
      )}
    />
  ) : (
    <img
      className="imgCardHeader"
      alt="Card"
      src={'bannerVacio.png'}
    />
  );

  const headerModal = task.portada ? (
    <img
      className="imgCardHeaderModal"
      alt="Card"
      src={task.portada.replace(
        "http://localhost:8000/media/",
        "http://localhost:8000/usuarios/media/"
      )}
    />
  ) : (
    <img
      className="imgCardHeader"
      alt="Card"
      src={'bannerVacio.png'}
    />
  );

  const footer = (
    <>
      <div>
        <Button
          label="Ver"
          icon="pi pi-eye"
          onClick={() => setVisible(true)}
        ></Button>
        <Button
          label="Editar"
          severity="secondary"
          icon="pi pi-pen-to-square"
          style={{ marginLeft: "0.5em" }}
          onClick={() => navigate(`/tasks/${task.id}`)}
        />
      </div>
    </>
  );

  const title = (
    <>
      <div className="parent">
        <div className="div1 text-truncate" style={{ maxWidth: '250' }}>
          <label>{task.title}</label>
        </div>
        <div className="div2">
          <label className="" style={{ fontSize: '13px', float: 'right' }}>
            {new Date(task.created_at).toLocaleString("es-ES")}
          </label>
        </div>
      </div>
    </>
  );

  return (
    <>  
      <Dialog
        header={task.title}
        visible={visible}
        modal={true}
        contentStyle={{ width: "100%" }}
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
        style={{ width: "70%" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        {headerModal}
        <p className="m-0">
          {task.description}
        </p>
      </Dialog>
      
      <Card
        title={title}
        footer={footer}
        header={header}
        className="font-bold shadow card-inicio"
      >
        <label className="text-gray-700">Creado por: {task.creator}</label>
        <div style={{ float: 'right' }}>
          {task.archivo ? <i className="pi pi-file"></i> : 'Sin Archivo'}
        </div>
      </Card>
    </>
  );
};

export default TaskCard;
