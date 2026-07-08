import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RankingProvider } from './context/RankingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SubmissionsPage from './pages/SubmissionsPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import ResidentPortal from './pages/ResidentPortal';
import LoginPage from './pages/LoginPage';

function DashboardLayout({ searchQuery, onSearch }) {
  return (
    <div className="bg-background text-on-background font-[Geist] selection:bg-primary/30 overflow-hidden">
      <Sidebar />
      <Header onSearch={onSearch} searchQuery={searchQuery} />
      <main className="ml-[72px] mt-16 p-[12px] h-[calc(100vh-64px)] relative z-10 overflow-hidden">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/submissions" element={<SubmissionsPage searchQuery={searchQuery} />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <RankingProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Resident Portal for Citizens only */}
          <Route
            path="/resident"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <ResidentPortal />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard for Officers/Admins only */}
          <Route
            path="/*"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ANALYST', 'WARD_OFFICER']}>
                <DashboardLayout searchQuery={searchQuery} onSearch={setSearchQuery} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </RankingProvider>
    </AuthProvider>
  );
}
