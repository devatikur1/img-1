import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FirebaseProvider } from "./contexts/FirebaseProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
  </StrictMode>
);
