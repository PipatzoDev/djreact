import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Card } from "primereact/card";

function monedas() {
  // Estado para almacenar los datos
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usamos useEffect para obtener los datos al montar el componente
  useEffect(() => {
    axios.get('https://api.gael.cloud/general/public/monedas')
      .then(response => {
        setMonedas(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className=''>
      <h1>Monedas del Mundo</h1>
      
      {/* Mostrar cargando o error */}
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Mostrar tarjetas de monedas */}
      <Card>
        {monedas.map((moneda) => (
          <div key={moneda.Codigo} >
            <h2>{moneda.Nombre}</h2>
            <p><strong>Código:</strong> {moneda.Codigo}</p>
            <p><strong>Valor:</strong> {moneda.Valor}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default monedas;
