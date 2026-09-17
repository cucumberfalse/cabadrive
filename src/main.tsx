import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { startServiceWorkerUpdates } from "./serviceWorkerUpdates";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    void startServiceWorkerUpdates();
  });
}
