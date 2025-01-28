import React, { useState, FormEvent, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginCredentials } from "../types/auth";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import '../css/form.css'

const Login: React.FC = () => {
  const toast = useRef(null);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await login(credentials);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error en el inicio de sesión"
      );
      showError();
    }
    setIsLoading(false);
  };

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "¡Error al ingreso!",
      detail: error,
      life: 7000,
    });
  };
  return (
    <>
      <Toast ref={toast} />
      <div className="div-container">
        <Card className="font-bold  card-perso" style={{height:'400px'}}>
          <div className=" p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center"  style={{borderRadius:'10px',borderLeft:'3px solid red',borderRight:'3px solid red'}}>Portal P2H</h2>
            <div className="form-container" style={{ boxShadow: "none" }}>
              <form
                onSubmit={handleSubmit}
                className="block text-sm font-medium"
              >
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    className="form-control hover-pipa"
                    required
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="form-control hover-pipa"
                    required
                  />
                </div>
                <div className=" flex items-center justify-between mb-6">
                  {isLoading ? (
                    <button type="submit" className="form-control hover-pipa">
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
                </div>
                <div className="text-center">
                  <Link to="/register">
                    <Button className="form-control hover-pipa">
                      Registrarme
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;
