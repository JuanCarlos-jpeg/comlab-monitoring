import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/Login';
import DashboardPage from './pages/Dashboard/Dashboard';
import UserManagementPage from './pages/UserManagement/UserManagement';
import ImportDataPage from './pages/ImportData/ImportData';
import ExportDataPage from './pages/ExportData/ExportData';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/import" element={<ProtectedRoute><ImportDataPage /></ProtectedRoute>} />
      <Route path="/export" element={<ProtectedRoute><ExportDataPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
