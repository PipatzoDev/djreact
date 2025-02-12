import MenuW from "./Componentes/menuW";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Inicio from "./pages/inicio";
import Mispost from "./pages/mispost";
import Profile from "./Componentes/Profile";
import { EditProfile } from "./Componentes/EditProfile";
import ChangePassword from "./Componentes/ChangePassword";
import TasksPage, { TaskPage } from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import { PrivateRoute } from "./Componentes/PrivateRoute";
import Login from "./Componentes/login";
import Register from "./Componentes/Register";
import { ToastProvider } from "./context/ToastContext";
import { Button } from "primereact/button";
import ProfileConfig from "./Componentes/profileconfig";
import {
  ConfirmResetPassword,
  RequestResetPassword,
} from "./Componentes/ResetPassword";

const App = () => {
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
              <div className="content">
                <label>No se encontro la pagina</label>
              </div>
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
          <Route path="/password-reset" element={<RequestResetPassword />} />
          <Route
            path="/password-reset-confirm/:uid/:token"
            element={<ConfirmResetPassword />}
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
                  <div className="content">
                    <TaskPage />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id/edit"
            element={
              <PrivateRoute>
                <div className="app">
                  <MenuW />
                  <div className="content" style={{ justifyItems: "center" }}>
                    <TaskFormPage />
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
