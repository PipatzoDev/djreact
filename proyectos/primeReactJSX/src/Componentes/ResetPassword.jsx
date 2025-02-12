import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import "../css/form.css";
import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

// Componente para solicitar el reset
const RequestResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {loading, setLoading} = useState(false);
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/usuarios/api/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Se ha enviado un correo con las instrucciones');
        setError('');
      } else {
        setError(data.error || 'Ocurrió un error');
        setMessage('');
      }
    } catch (err) {
      setError('Error de conexión');
      setMessage('');
    }
        
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-black border-1 border-red-500 shadow-lg rounded-lg ">
     
      <h2 className="text-2xl font-bold mb-6">Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block  mb-2">
            Correo Electrónico:
          </label>
          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded hover-pipa"
            required
          />
        </div>
        <div className='flex justify-between gap-3'>
          {loading?<button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          disabled
        >
          <ProgressSpinner
                          style={{ width: "20px", height: "20px" }}
                          strokeWidth="8"
                          fill="var(--surface-ground)"
                          animationDuration=".5s"
                        />
        </button>: <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Enviar Correo
        </button>}
        
        <button type='button' className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600" onClick={() => navigate('/login')}>Volver</button>
        </div>
      </form>
      
      {message && (
        <div className="mt-4">
          <Tag style={{width: '100%'}} value={message} severity="success" />
        </div>
      )}
      
      {error && (
        <div  className="mt-4">
          <Tag style={{width: '100%'}} value={error} severity="error" />
        </div>
      )}
    </div>
  );
};

// Componente para confirmar el reset
const ConfirmResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/usuarios/api/password-reset-confirm/${uid}/${token}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ new_password: password }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        setMessage('Contraseña actualizada correctamente');
        setError('');
        // Redirigir al login después de 2 segundos
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Ocurrió un error');
        setMessage('');
      }
    } catch (err) {
      setError('Error de conexión');
      setMessage('');
    } 
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-black border-1 border-red-500 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Nueva Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block  mb-2">
            Nueva Contraseña:
          </label>
          <InputText
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded hover-pipa"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block  mb-2">
            Confirmar Contraseña:
          </label>
          <InputText
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded hover-pipa"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Actualizar Contraseña
        </button>
      </form>
      
      {message && (
        <div className="mt-4">
          <Tag style={{width: '100%'}} value={message} severity="success" />
        </div>
      )}
      
      {error && (
        <div  className="mt-4">
          <Tag style={{width: '100%'}} value={error} severity="error" />
        </div>
      )}
    </div>
  );
};

export { RequestResetPassword, ConfirmResetPassword };