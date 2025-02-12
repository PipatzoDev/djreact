import React, { useState, useRef } from 'react';
import { useAuth } from "../context/AuthContext";
import { Card } from "primereact/card";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FaUser, FaEnvelope, FaLock, FaImage, FaUserEdit } from "react-icons/fa";

const ProfileConfig = () => {
  const { user, updateUser } = useAuth();
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    imagen: null
  });

  const [previewImage, setPreviewImage] = useState(user?.imagen || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    toast.current.show({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Perfil actualizado correctamente',
      life: 3000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <Toast ref={toast} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <FaUserEdit className="text-red-500 mr-3" />
            Editar Perfil
          </h1>
          <p className="text-gray-400">Actualiza tu información personal</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaUser className="text-red-500 mr-2" />
              Información Personal
            </h3>

            <div className="space-y-4">
              {/* Imagen de Perfil */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img
                    src={previewImage || "uservacio.png"}
                    alt="Preview"
                    className="w-32 h-32 rounded-full border-4 border-red-600 mb-4 shadow-lg group-hover:opacity-75 transition-all duration-300"
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaImage className="text-white text-3xl cursor-pointer" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors duration-300"
                >
                  Cambiar foto
                </button>
              </div>

              {/* Campos de Información */}
              <div className="space-y-4">
                <div className="p-float-label">
                  <InputText
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-gray-700/50 border-gray-600 text-white"
                  />
                  <label htmlFor="username" className="text-gray-400">Nombre de Usuario</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-float-label">
                    <InputText
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full bg-gray-700/50 border-gray-600 text-white"
                    />
                    <label htmlFor="first_name" className="text-gray-400">Nombre</label>
                  </div>

                  <div className="p-float-label">
                    <InputText
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full bg-gray-700/50 border-gray-600 text-white"
                    />
                    <label htmlFor="last_name" className="text-gray-400">Apellido</label>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Seguridad */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaLock className="text-red-500 mr-2" />
              Seguridad
            </h3>

            <div className="space-y-4">
              <div className="p-float-label">
                <InputText
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-gray-700/50 border-gray-600 text-white"
                />
                <label htmlFor="email" className="text-gray-400">Correo Electrónico</label>
              </div>

              <div className="p-float-label">
                <InputText
                  id="current_password"
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_password: e.target.value }))}
                  className="w-full bg-gray-700/50 border-gray-600 text-white"
                />
                <label htmlFor="current_password" className="text-gray-400">Contraseña Actual</label>
              </div>

              <div className="p-float-label">
                <InputText
                  id="new_password"
                  type="password"
                  value={formData.new_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                  className="w-full bg-gray-700/50 border-gray-600 text-white"
                />
                <label htmlFor="new_password" className="text-gray-400">Nueva Contraseña</label>
              </div>

              <div className="p-float-label">
                <InputText
                  id="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                  className="w-full bg-gray-700/50 border-gray-600 text-white"
                />
                <label htmlFor="confirm_password" className="text-gray-400">Confirmar Contraseña</label>
              </div>
            </div>
          </Card>

          {/* Botones de Acción */}
          <div className="md:col-span-2">
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  label="Cancelar"
                  className="p-button-secondary"
                  onClick={() => navigate(-1)}
                />
                <Button
                  type="submit"
                  label="Guardar Cambios"
                  className="p-button-danger"
                  icon="pi pi-check"
                />
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileConfig;
