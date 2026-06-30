import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import Sections from './pages/admin/Sections';
import Services from './pages/admin/Services';
import PriceTables from './pages/admin/PriceTables';
import Sliders from './pages/admin/Sliders';
import Contacts from './pages/admin/Contacts';

import { LanguageProvider } from './contexts/LanguageContext';

// Protected Route Checker
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <LanguageProvider>
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="sections" element={<Sections />} />
          <Route path="services" element={<Services />} />
          <Route path="price-tables" element={<PriceTables />} />
          <Route path="sliders" element={<Sliders />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>

        {/* Fallback redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
