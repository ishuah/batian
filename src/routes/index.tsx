import React from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import App from "../views/Landing";
import Maps from "../views/Maps";
import Map from "../views/Map";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="maps" element={<Maps />} />
        <Route path="maps/:mapId" element={<Map />} />
        
        <Route path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Oops! Dead end.</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
    );
}