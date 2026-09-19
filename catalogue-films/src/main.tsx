import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contextes/AuthContext";
import { FavorisProvider } from "./contextes/FavorisContext";
import { ThemeProvider } from "./contextes/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavorisProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavorisProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
