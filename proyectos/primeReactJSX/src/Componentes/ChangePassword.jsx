import { InputText } from 'primereact/inputtext';
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const handleSubmit = async (e) => {
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

            const response = await fetch('http://127.0.0.1:8000/usuarios/api/profile/change-password/', {
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
            setError(err.message || 'Error al cambiar la contraseña');
        }
    };
    return (
        <div className="min-h-screen  py-12 px-4">
            <div className="max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl letraop font-bold text-gray-900 mb-6">Cambiar Contraseña</h2>

                {error && (
                    <div className="mb-4 bg-black border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-gray-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium ">
                            Contraseña Actual
                        </label>
                        <InputText
                            type="password"
                            value={formData.old_password}
                            onChange={(e) => setFormData({...formData, old_password: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium ">
                            Nueva Contraseña
                        </label>
                        <InputText
                            type="password"
                            value={formData.new_password}
                            onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium ">
                            Confirmar Nueva Contraseña
                        </label>
                        <InputText
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
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
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