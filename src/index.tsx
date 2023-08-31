import React from "react";
import ReactDom from "react-dom/client";
import App from "./App";


const hostElement = document.getElementById("pk-game") as HTMLElement;
const root = ReactDom.createRoot(hostElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

