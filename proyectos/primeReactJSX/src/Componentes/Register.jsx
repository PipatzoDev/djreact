import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import "../css/login.css";
import "../css/form.css";
import { useToast } from "../context/ToastContext";
import { ProgressSpinner } from "primereact/progressspinner";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.password2) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.current.show({ severity: 'success', summary: 'Cuenta Creada', detail: `Usuario registrado ${formData.username} correctamente`, life: 10000 });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (

        <div className="">
       
          {error && <p className="error text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="inputGroup">
              <label className="label">Usuario</label>
              <input
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="input hover-pipa"
                required
              />
            </div>
            <div className="inputGroup">
              <label className="label">Email</label>
              <input
                type="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input hover-pipa"
                required
              />
            </div>
            <div className="inputGroup">
              <label className="label">Contraseña</label>
              <input
                type="password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input hover-pipa"
                required
              />
            </div>
            <div className="inputGroup">
              <label className="label">Confirmar Contraseña</label>
              <input
                type="password"
                onChange={(e) =>
                  setFormData({ ...formData, password2: e.target.value })
                }
                className="input hover-pipa"
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
                      Registrarme
                    </button>
                  )}
          </form>
        </div>

  );
};

export default Register;
