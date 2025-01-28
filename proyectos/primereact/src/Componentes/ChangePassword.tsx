import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordData } from '../types/auth';

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [formData, setFormData] = useState<ChangePasswordData>({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.new_password !== formData.confirm_password) {
            setError('Las contraseñas nuevas no coinciden');
            return;
        }

        try {
            const tokens = localStorage.getItem('tokens');
            if (!tokens) throw new Error('No authentication tokens found');

            const response = await fetch('http://localhost:8000/usuarios/api/profile/change-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(tokens).access}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cambiar la contraseña');
            }

            setSuccess('Contraseña actualizada exitosamente');
            setTimeout(() => navigate('/profile'), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
        }
    };

    return (
        <div className="min-h-screen  py-12 px-4">
            <div className="max-w-md mx-auto  rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña Actual
                        </label>
                        <input
                            type="password"
                            value={formData.old_password}
                            onChange={(e) => setFormData({...formData, old_password: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            value={formData.new_password}
                            onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            value={formData.confirm_password}
                            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            Cambiar Contraseña
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;