import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

        

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);
