import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RegisterData } from "../types/auth";
import { Button } from "primereact/button";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error en el registro");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold">Registro</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="text"
            placeholder="Usuario"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="appearance-none rounded-md relative block w-full px-3 py-2 border"
            required
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="appearance-none rounded-md relative block w-full px-3 py-2 border"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="appearance-none rounded-md relative block w-full px-3 py-2 border"
            required
          />
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            onChange={(e) =>
              setFormData({ ...formData, password2: e.target.value })
            }
            className="appearance-none rounded-md relative block w-full px-3 py-2 border"
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Registrarse
          </button>
          <Link to="/login">
            <Button>Atras</Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
