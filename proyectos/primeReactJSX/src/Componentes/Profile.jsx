import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card } from "primereact/card";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FaUser, FaEnvelope, FaIdCard, FaCog, FaUserEdit, FaEdit } from "react-icons/fa";
import "../css/taskformpage.css";
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';

// Utilizamos los tipos existentes del contexto de autenticación

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Actualizar el formData para que siempre refleje los datos actuales del usuario
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    is_staff: user?.is_staff || false,
    is_active: user?.is_active || false,
    groups: user?.groups || []
  });

  // Actualizar formData cuando cambie el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        is_staff: user.is_staff || false,
        is_active: user.is_active || false,
        groups: user.groups || []
      });
    }
  }, [user]);

  const fileUploadRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "uservacio.png";
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/media/')) {
      return `http://127.0.0.1:8000/usuarios${imagePath}`;
    }
    
    if (imagePath.startsWith('media/')) {
      return `http://127.0.0.1:8000/usuarios/${imagePath}`;
    }
    
    return `http://127.0.0.1:8000/usuarios/media/${imagePath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tokens = localStorage.getItem('tokens');
      if (!tokens) throw new Error('No authentication tokens found');

      const response = await fetch('http://127.0.0.1:8000/usuarios/api/profile/update/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(tokens).access}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      const updatedUserData = await response.json();
      
      // Actualizamos directamente con los nuevos datos
      updateUser(updatedUserData);

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Perfil actualizado correctamente',
        life: 3000
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Error al actualizar el perfil',
        life: 3000
      });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Restaurar datos originales si se cancela la edición
      setFormData({
        username: user?.username || '',
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        is_staff: user?.is_staff || false,
        is_active: user?.is_active || false,
        groups: user?.groups || []
      });
    }
    setIsEditing(!isEditing);
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const tokens = localStorage.getItem('tokens');
      if (!tokens) throw new Error('No authentication tokens found');

      const formData = new FormData();
      formData.append('imagen', file);

      // Asegurarnos de mantener los datos existentes del usuario
      Object.keys(user).forEach(key => {
        if (key !== 'imagen' && user[key] !== null) {
          formData.append(key, user[key]);
        }
      });

      const response = await fetch('http://127.0.0.1:8000/usuarios/api/profile/update/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${JSON.parse(tokens).access}`
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar la imagen');
      }

      const updatedUserData = await response.json();
      
      // Actualizar el contexto con los nuevos datos
      updateUser(updatedUserData);

      // Actualizar la vista previa de la imagen
      setSelectedImage(URL.createObjectURL(file));

      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Imagen actualizada correctamente',
        life: 3000
      });

    } catch (err) {
      console.error('Error uploading image:', err);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Error al actualizar la imagen',
        life: 3000
      });
    }
  };

  const renderGroups = (groups) => {
    return groups.map((group, index) => (
      <Tag 
        key={group.id} 
        value={group.name}
        severity="info" 
        className="mr-2 mb-2 bg-red-500/20 text-red-400 border-red-500/30"
      />
    ));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="  py-8 px-4">
      <Toast ref={toast} />
      <div className="">
        <div className="text-center mb-8">
          
          <p className="text-gray-400" style={{width:'93%'}}>
            {isEditing ? 'Actualiza tu información personal' : 'Gestiona tu información personal'}
          </p>
        </div>


        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <FaUser className="text-red-500 mr-2" />
                Información Personal
              </h3>
              <Button
                type="button"
                icon={isEditing ? "pi pi-times" : "pi pi-pencil"}
                className={`p-button-rounded p-button-text ${isEditing ? 'p-button-danger' : 'p-button-secondary'}`}
                onClick={toggleEdit}
              />
            </div>

            <div className="space-y-4">
              {/* Imagen de Perfil */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img
                    src={selectedImage || getImageUrl(user.imagen)}
                    alt="Foto de perfil"
                    className="w-32 h-32 rounded-full border-4 border-red-600 mb-4 shadow-lg group-hover:opacity-75 transition-all duration-300 object-cover cursor-pointer"
                    onClick={handleImageClick}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "uservacio.png";
                    }}
                  />
                  {isEditing && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <div className="bg-black bg-opacity-50 rounded-full w-full h-full flex items-center justify-center">
                        <FaEdit className="text-white text-2xl" />
                      </div>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      label="Cambiar foto"
                      icon="pi pi-camera"
                      className="p-button-rounded p-button-text p-button-secondary mt-2"
                      onClick={handleImageClick}
                    />
                  </>
                )}
              </div>

              {/* Campos de Usuario */}
              {isEditing ? (
                <div className="space-y-4">
                  <div className="p-float-label">
                    <InputText
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-gray-700/50 border-gray-600 text-white"
                    />
                    <label htmlFor="username" className="text-gray-400">Nombre de Usuario</label>
                  </div>

                  <div className="grid grid-cols-2 gap-4" style={{marginTop: '30px'}}>
                    <div className="p-float-label">
                      <InputText
                        id="first_name"

                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="w-full bg-gray-700/50 border-gray-600 text-white"
                      />
                      <label htmlFor="first_name" className="text-gray-400">Nombre</label>
                    </div>

                    <div className="p-float-label">
                      <InputText
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="w-full bg-gray-700/50 border-gray-600 text-white"
                      />
                      <label htmlFor="last_name" className="text-gray-400">Apellido</label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <FaUser className="text-red-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">ID de Usuario</p>
                      <p className="font-medium text-white">{user.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <FaIdCard className="text-red-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Nombre de Usuario</p>
                      <p className="font-medium text-white">{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                    <FaUser className="text-red-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Nombre Completo</p>
                      <p className="font-medium text-white">
                        {user.first_name || user.last_name ? 
                          `${user.first_name} ${user.last_name}` : 
                          'No especificado'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Estado y Permisos */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaCog className="text-red-500 mr-2" />
              Estado y Permisos
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Estado de la Cuenta</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      value={user.is_active ? "Activo" : "Inactivo"} 
                      severity={user.is_active ? "success" : "danger"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Nivel de Acceso</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      value={user.is_staff ? "Staff" : "Usuario"} 
                      severity={user.is_staff ? "warning" : "info"}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-700/30 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Grupos</p>
                <div className="flex flex-wrap">
                  {user.groups && user.groups.length > 0 ? (
                    renderGroups(user.groups)
                  ) : (
                    <p className="text-gray-500 italic">Sin grupos asignados</p>
                  )}
                </div>
              </div>
              <Button
                type="button"
                label="Cambiar contraseña"
                className="p-button-rounded p-button-secondary mt-2"
                onClick={() => navigate('/change-password')}
              />
            </div>
          </Card>

          {/* Información de Contacto */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <FaEnvelope className="text-red-500 mr-2" />
              Información de Contacto
            </h3>

            <div className="space-y-4" style={{marginTop: '30px'}}>
              {isEditing ? (
                <div className="p-float-label">
                  <InputText
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-700/50 border-gray-600 text-white"
                  />
                  <label htmlFor="email" className="text-gray-400">Correo Electrónico</label>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                  <FaEnvelope className="text-red-500 text-xl flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Correo Electrónico</p>
                    <p className="font-medium text-white">{user.email}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Botones de Acción */}
          {isEditing && (
            <div className="md:col-span-2">
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-red-600/10 transition-all duration-300">
                <div className="flex justify-between   ">
                  <Button
                    type="submit"
                    label="Guardar Cambios" 
                    className="p-button-success"
                    icon="pi pi-check"
                  />
                  <Button
                    type="button"
                    label="Cancelar"
                    className="p-button-danger"
                    onClick={toggleEdit}
                  />
                </div>
              </Card>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
