import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaCoins } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

function Conversor() {
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [monedaOrigen, setMonedaOrigen] = useState(null);
  const [monedaDestino, setMonedaDestino] = useState(null);
  const [resultado, setResultado] = useState(null);
  const API_KEY = '94033c28b4c80706759f3fd638714198';

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`
        );

        if (!response.data.success) {
          throw new Error(`Exchange API Error: ${response.data.error.type}`);
        }

        // Obtener la tasa USD/EUR para hacer la conversión
        const usdEurRate = response.data.rates['USD'];

        // Transformar los datos de la API
        const monedasData = Object.entries(response.data.rates).map(([codigo, tasa]) => ({
          Codigo: codigo,
          Nombre: getMonedaNombre(codigo),
          Tasa: tasa / usdEurRate, // Convertir a base USD
          Fecha: new Date(response.data.timestamp * 1000).toISOString()
        }));

        setMonedas(monedasData);
        // Establecer USD como moneda de origen por defecto
        setMonedaOrigen(monedasData.find(m => m.Codigo === 'USD'));
        // Establecer EUR como moneda de destino por defecto
        setMonedaDestino(monedasData.find(m => m.Codigo === 'EUR'));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const getMonedaNombre = (codigo) => {
    const nombreMonedas = {
      'USD': 'Dólar Americano',
      'EUR': 'Euro',
      'GBP': 'Libra Esterlina',
      'JPY': 'Yen Japonés',
      'AUD': 'Dólar Australiano',
      'CAD': 'Dólar Canadiense',
      'CHF': 'Franco Suizo',
      'CNY': 'Yuan Chino',
      'NZD': 'Dólar Neozelandés',
      'BRL': 'Real Brasileño',
      'CLP': 'Peso Chileno',
      'MXN': 'Peso Mexicano',
      'ARS': 'Peso Argentino',
      'PEN': 'Sol Peruano',
      'COP': 'Peso Colombiano',
      // Puedes añadir más monedas aquí
    };
    return nombreMonedas[codigo] || codigo;
  };

  const getCountryCode = (codigo) => {
    const countryMap = {
      'AED': 'AE', // Emiratos Árabes Unidos
      'AFN': 'AF', // Afganistán
      'ALL': 'AL', // Albania
      'AMD': 'AM', // Armenia
      'ANG': 'AN', // Antillas Neerlandesas
      'AOA': 'AO', // Angola
      'ARS': 'AR', // Argentina
      'AUD': 'AU', // Australia
      'AWG': 'AW', // Aruba
      'AZN': 'AZ', // Azerbaiyán
      'BAM': 'BA', // Bosnia y Herzegovina
      'BBD': 'BB', // Barbados
      'BDT': 'BD', // Bangladesh
      'BGN': 'BG', // Bulgaria
      'BHD': 'BH', // Bahrein
      'BIF': 'BI', // Burundi
      'BMD': 'BM', // Bermudas
      'BND': 'BN', // Brunei
      'BOB': 'BO', // Bolivia
      'BRL': 'BR', // Brasil
      'BSD': 'BS', // Bahamas
      'BTN': 'BT', // Bután
      'BWP': 'BW', // Botsuana
      'BYN': 'BY', // Bielorrusia
      'BZD': 'BZ', // Belice
      'CAD': 'CA', // Canadá
      'CDF': 'CD', // Congo
      'CHF': 'CH', // Suiza
      'CLP': 'CL', // Chile
      'CNY': 'CN', // China
      'COP': 'CO', // Colombia
      'CRC': 'CR', // Costa Rica
      'CUC': 'CU', // Cuba
      'CUP': 'CU', // Cuba
      'CVE': 'CV', // Cabo Verde
      'CZK': 'CZ', // República Checa
      'DJF': 'DJ', // Yibuti
      'DKK': 'DK', // Dinamarca
      'DOP': 'DO', // República Dominicana
      'DZD': 'DZ', // Argelia
      'EGP': 'EG', // Egipto
      'ERN': 'ER', // Eritrea
      'ETB': 'ET', // Etiopía
      'EUR': 'EU', // Unión Europea
      'FJD': 'FJ', // Fiyi
      'GBP': 'GB', // Reino Unido
      'GEL': 'GE', // Georgia
      'GHS': 'GH', // Ghana
      'GIP': 'GI', // Gibraltar
      'GMD': 'GM', // Gambia
      'GNF': 'GN', // Guinea
      'GTQ': 'GT', // Guatemala
      'GYD': 'GY', // Guyana
      'HKD': 'HK', // Hong Kong
      'HNL': 'HN', // Honduras
      'HRK': 'HR', // Croacia
      'HTG': 'HT', // Haití
      'HUF': 'HU', // Hungría
      'IDR': 'ID', // Indonesia
      'ILS': 'IL', // Israel
      'INR': 'IN', // India
      'IQD': 'IQ', // Irak
      'IRR': 'IR', // Irán
      'ISK': 'IS', // Islandia
      'JMD': 'JM', // Jamaica
      'JOD': 'JO', // Jordania
      'JPY': 'JP', // Japón
      'KES': 'KE', // Kenia
      'KGS': 'KG', // Kirguistán
      'KHR': 'KH', // Camboya
      'KMF': 'KM', // Comoras
      'KPW': 'KP', // Corea del Norte
      'KRW': 'KR', // Corea del Sur
      'KWD': 'KW', // Kuwait
      'KYD': 'KY', // Islas Caimán
      'KZT': 'KZ', // Kazajistán
      'LAK': 'LA', // Laos
      'LBP': 'LB', // Líbano
      'LKR': 'LK', // Sri Lanka
      'LRD': 'LR', // Liberia
      'LSL': 'LS', // Lesoto
      'LYD': 'LY', // Libia
      'MAD': 'MA', // Marruecos
      'MDL': 'MD', // Moldavia
      'MGA': 'MG', // Madagascar
      'MKD': 'MK', // Macedonia del Norte
      'MMK': 'MM', // Myanmar
      'MNT': 'MN', // Mongolia
      'MOP': 'MO', // Macao
      'MRU': 'MR', // Mauritania
      'MUR': 'MU', // Mauricio
      'MVR': 'MV', // Maldivas
      'MWK': 'MW', // Malawi
      'MXN': 'MX', // México
      'MYR': 'MY', // Malasia
      'MZN': 'MZ', // Mozambique
      'NAD': 'NA', // Namibia
      'NGN': 'NG', // Nigeria
      'NIO': 'NI', // Nicaragua
      'NOK': 'NO', // Noruega
      'NPR': 'NP', // Nepal
      'NZD': 'NZ', // Nueva Zelanda
      'OMR': 'OM', // Omán
      'PAB': 'PA', // Panamá
      'PEN': 'PE', // Perú
      'PGK': 'PG', // Papúa Nueva Guinea
      'PHP': 'PH', // Filipinas
      'PKR': 'PK', // Pakistán
      'PLN': 'PL', // Polonia
      'PYG': 'PY', // Paraguay
      'QAR': 'QA', // Qatar
      'RON': 'RO', // Rumania
      'RSD': 'RS', // Serbia
      'RUB': 'RU', // Rusia
      'RWF': 'RW', // Ruanda
      'SAR': 'SA', // Arabia Saudita
      'SBD': 'SB', // Islas Salomón
      'SCR': 'SC', // Seychelles
      'SDG': 'SD', // Sudán
      'SEK': 'SE', // Suecia
      'SGD': 'SG', // Singapur
      'SHP': 'SH', // Santa Elena
      'SLL': 'SL', // Sierra Leona
      'SOS': 'SO', // Somalia
      'SRD': 'SR', // Surinam
      'SYP': 'SY', // Siria
      'SZL': 'SZ', // Esuatini
      'THB': 'TH', // Tailandia
      'TJS': 'TJ', // Tayikistán
      'TMT': 'TM', // Turkmenistán
      'TND': 'TN', // Túnez
      'TOP': 'TO', // Tonga
      'TRY': 'TR', // Turquía
      'TTD': 'TT', // Trinidad y Tobago
      'TWD': 'TW', // Taiwán
      'TZS': 'TZ', // Tanzania
      'UAH': 'UA', // Ucrania
      'UGX': 'UG', // Uganda
      'USD': 'US', // Estados Unidos
      'UYU': 'UY', // Uruguay
      'UZS': 'UZ', // Uzbekistán
      'VES': 'VE', // Venezuela
      'VND': 'VN', // Vietnam
      'VUV': 'VU', // Vanuatu
      'WST': 'WS', // Samoa
      'XAF': 'CF', // República Centroafricana (Franco CFA)
      'XOF': 'BJ', // Benín (Franco CFA)
      'YER': 'YE', // Yemen
      'ZAR': 'ZA', // Sudáfrica
      'ZMW': 'ZM', // Zambia
      'ZWL': 'ZW'  // Zimbabue
    };
    return countryMap[codigo] || null;
  };

  const convertirMoneda = () => {
    if (!monedaOrigen || !monedaDestino || !cantidad) return;

    // Convertir usando las tasas de cambio
    const valorFinal = (cantidad * monedaDestino.Tasa) / monedaOrigen.Tasa;

    setResultado({
      valor: valorFinal,
      monedaOrigen: monedaOrigen.Codigo,
      monedaDestino: monedaDestino.Codigo
    });
  };

  const intercambiarMonedas = () => {
    const temp = monedaOrigen;
    setMonedaOrigen(monedaDestino);
    setMonedaDestino(temp);
    setResultado(null);
  };

  const MonedaTemplate = (option) => {
    if (!option) return null;
    
    return (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={getCountryCode(option.Codigo) || 'Vacio'}
          svg
          style={{ width: '1.5em', height: '1.5em' }}
        />
        <span className="text-white">{option.Codigo}</span>
        <span className="text-gray-400">- {option.Nombre}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg">
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-white flex items-center justify-center">
          <FaExchangeAlt className="text-red-500 mr-3" />
          Conversor de Divisas
        </h2>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 backdrop-blur-sm border border-red-600/50 text-white p-6 rounded-xl">
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-[2fr,auto,2fr] gap-6 items-center">
              {/* Moneda de origen */}
              <div className="space-y-3">
                <label className="block text-gray-300 font-medium">Cantidad y Moneda de Origen</label>
                <InputNumber
                  value={cantidad}
                  onValueChange={(e) => setCantidad(e.value)}
                  min={0}
                  className="w-full"
                  inputClassName="w-full bg-gray-700/50 text-white border-gray-600 rounded-lg focus:border-red-500 focus:ring focus:ring-red-500/20"
                />
                <Dropdown
                  value={monedaOrigen}
                  onChange={(e) => setMonedaOrigen(e.value)}
                  options={monedas}
                  optionLabel="Codigo"
                  placeholder="Seleccione moneda"
                  className="w-full"
                  panelClassName="bg-gray-800 border border-gray-700"
                  itemTemplate={MonedaTemplate}
                  valueTemplate={MonedaTemplate}
                />
              </div>

              {/* Botón de intercambio */}
              <div className="flex justify-center">
                <Button
                  icon={<FaExchangeAlt />}
                  className="p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none rounded-full shadow-lg hover:shadow-red-600/25 transition-all duration-300"
                  onClick={intercambiarMonedas}
                />
              </div>

              {/* Moneda de destino */}
              <div className="space-y-3">
                <label className="block text-gray-300 font-medium">Moneda de Destino</label>
                <Dropdown
                  value={monedaDestino}
                  onChange={(e) => setMonedaDestino(e.value)}
                  options={monedas}
                  optionLabel="Codigo"
                  placeholder="Seleccione moneda"
                  className="w-full"
                  panelClassName="bg-gray-800 border border-gray-700"
                  itemTemplate={MonedaTemplate}
                  valueTemplate={MonedaTemplate}
                />
              </div>
            </div>

            {/* Botón de conversión */}
            <div className="flex justify-center">
              <Button
                label="Convertir"
                icon="pi pi-calculator"
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none rounded-xl shadow-lg hover:shadow-red-600/25 transition-all duration-300"
                onClick={convertirMoneda}
              />
            </div>

            {/* Resultado */}
            {resultado && (
              <div className="mt-6 p-6 bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/50">
                <h3 className="text-center text-2xl font-light">
                  <span className="text-gray-300">
                    {cantidad.toLocaleString('es-CL')} {resultado.monedaOrigen}
                  </span>
                  <span className="mx-2">=</span>
                  <span className="font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    {resultado.valor.toLocaleString('es-CL', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                  <span className="text-gray-300 ml-2">{resultado.monedaDestino}</span>
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversor; 