import { Grommet, Main } from "grommet";
import React from "react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import App from "./views/Landing";
import MapListView from "./views/Map/MapListView";
import MapView from "./views/Map/MapView";
import NotFound from "./views/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="maps" element={<MapListView />} />
        <Route path="maps/:mapId" element={<MapView />} />
        
        <Route path="*" element={<NotFound message="Oops! Dead end." />}
        />
      </Routes>
    </BrowserRouter>
    );
}