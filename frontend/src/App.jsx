import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { Inbox, ThreadView, NewMessage } from './pages/MessagesPage';
import { MaintenanceList, MaintenanceDetail, NewMaintenanceRequest } from './pages/MaintenancePage';

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/messages" element={<Inbox />} />
          <Route path="/messages/new" element={<NewMessage />} />
          <Route path="/messages/:threadId" element={<ThreadView />} />
          <Route path="/maintenance" element={<MaintenanceList />} />
          <Route path="/maintenance/new" element={<NewMaintenanceRequest />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <AuthPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
