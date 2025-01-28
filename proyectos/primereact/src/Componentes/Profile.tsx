import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card } from "primereact/card";
import "../css/taskformpage.css";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.includes("http://localhost:8000")) {
      const pathMatch = imagePath.match(/\/media\/(.*)/);
      if (pathMatch) {
        return `http://localhost:8000/usuarios/media/${pathMatch[1]}`;
      }
    }
    return `http://localhost:8000/usuarios/media/${imagePath.replace(
      /^media\//,
      ""
    )}`;
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="font-bold shadow card-perso"
          style={{ maxWidth: "100%" }}
        >
          {/* Header Section */}
          <div className="color-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Mi Perfil</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </Card>
        <Card
          className="font-bold shadow card-perso"
          style={{ maxWidth: "100%" }}
        >
          {/* User Information Section */}

          {/* User Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Información Personal
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col">
                <div className="user-photo">
                  {user?.imagen ? (
                    <img src={getImageUrl(user.imagen)} alt="Foto de usuario" />
                  ) : (
                    <p>No hay imagen de perfil</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  Nombre de Usuario:
                </span>
                <span className="text-lg font-medium">{user.username}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  Correo Electrónico
                </span>
                <span className="text-lg font-medium">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">ID de Usuario</span>
                <span className="text-lg font-medium">{user.id}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Nombre</span>
                <span className="text-lg font-medium">{user.first_name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Apellido</span>
                <span className="text-lg font-medium">{user.last_name}</span>
              </div>
            </div>
          </div>
        </Card>
        <Card
          className="font-bold shadow card-perso"
          style={{ maxWidth: "100%" }}
        >
          {/* Account Actions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Acciones de Cuenta
            </h2>
            <div className="space-y-3">
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/edit-profile")} // Implementar esta ruta si se necesita
              >
                Editar Perfil
              </button>
              <button
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                onClick={() => navigate("/change-password")} // Implementar esta ruta si se necesita
              >
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </Card>
        <Card
          className="font-bold shadow card-perso"
          style={{ maxWidth: "100%" }}
        >
          {/* Additional Information Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Información Adicional
            </h2>
            <div className="bg-blue-50 rounded-md p-4">
              <p className="text-sm text-blue-600">
                Tu cuenta está activa y segura. Última sesión iniciada hace unos
                momentos.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Profile;
