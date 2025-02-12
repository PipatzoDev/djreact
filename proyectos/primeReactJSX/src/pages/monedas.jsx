import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCoins, FaDollarSign, FaEuroSign, FaPoundSign, FaYenSign, FaSearch } from 'react-icons/fa';
import ReactCountryFlag from 'react-country-flag';
import { InputText } from 'primereact/inputtext';
import Conversor from './conversor';

function Monedas() {
  const [monedas, setMonedas] = useState([]);
  const [monedasFiltradas, setMonedasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const API_KEY = '94033c28b4c80706759f3fd638714198';

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        
        // Obtener tasas de Exchange Rates API
        const response = await axios.get(
          `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`
        );
        
        console.log('Exchange Rates Response:', response.data);
        
        if (!response.data.success) {
          throw new Error(`Exchange API Error: ${response.data.error.type}`);
        }

        // Obtener la tasa USD/EUR para hacer la conversión
        const usdEurRate = response.data.rates['USD'];
        console.log('USD/EUR Rate:', usdEurRate);

        // Transformar los datos de la API para usar USD como base
        const monedasData = Object.entries(response.data.rates).map(([codigo, tasa]) => {
          // Convertir la tasa a base USD
          const tasaUSD = tasa / usdEurRate;
          
          return {
            Codigo: codigo,
            Nombre: getMonedaNombre(codigo),
            Tasa: tasaUSD,
            LastUpdate: new Date(response.data.timestamp * 1000).toLocaleString()
          };
        });

        console.log('Monedas Data:', monedasData);
        setMonedas(monedasData);
        setMonedasFiltradas(monedasData);
      } catch (err) {
        console.error('Error detallado:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Función para obtener el nombre de la moneda según su código
  const getMonedaNombre = (codigo) => {
    const nombreMonedas = {
      'AED': 'Dírham de EAU',
      'AFN': 'Afgani Afgano',
      'ALL': 'Lek Albanés',
      'AMD': 'Dram Armenio',
      'ANG': 'Florín Antillano',
      'AOA': 'Kwanza Angoleño',
      'ARS': 'Peso Argentino',
      'AUD': 'Dólar Australiano',
      'AWG': 'Florín Arubeño',
      'AZN': 'Manat Azerbaiyano',
      'BAM': 'Marco Bosnio',
      'BBD': 'Dólar de Barbados',
      'BDT': 'Taka Bangladesí',
      'BGN': 'Lev Búlgaro',
      'BHD': 'Dinar Bareiní',
      'BIF': 'Franco Burundés',
      'BMD': 'Dólar Bermudeño',
      'BND': 'Dólar de Brunéi',
      'BOB': 'Boliviano',
      'BRL': 'Real Brasileño',
      'BSD': 'Dólar Bahameño',
      'BTC': 'Bitcoin',
      'BTN': 'Ngultrum Butanés',
      'BWP': 'Pula de Botsuana',
      'BYN': 'Rublo Bielorruso',
      'BZD': 'Dólar Beliceño',
      'CAD': 'Dólar Canadiense',
      'CDF': 'Franco Congoleño',
      'CHF': 'Franco Suizo',
      'CLF': 'Unidad de Fomento Chilena',
      'CLP': 'Peso Chileno',
      'CNY': 'Yuan Chino',
      'CNH': 'Yuan Chino (Offshore)',
      'COP': 'Peso Colombiano',
      'CRC': 'Colón Costarricense',
      'CUC': 'Peso Cubano Convertible',
      'CUP': 'Peso Cubano',
      'CVE': 'Escudo Caboverdiano',
      'CZK': 'Corona Checa',
      'DJF': 'Franco Yibutiano',
      'DKK': 'Corona Danesa',
      'DOP': 'Peso Dominicano',
      'DZD': 'Dinar Argelino',
      'EGP': 'Libra Egipcia',
      'ERN': 'Nakfa Eritreo',
      'ETB': 'Birr Etíope',
      'EUR': 'Euro',
      'FJD': 'Dólar Fiyiano',
      'FKP': 'Libra Malvinense',
      'GBP': 'Libra Esterlina',
      'GEL': 'Lari Georgiano',
      'GGP': 'Libra de Guernsey',
      'GHS': 'Cedi Ghanés',
      'GIP': 'Libra Gibraltareña',
      'GMD': 'Dalasi Gambiano',
      'GNF': 'Franco Guineano',
      'GTQ': 'Quetzal Guatemalteco',
      'GYD': 'Dólar Guyanés',
      'HKD': 'Dólar de Hong Kong',
      'HNL': 'Lempira Hondureño',
      'HRK': 'Kuna Croata',
      'HTG': 'Gourde Haitiano',
      'HUF': 'Forinto Húngaro',
      'IDR': 'Rupia Indonesia',
      'ILS': 'Nuevo Séquel Israelí',
      'IMP': 'Libra Manesa',
      'INR': 'Rupia India',
      'IQD': 'Dinar Iraquí',
      'IRR': 'Rial Iraní',
      'ISK': 'Corona Islandesa',
      'JEP': 'Libra de Jersey',
      'JMD': 'Dólar Jamaiquino',
      'JOD': 'Dinar Jordano',
      'JPY': 'Yen Japonés',
      'KES': 'Chelín Keniano',
      'KGS': 'Som Kirguís',
      'KHR': 'Riel Camboyano',
      'KMF': 'Franco Comorense',
      'KPW': 'Won Norcoreano',
      'KRW': 'Won Surcoreano',
      'KWD': 'Dinar Kuwaití',
      'KYD': 'Dólar de las Islas Caimán',
      'KZT': 'Tenge Kazajo',
      'LAK': 'Kip Laosiano',
      'LBP': 'Libra Libanesa',
      'LKR': 'Rupia de Sri Lanka',
      'LRD': 'Dólar Liberiano',
      'LSL': 'Loti Lesotense',
      'LYD': 'Dinar Libio',
      'MAD': 'Dírham Marroquí',
      'MDL': 'Leu Moldavo',
      'MGA': 'Ariary Malgache',
      'MKD': 'Denar Macedonio',
      'MMK': 'Kyat Myanmar',
      'MNT': 'Tugrik Mongol',
      'MOP': 'Pataca de Macao',
      'MRU': 'Uguiya Mauritano',
      'MUR': 'Rupia Mauriciana',
      'MVR': 'Rufiyaa Maldiva',
      'MWK': 'Kwacha Malauí',
      'MXN': 'Peso Mexicano',
      'MYR': 'Ringgit Malayo',
      'MZN': 'Metical Mozambiqueño',
      'NAD': 'Dólar Namibio',
      'NGN': 'Naira Nigeriano',
      'NIO': 'Córdoba Nicaragüense',
      'NOK': 'Corona Noruega',
      'NPR': 'Rupia Nepalí',
      'NZD': 'Dólar Neozelandés',
      'OMR': 'Rial Omaní',
      'PAB': 'Balboa Panameño',
      'PEN': 'Sol Peruano',
      'PGK': 'Kina de Papúa Nueva Guinea',
      'PHP': 'Peso Filipino',
      'PKR': 'Rupia Pakistaní',
      'PLN': 'Złoty Polaco',
      'PYG': 'Guaraní Paraguayo',
      'QAR': 'Riyal Qatarí',
      'RON': 'Leu Rumano',
      'RSD': 'Dinar Serbio',
      'RUB': 'Rublo Ruso',
      'RWF': 'Franco Ruandés',
      'SAR': 'Riyal Saudí',
      'SBD': 'Dólar de las Islas Salomón',
      'SCR': 'Rupia Seychellense',
      'SDG': 'Libra Sudanesa',
      'SEK': 'Corona Sueca',
      'SGD': 'Dólar de Singapur',
      'SHP': 'Libra de Santa Elena',
      'SLE': 'Leone Sierra Leona',
      'SLL': 'Leone Sierra Leona (antiguo)',
      'SOS': 'Chelín Somalí',
      'SRD': 'Dólar Surinamés',
      'STD': 'Dobra Santotomense',
      'SVC': 'Colón Salvadoreño',
      'SYP': 'Libra Siria',
      'SZL': 'Lilangeni Suazi',
      'THB': 'Baht Tailandés',
      'TJS': 'Somoni Tayiko',
      'TMT': 'Manat Turcomano',
      'TND': 'Dinar Tunecino',
      'TOP': 'Paʻanga Tongano',
      'TRY': 'Lira Turca',
      'TTD': 'Dólar de Trinidad y Tobago',
      'TWD': 'Nuevo Dólar Taiwanés',
      'TZS': 'Chelín Tanzano',
      'UAH': 'Grivna Ucraniana',
      'UGX': 'Chelín Ugandés',
      'USD': 'Dólar Estadounidense',
      'UYU': 'Peso Uruguayo',
      'UZS': 'Som Uzbeko',
      'VES': 'Bolívar Soberano Venezolano',
      'VND': 'Dong Vietnamita',
      'VUV': 'Vatu Vanuatuense',
      'WST': 'Tala Samoano',
      'XAF': 'Franco CFA de África Central',
      'XAG': 'Onza de Plata',
      'XAU': 'Onza de Oro',
      'XCD': 'Dólar del Caribe Oriental',
      'XDR': 'Derechos Especiales de Giro',
      'XOF': 'Franco CFA de África Occidental',
      'XPF': 'Franco CFP',
      'YER': 'Rial Yemení',
      'ZAR': 'Rand Sudafricano',
      'ZMW': 'Kwacha Zambiano',
      'ZWL': 'Dólar Zimbabuense'
    };
    return nombreMonedas[codigo] || codigo;
  };

  useEffect(() => {
    const filtered = monedas.filter(moneda => 
      moneda.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moneda.Codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMonedasFiltradas(filtered);
  }, [searchTerm, monedas]);

  // Función para obtener el código de país según la moneda
  const getCountryCode = (codigo) => {
    const countryMap = {
      'AED': 'AE', // Emiratos Árabes Unidos
      'AFN': 'AF', // Afganistán
      'ALL': 'AL', // Albania
      'AMD': 'AM', // Armenia
      'ANG': 'CW', // Curazao (anteriormente Antillas Neerlandesas)
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
      'BTC': 'BTC', // Bitcoin (sin bandera)
      'BTN': 'BT', // Bután
      'BWP': 'BW', // Botsuana
      'BYN': 'BY', // Bielorrusia
      'BYR': 'BY', // Bielorrusia (antigua moneda)
      'BZD': 'BZ', // Belice
      'CAD': 'CA', // Canadá
      'CDF': 'CD', // República Democrática del Congo
      'CHF': 'CH', // Suiza
      'CLF': 'CL', // Chile
      'CLP': 'CL', // Chile
      'CNY': 'CN', // China
      'CNH': 'CN', // China (offshore)
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
      'FKP': 'FK', // Islas Malvinas
      'GBP': 'GB', // Reino Unido
      'GEL': 'GE', // Georgia
      'GGP': 'GG', // Guernsey
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
      'IMP': 'IM', // Isla de Man
      'INR': 'IN', // India
      'IQD': 'IQ', // Irak
      'IRR': 'IR', // Irán
      'ISK': 'IS', // Islandia
      'JEP': 'JE', // Jersey
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
      'LTL': 'LT', // Lituania (histórico)
      'LVL': 'LV', // Letonia (histórico)
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
      'SLE': 'SL', // Sierra Leona
      'SLL': 'SL', // Sierra Leona (antiguo)
      'SOS': 'SO', // Somalia
      'SRD': 'SR', // Surinam
      'STD': 'ST', // Santo Tomé y Príncipe
      'SVC': 'SV', // El Salvador
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
      'XAF': 'CM', // Camerún (Franco CFA)
      'XAG': 'XAG', // Plata (sin bandera)
      'XAU': 'XAU', // Oro (sin bandera)
      'XCD': 'AG', // Antigua y Barbuda (Caribe Oriental)
      'XDR': 'IMF', // FMI (sin bandera)
      'XOF': 'BJ', // Benin (Franco CFA)
      'XPF': 'PF', // Polinesia Francesa
      'YER': 'YE', // Yemen
      'ZAR': 'ZA', // Sudáfrica
      'ZMK': 'ZM', // Zambia (antiguo)
      'ZMW': 'ZM', // Zambia
      'ZWL': 'ZW'  // Zimbabue
    };
    return countryMap[codigo] || null;
  };

  // Función para seleccionar el icono según el código de la moneda
  const getMonedaIcon = (codigo) => {
    const countryCode = getCountryCode(codigo);
    if (countryCode) {
      return (
        <div className="flex items-center space-x-2">
          <ReactCountryFlag 
            countryCode={countryCode}
            svg
            style={{
              width: '2em',
              height: '2em',
            }}
            title={countryCode}
          />
          {codigo === 'USD' && <FaDollarSign className="text-red-600" />}
          {codigo === 'EUR' && <FaEuroSign className="text-red-500" />}
          {codigo === 'GBP' && <FaPoundSign className="text-red-400" />}
          {codigo === 'JPY' && <FaYenSign className="text-red-700" />}
        </div>
      );
    }
    return <FaCoins className="text-red-600" />;
  };

  return (
    <div className="  min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <FaCoins className="text-red-500 mr-3" />
            Divisas Internacionales
          </h1>
          <p className="text-gray-400 text-lg">
            Valores actuales de cambio respecto al Dólar Americano
          </p>
        </div>

        {/* Conversor Component */}
        <div className="mb-12  ">
          <Conversor />
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o código de moneda..."
              className="w-full pl-12 p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring focus:ring-red-500/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Currency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {monedasFiltradas.map((moneda) => (
            <div 
              key={moneda.Codigo}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-red-600/10 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-red-500/30 transform hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">{moneda.Nombre}</h2>
                  <div className="text-2xl">
                    {getMonedaIcon(moneda.Codigo)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Código</span>
                    <span className="px-3 py-1 bg-gray-700/50 rounded-lg text-red-400 font-medium">
                      {moneda.Codigo}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">1 USD =</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                      {moneda.Tasa.toFixed(4)} {moneda.Codigo}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">1 {moneda.Codigo} =</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                      {(1 / moneda.Tasa).toFixed(4)} USD
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700/50">
                <div className="text-sm text-gray-400 flex items-center justify-between">
                  <span>Última actualización:</span>
                  <span className="font-medium">{moneda.LastUpdate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Monedas;
