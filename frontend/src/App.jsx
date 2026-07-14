import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadExcel from './pages/UploadExcel';
import Teachers from './pages/Teachers';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Private routes — guarded by ProtectedRoute, wrapped in the dashboard shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadExcel />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;