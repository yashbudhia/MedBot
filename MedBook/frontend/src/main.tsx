import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Now NavigationBar has Router context and can use useNavigate */}


      {/* Keep your background styling around App, if desired */}
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
