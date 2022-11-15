import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';
import NotFound from './pages/NotFound';

const APP_PATH = '/batian';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_PATH} element={<App />} />
        <Route
          path="*"
          element={<NotFound message="Oops! Dead end." />}
        />
      </Routes>
    </BrowserRouter>
  );
}
