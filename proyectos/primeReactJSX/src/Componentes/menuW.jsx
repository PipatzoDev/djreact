import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/menuw.css";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";

function MenuW() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "uservacio.png";

    if (imagePath.includes("http://127.0.0.1:8000")) {
      const pathMatch = imagePath.match(/\/media\/(.*)/);
      if (pathMatch) {
        return `http://127.0.0.1:8000/usuarios/media/${pathMatch[1]}`;
      }
    }

    return imagePath;
  };

  const miperfil = () => {
    w3_close();
    navigate("/profile");
  };

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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w3-sidebar w3-bar-block w3-card w3-animate-left ${
          isSidebarOpen ? "w3-show" : ""
        }`}
        style={{
          display: isSidebarOpen ? "block" : "none",
          flexDirection: "column",
          height: "100vh",
          top: 0,
          left: 0,
          width: isSidebarOpen ? "45vh" : "0",
          background: "#3B3C36",
          zIndex: 2,
        }}
        id="mySidebar"
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            borderBottom: "3px solid red",
          }}
        >
          <h3 className="" style={{ marginLeft: "15px" }}>
            <i
              className="pi pi-th-large"
              style={{ marginRight: "8px", fontSize: "1.4rem" }}
            ></i>
            Menu
          </h3>
          <Button
            onClick={w3_close}
            label="X"
            style={{ marginLeft: "auto", marginBottom: "3px" }}
            severity="danger"
            text
          />
        </div>
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            height: "94vh",
            flexGrow: 1,
          }}
        >
          <Link
            className={`w3-bar-item btn btn-outline-secondary ${
              location.pathname === "/" ? "active" : ""
            }`}
            to="/"
            onClick={w3_close}
          >
            <i style={{ paddingRight: 7 }} className="pi pi-home"></i>
            Inicio
          </Link>
          <Link
            className={`w3-bar-item btn btn-outline-secondary ${
              location.pathname === "/misposts" ? "active" : ""
            }`}
            to="/misposts"
            onClick={w3_close}
          >
            <i style={{ paddingRight: 7 }} className="pi pi-inbox"></i>
            Mis Posts
          </Link>
          <Link
            className={`w3-bar-item btn btn-outline-secondary ${
              location.pathname === "/monedas" ? "active" : ""
            }`}
            to="/monedas"
            onClick={w3_close}
          >
            <i style={{ paddingRight: 7 }} className="pi pi-dollar"></i>
            Monedas
          </Link>
          <div className="user-info">
            <div className="user-photo">
              <img
                className='img-header p-1'
                src={getImageUrl(user?.imagen)}
                alt="Foto de usuario"
                onError={(e) => {
                  const target = e.target;
                  target.onerror = null; // Previene bucles infinitos
                  target.src = "uservacio.png";
                }}
              />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              <p className="user-role">Administrador</p>
            </div>
            <div style={{ width: "100%" }}>
              <div style={{ float: "right", display: "flex" }}>
                <Button
                  label="Mi Perfil"
                  icon="pi pi-user"
                  onClick={miperfil}
                  style={{
                    borderRadius: "10px",
                  }}
                  severity="danger"
                  text
                  raised
                />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Contenido principal */}

      <div style={{ background: "#3B3C36" }} className="encabezado">
        <button
          id="openNav"
          className="w3-button w3-red w3-xlarge"
          onClick={w3_open}
          style={{ display: isSidebarOpen ? "none" : "inline-block" }}
        >
          ☰
        </button>

        <div style={{ marginLeft: "auto", marginRight: "20px" }}>
          <div className="">
            <a style={{ marginRight: "5px" }} onClick={miperfil}>
            <img
                className='img-header p-1'
                src={getImageUrl(user?.imagen)}
                alt="Foto de usuario"
                onError={(e) => {
                  const target = e.target;
                  target.onerror = null; // Previene bucles infinitos
                  target.src = "uservacio.png";
                }}
              />
            </a>
            <label>{user?.username}</label>

            <div className="dropdown">
              <button className="dropbtn btn" style={{ marginLeft: "6px" }}>
                <i className="pi pi-angle-down"></i>
              </button>
              <div className="dropdown-content" id="menuheader">
                <a onClick={miperfil}>
                  <i className="pi pi-user"></i> Mi Perfil
                </a>
                <a>
                  <i className="pi pi-cog"></i> Configuración
                </a>
                <a onClick={logout}>
                  <i className="pi pi-sign-out"></i> Cerrar Session
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="phone-only"
        style={{ width: "53px", height: "100%", background: "#3B3C36" }}
      >
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            height: "94vh",
            flexGrow: 1,
            width: "50px",
            position: "fixed",
          }}
        >
          <Link
            className={`animated-button m-1 w3-bar-item btn btn-outline-secondary ${
              location.pathname === "/" ? "active" : ""
            }`}
            to="/"
          >
            <i className="pi pi-home"></i>
          </Link>
          <Link
            className={`animated-button m-1 w3-bar-item btn btn-outline-secondary ${
              location.pathname === "/misposts" ? "active" : ""
            }`}
            to="/misposts"
          >
            <i className="pi pi-inbox"></i>
          </Link>
          <Link
            className={` animated-button m-1 w3-bar-item btn btn-outline-secondary ${
              location.pathname === "/monedas" ? "active" : ""
            }`}
            to="/monedas"
            onClick={w3_close}
          >
            <i className="pi pi-dollar"></i>
          </Link>

          <div className="usercerrado">
            <Link
              className={`m-1 w3-bar-item btn btn-outline-secondary ${
                location.pathname === "/profile" ? "active" : ""
              }`}
              to="/profile"
            >
              <i className="pi pi-user"></i>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}

export default MenuW;
