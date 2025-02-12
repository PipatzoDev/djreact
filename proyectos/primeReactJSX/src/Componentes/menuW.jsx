import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/menuw.css";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { FaClipboard, FaCoins } from "react-icons/fa";
import { SpeedDial } from "primereact/speeddial";
import { Ripple } from "primereact/ripple";
import { motion } from "framer-motion";

// Agregar los keyframes como una regla de estilo en el head
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .menu-item {
    transition: all 0.3s ease;
  }

  .menu-item:hover i {
    transform: scale(1.1);
  }
`;
document.head.appendChild(styleSheet);

function MenuW() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "uservacio.png";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    if (imagePath.startsWith("/media/")) {
      return `http://127.0.0.1:8000/usuarios${imagePath}`;
    }

    if (imagePath.startsWith("media/")) {
      return `http://127.0.0.1:8000/usuarios/${imagePath}`;
    }

    return `http://127.0.0.1:8000/usuarios/media/${imagePath}`;
  };

  const miperfil = () => {
    w3_close();
    navigate("/profile");
  };

  const navtitulo = () => {
    if (location.pathname === "/") {
      return (
        <div className="flex items-center  mx-auto">
            <i className="pi pi-home mr-3" style={{ fontSize: "30px" }}></i>
            <h5 className="letraop">Inicio</h5>
        </div>
      );
    } else if (location.pathname === "/misposts") {
      return (
        <div className="flex items-center">
            <i className="pi pi-inbox mr-3" style={{ fontSize: "30px" }}></i>
            <h5 className="letraop">Mis Posts</h5>
        </div>
      );
    } else if (location.pathname === "/profile") {
      return (
        <>
          <div className="flex items-center">
            <i className="pi pi-user mr-3" style={{ fontSize: "30px" }}></i>
            <h5 className="letraop">Perfil</h5>
          </div>
        </>
      );
    }
  };
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  const w3_open = () => {
    setIsSidebarOpen(true);
  };

  const w3_close = () => {
    setIsSidebarOpen(false);
  };

  const closeSidebarOnOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      setIsSidebarOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsSidebarOpen((prevState) => !prevState);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          id="overlay"
          onClick={closeSidebarOnOverlayClick}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-10"
        />
      )}

      {/* Sidebar con padding reducido */}
      <div
        className={`w3-sidebar w3-animate-left ${
          isSidebarOpen ? "w3-show" : ""
        } bg-gradient-to-b from-black via-gray-900 to-black`}
        style={{
          display: isSidebarOpen ? "block" : "none",
          flexDirection: "column",
          height: "100vh",
          top: 0,
          left: 0,
          width: isSidebarOpen ? "280px" : "0",
          zIndex: 20,
          borderRight: "1px solid rgba(220, 38, 38, 0.2)",
        }}
        id="mySidebar"
      >
        {/* Header del Sidebar con padding reducido */}
        <div className="flex items-center justify-between p-2 border-b border-red-900/30">
          <h3 className="text-lg font-semibold text-white flex items-center letraop">
            <i className="pi pi-th-large text-red-600 mr-2 text-xl"></i>
            Menu
          </h3>
          <Button
            onClick={w3_close}
            icon="pi pi-times"
            className="p-button-rounded p-button-text "
            aria-label="Cerrar"
            style={{ color: "red" }}
          />
        </div>

        {/* Navegación con padding reducido */}
        <nav className="flex flex-col flex-grow p-2 space-y-1">
          <Link
            className={`flex items-center p-2 rounded-lg pipamenu transition-all duration-300 ${
              location.pathname === "/"
                ? "bg-gradient-to-r from-red-900 to-red-800 text-white"
                : "text-gray-400 hover:bg-red-900/20 hover:text-red-500"
            }`}
            to="/"
            onClick={w3_close}
          >
            <i className="pi pi-home mr-2"></i>
            Inicio
          </Link>

          <Link
            className={`flex items-center p-2 rounded-lg pipamenu transition-all duration-300 ${
              location.pathname === "/misposts"
                ? "bg-gradient-to-r from-red-900 to-red-800 text-white"
                : "text-gray-400 hover:bg-red-900/20 hover:text-red-500"
            }`}
            to="/misposts"
            onClick={w3_close}
          >
            <i className="pi pi-inbox mr-2"></i>
            Mis Posts
          </Link>
          <Link
            className={`flex items-center p-2 rounded-lg pipamenu transition-all duration-300 ${
              location.pathname === "/profile"
                ? "bg-gradient-to-r from-red-900 to-red-800 text-white"
                : "text-gray-400 hover:bg-red-900/20 hover:text-red-500"
            }`}
            to="/profile"
            onClick={w3_close}
          >
            <i className="pi pi-user mr-2"></i>
            Perfil
          </Link>
        </nav>
      </div>

      {/* Header principal con padding reducido */}
      <div className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b border-red-900/30 z-10">
        <div className="flex items-center justify-between px-2 py-1">
          <button
            className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
            onClick={w3_open}
          >
            ☰
          </button>

         {navtitulo()}

          {/* Perfil de usuario con menú desplegable y animaciones */}
          <div
            className="relative menu-container flex items-center space-x-2"
            style={{ marginRight: "10px" }}
          >
            {/* Imagen con Ripple effect */}
            <div className="p-ripple relative">
              <img
                className="w-12 h-12 rounded-full border-2 border-red-600 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-600/20"
                src={getImageUrl(user?.imagen)}
                alt="Foto de usuario"
                onClick={miperfil}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "uservacio.png";
                }}
              />
              <Ripple />
            </div>

            {/* Botón con Ripple effect */}
            <button
              className="p-ripple flex items-center space-x-1 text-gray-300 hover:text-red-500 transition-colors duration-300"
              onClick={toggleMenu}
            >
              <span>{user?.username}</span>
              <i
                className={`pi ${
                  isMenuOpen ? "pi-angle-up" : "pi-angle-down"
                } transition-transform duration-300`}
              ></i>
              <Ripple />
            </button>

            {/* Menú desplegable con animaciones */}
            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 py-1 bg-black rounded-lg shadow-xl border border-red-900/30 top-full animate__animated animate__fadeIn animate__faster"
                style={{
                  animation: "fadeIn 0.2s ease-in-out",
                  transformOrigin: "top right",
                }}
              >
                {/* Mi Perfil */}
                <div className="p-ripple">
                  <a
                    onClick={() => {
                      miperfil();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-gray-400 hover:bg-red-900/30 hover:text-red-500 cursor-pointer transition-all duration-300"
                  >
                    <i className="pi pi-user mr-2 transition-transform duration-300 group-hover:scale-110"></i>
                    Mi Perfil
                    <Ripple />
                  </a>
                </div>

                {/* Cerrar Sesión */}
                <div className="p-ripple">
                  <a
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-gray-400 hover:bg-red-900/30 hover:text-red-500 cursor-pointer transition-all duration-300"
                  >
                    <i className="pi pi-sign-out mr-2 transition-transform duration-300 group-hover:scale-110"></i>
                    Cerrar Sesión
                    <Ripple />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra lateral fija con padding reducido */}
      <div
        className="justify-center text-center fixed left-0 top-0 h-full w-18 bg-gradient-to-b from-black via-gray-900 to-black border-r border-red-900/30 phone-only"
        style={{ paddingTop: "100px" }}
      >
        <nav className="items-center py-2 p-2   h-full space-y-4">
          <motion.button
            className=""
            whileTap={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              to="/"
              style={{ marginBottom: "10px" }}
              className={`flex justify-center items-center p-2 rounded-lg ${
                location.pathname === "/"
                  ? "border-2 border-red-900 "
                  : "border-2 border-gray-900 "
              }`}
            >
              <i className="pi pi-home " style={{ fontSize: "20px" }}></i>
            </Link>
          </motion.button>
          <motion.button
            className=""
            whileTap={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              to="/misposts"
              style={{ marginBottom: "10px" }}
              className={`flex justify-center items-center p-2 rounded-lg ${
                location.pathname === "/misposts"
                  ? "border-2 border-red-900 "
                  : "border-2 border-gray-900 "
              }`}
            >
              <i className="pi pi-inbox " style={{ fontSize: "20px" }}></i>
            </Link>
          </motion.button>
          <motion.button
            className=""
            whileTap={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <Link
              to="/profile"
              style={{ marginBottom: "10px" }}
              className={`flex justify-center items-center p-2 rounded-lg ${
                location.pathname === "/profile"
                  ? "border-2 border-red-900 "
                  : "border-2 border-gray-900 "
              }`}
            >
              <i className="pi pi-user " style={{ fontSize: "20px" }}></i>
            </Link>
          </motion.button>
        </nav>
      </div>
    </>
  );
}

export default MenuW;