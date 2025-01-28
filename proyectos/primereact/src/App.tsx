import MenuW from "./Componentes/menuW";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Inicio from "./pages/inicio";
import Mispost from "./pages/mispost";
import Profile from "./Componentes/Profile";
import { EditProfile } from "./Componentes/EditProfile";
import ChangePassword from "./Componentes/ChangePassword";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import { PrivateRoute } from "./Componentes/PrivateRoute";
import Login from "./Componentes/login";
import Register from "./Componentes/Register";
import Monedas from './pages/monedas';
import  { ToastProvider } from './context/ToastContext'
import { Button } from "primereact/button";

const App = () => {
  const navigate = useNavigate();
  const volverinicio = () => {
    navigate("/");
  };

  return (
    <AuthProvider>
      <ToastProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content container-fluid">
                  <Inicio />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <Inicio />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/misposts"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <Mispost />
                </div>
              </div>
            </PrivateRoute>
          }
        />
         <Route
          path="/monedas"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <Monedas />
                </div>
              </div>
            </PrivateRoute>
          }
        />
     
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <Profile />
                </div>
              </div>
            </PrivateRoute>
          }
        />
      
        <Route
          path="/edit-profile"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <EditProfile />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <ChangePassword />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  <TasksPage />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks-create"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content">
                  
                  <TaskFormPage />
               
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <PrivateRoute>
              <div className="app">
                <MenuW />
                <div className="content" style={{justifyItems:'center'}}>
                 
                <div className='card-perso p-3' style={{width:'700px',maxWidth:'100%',textAlign:'center'}} >
         
                <Button onClick={volverinicio} style={{borderRadius:'20%',float:'left'}}icon="pi pi-arrow-left"  outlined severity="danger"  />

                  <TaskFormPage />
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
