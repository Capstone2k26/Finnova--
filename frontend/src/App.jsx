import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Banking from './pages/Banking';
import Trading from './pages/Trading';
import MutualFunds from './pages/MutualFunds';
import Bonds from './pages/Bonds';
import Accounting from './pages/Accounting';
import Learning from './pages/Learning';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';

// Layout
import Layout from './components/Common/Layout';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="banking" element={<Banking />} />
        <Route path="trading" element={<Trading />} />
        <Route path="mutual-funds" element={<MutualFunds />} />
        <Route path="bonds" element={<Bonds />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="learning" element={<Learning />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
