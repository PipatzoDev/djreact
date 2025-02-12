import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useToast } from "../context/ToastContext";
import "../css/form.css";
import "../css/login.css";
import Scene from '../Componentes/objeto3d';
import { Button } from "primereact/button";
import Register from "./Register";

const Login = () => {
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleEdit = () => {
    setIsEditing(!isEditing);
      if(isEditing){
        return <Register />
      }else{
        return <Login />
      }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await login(credentials);
      toast.current.show({severity:'success', summary: 'Bienvenido de nuevo', detail:`Hola, ${credentials.username}`, life: 12000});
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error en el inicio de sesión";
      setError(errorMessage);
        toast.current?.show({
          severity: "error",
          summary: "¡Error!",
          detail: 'Usuario o contraseña incorrectos',
          life: 15000,
        });
      
    } finally {
      setIsLoading(false);  
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  return (
    <>
   
     <div style={{ width: '100%', height: '100vh',  zIndex:'-1', display:'fixed', position:'fixed'}}>
      <Scene />
    </div>
      <div className="container phone-only">
        <div className="wrapper">
          {/* Left empty space */}
          <div className="emptySpace"></div>

          {/* Login form */}
          <div className="loginForm">
          <h2
              className="text-2xl font-bold mb-6 text-center"
              style={{
                borderRadius: "10px",
                borderLeft: "3px solid red",
                borderRight: "3px solid red",
                marginBottom: "40px",
              }}
            >
             {isEditing ?  "Registro" : "Portal P2H"  }
            </h2>
            {isEditing ? <Register /> : 
            <form onSubmit={handleSubmit}>
              <div className="inputGroup">
                <label htmlFor="user" className="label">
                  Usuario
                </label>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="form-control hover-pipa"
                    required
                  />
              </div>
              <div className="inputGroup">
                <label htmlFor="password" className="label">
                  Contraseña
                </label>
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="form-control hover-pipa"
                    required
                  />
              </div>
              {isLoading ? (
                    <button
                      type="submit"
                      className="form-control hover-pipa"
                      disabled
                    >
                      <ProgressSpinner
                        style={{ width: "20px", height: "20px" }}
                        strokeWidth="8"
                        fill="var(--surface-ground)"
                        animationDuration=".5s"
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="form-control btn btn-danger hover-pipa"
                    >
                      Iniciar Sesión
                    </button>
                  )}
            </form>
            }
            <div className="linkContainer">
            <Button
                type="button"
                icon="pi pi-lock"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() => navigate('/password-reset')}
                label="¿Olvidaste tu contraseña?"
              />
          
              <Button
                type="button"
                icon={isEditing ? "pi pi-arrow-left" : "pi pi-user-plus"}
                className={`p-button-rounded p-button-text ${isEditing ? 'p-button-danger' : 'p-button-secondary'}`}
                onClick={toggleEdit}
                label={isEditing ?"Volver al login" : "Crear cuenta"}
       
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
